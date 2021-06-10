import currency from 'currency.js/dist/currency.es'
import accounting from '../../api/tools/accounting'
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

/**
 * @param {*} value 值
 * @param {*} iunit 单位
 * @param {*} precision 精度 0.01
 * @param {*} defaultValue 默认值
 * @returns 
 */
export function divide(value, iunit, precision, defaultValue = value) {
  return !isNumber(value) ? defaultValue : currency(value, { precision: precision || maxPrecision(value, iunit) }).divide(iunit).value
}

export function multiply(value, iunit, precision, defaultValue = value) {
  return !isNumber(value) ? defaultValue : currency(value, { precision: precision || maxPrecision(value, iunit) }).multiply(iunit).value
}

export function subtract(value, iunit, precision, defaultValue = value) {
  return !isNumber(value) ? defaultValue : currency(value, { precision: precision || maxPrecision(value, iunit) }).subtract(iunit).value
}

export function add(value, iunit, precision, defaultValue = value) {
  return !isNumber(value) ? defaultValue : currency(value, { precision: precision || maxPrecision(value, iunit) }).add(iunit).value
}

/**
 * 
 * @param {*} value 值
 * @param {*} defaultValue 默认值
 * @param {*} precision // 精度(整数)
 * @param {*} thousand // 千分位符号: 默认逗号
 * @param {*} decimal // 小数点位符号： 默认是点号
 * @returns 
 */
export function formatNumber(value, defaultValue = value, precision, thousand, decimal) {
  return !isNumber(value) ? defaultValue : accounting.formatNumber(value, precision, thousand, decimal)
}

export function formatMoney(value, defaultValue = value, symbol, precision, thousand, decimal) {
  return !isNumber(value) ? defaultValue : accounting.formatMoney(value, symbol, precision, thousand, decimal)
}

/**
 * 定义通用单位转换处理(十进制)
 * @param {*} unit 单位 100 1000 1000  0.001
 * @param {*} precision  精度
 * @returns 
 */
export function createUnitConver(unit, precision, options) {
  return {
    ...options,
    // 原始值 =》转换值
    formatter: function (v) {
      return divide(v, unit, precision)
    },

    // 转换值 =》原始值
    parser: function (v) {
      return multiply(v, unit, precision)

    },
  }
}
