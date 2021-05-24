/**
 * 参考 https://github.com/openexchangerates/accounting.js/blob/master/accounting.js
 */

const settings = {
	currency: {
		symbol: "$",
		format: "%s%v",
		decimal: ".",
		thousand: ",",
		precision: 2,
		grouping: 3
	},
	number: {
		precision: 0,
		grouping: 3,
		thousand: ",",
		decimal: "."
	}
}

const nativeMap = Array.prototype.map,
	nativeIsArray = Array.isArray,
	toString = Object.prototype.toString;

function isString(obj) {
	return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
}

function isArray(obj) {
	return nativeIsArray ? nativeIsArray(obj) : toString.call(obj) === '[object Array]';
}

function isObject(obj) {
	return obj && toString.call(obj) === '[object Object]';
}

function defaults(object, defs) {
	let key;
	object = object || {};
	defs = defs || {};

	for (key in defs) {
		if (defs.hasOwnProperty(key)) {
			if (object[key] == null) object[key] = defs[key];
		}
	}
	return object;
}

function map(obj, iterator, context) {
	let results = [], i, j;

	if (!obj) return results;
	if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
	for (i = 0, j = obj.length; i < j; i++) {
		results[i] = iterator.call(context, obj[i], i, obj);
	}
	return results;
}

function checkPrecision(val, base) {
	val = Math.round(Math.abs(val));
	return isNaN(val) ? base : val;
}

function checkCurrencyFormat(format) {
	const defaults = settings.currency.format;

	if (typeof format === "function") format = format();
	if (isString(format) && format.match("%v")) {
		return {
			pos: format,
			neg: format.replace("-", "").replace("%v", "-%v"),
			zero: format
		};

	} else if (!format || !format.pos || !format.pos.match("%v")) {
		return (!isString(defaults)) ? defaults : settings.currency.format = {
			pos: defaults,
			neg: defaults.replace("%v", "-%v"),
			zero: defaults
		};

	}
	return format;
}
const unformat = function (value, decimal) {
	if (isArray(value)) {
		return map(value, function (val) {
			return unformat(val, decimal);
		});
	}
	value = value || 0;
	if (typeof value === "number") return value;

	decimal = decimal || settings.number.decimal;

	const regex = new RegExp("[^0-9-" + decimal + "]", ["g"]),
		unformatted = parseFloat(
			("" + value)
				.replace(/\((?=\d+)(.*)\)/, "-$1") // replace bracketed values with negatives
				.replace(regex, '')         // strip out any cruft
				.replace(decimal, '.')      // make sure decimal point is standard
		);

	return !isNaN(unformatted) ? unformatted : 0;
};

const toFixed = function (value, precision) {
	precision = checkPrecision(precision, settings.number.precision);

	const exponentialForm = Number(unformat(value) + 'e' + precision);
	const rounded = Math.round(exponentialForm);
	const finalResult = Number(rounded + 'e-' + precision).toFixed(precision);
	return finalResult;
};

const formatNumber = function (number, precision, thousand, decimal) {
	if (isArray(number)) {
		return map(number, function (val) {
			return formatNumber(val, precision, thousand, decimal);
		});
	}
	number = unformat(number);
	const opts = defaults(
		(isObject(precision) ? precision : {
			precision: precision,
			thousand: thousand,
			decimal: decimal
		}),
		settings.number
	),
		usePrecision = checkPrecision(opts.precision),
		negative = number < 0 ? "-" : "",
		base = parseInt(toFixed(Math.abs(number || 0), usePrecision), 10) + "",
		mod = base.length > 3 ? base.length % 3 : 0;
	return negative + (mod ? base.substr(0, mod) + opts.thousand : "") + base.substr(mod).replace(/(\d{3})(?=\d)/g, "$1" + opts.thousand) + (usePrecision ? opts.decimal + toFixed(Math.abs(number), usePrecision).split('.')[1] : "");
};

const formatMoney = function (number, symbol = '￥', precision, thousand, decimal, format) {
	if (isArray(number)) {
		return map(number, function (val) {
			return formatMoney(val, symbol, precision, thousand, decimal, format);
		});
	}

	number = unformat(number);

	const opts = defaults(
		(isObject(symbol) ? symbol : {
			symbol: symbol,
			precision: precision,
			thousand: thousand,
			decimal: decimal,
			format: format
		}),
		settings.currency
	),
		formats = checkCurrencyFormat(opts.format),
		useFormat = number > 0 ? formats.pos : number < 0 ? formats.neg : formats.zero;
	return useFormat.replace('%s', opts.symbol).replace('%v', formatNumber(Math.abs(number), checkPrecision(opts.precision), opts.thousand, opts.decimal));
};

const formatColumn = function (list, symbol, precision, thousand, decimal, format) {
	if (!list || !isArray(list)) return [];
	let opts = defaults(
		(isObject(symbol) ? symbol : {
			symbol: symbol,
			precision: precision,
			thousand: thousand,
			decimal: decimal,
			format: format
		}),
		settings.currency
	),
		formats = checkCurrencyFormat(opts.format),
		padAfterSymbol = formats.pos.indexOf("%s") < formats.pos.indexOf("%v") ? true : false,
		maxLength = 0,

		formatted = map(list, function (val) {
			if (isArray(val)) {
				return formatColumn(val, opts);
			} else {
				val = unformat(val);

				const useFormat = val > 0 ? formats.pos : val < 0 ? formats.neg : formats.zero,
					fVal = useFormat.replace('%s', opts.symbol).replace('%v', formatNumber(Math.abs(val), checkPrecision(opts.precision), opts.thousand, opts.decimal));
				if (fVal.length > maxLength) maxLength = fVal.length;
				return fVal;
			}
		});

	return map(formatted, function (val) {
		if (isString(val) && val.length < maxLength) {
			return padAfterSymbol ? val.replace(opts.symbol, opts.symbol + (new Array(maxLength - val.length + 1).join(" "))) : (new Array(maxLength - val.length + 1).join(" ")) + val;
		}
		return val;
	});
};

export default {
	settings,
	formatColumn,
	formatNumber,
	formatMoney,
	toFixed
}
