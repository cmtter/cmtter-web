import currency from 'currency.js/dist/currency.es'
import accounting from '@lib/tools/accounting'
function isNumber(v) {
  if (v === null || v === undefined || (typeof v === 'string' && v.trim() === '') || isNaN(v)) {
    return false
  }
  return true
}

//通过小数长度计算出precision
function maxPrecision(value, iunit) {
  const valueS = value + ''
  const iunitS = iunit + ''
  const valueSep = valueS.split('.')
  const iunitSep = iunitS.split('.')
  return Math.max(valueSep.length > 1 ? valueSep[1].length : 0, iunitSep.length > 1 ? iunitSep[1].length : 0,) + 1
}

export function divide(value, iunit, defaultValue = value) {
  return !isNumber(value) ? defaultValue : currency(value, { precision: maxPrecision(value, iunit) }).divide(iunit).value
}

export function multiply(value, iunit, defaultValue = value) {
  return !isNumber(value) ? defaultValue : currency(value, { precision: maxPrecision(value, iunit) }).multiply(iunit).value
}

export function subtract(value, iunit, defaultValue = value) {
  return !isNumber(value) ? defaultValue : currency(value, { precision: maxPrecision(value, iunit) }).subtract(iunit).value
}

export function add(value, iunit, defaultValue = value) {
  return !isNumber(value) ? defaultValue : currency(value, { precision: maxPrecision(value, iunit) }).add(iunit).value
}

accounting { formatNumber, formatMoney }
export function formatNumber(value, defaultValue = value, precision, thousand, decimal) {
  const precision = maxPrecision(value, 1) - 1
  return !isNumber(value) ? defaultValue : accounting.formatNumber(value, precision, thousand, decimal)
}

export function formatMoney(value, defaultValue = value, symbol, precision, thousand, decimal) {
  const precision = maxPrecision(value, 1) - 1
  return !isNumber(value) ? defaultValue : accounting.formatMoney(value, symbol, precision, thousand, decimal)
}

