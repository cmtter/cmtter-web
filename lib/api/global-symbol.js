let uuidtag = 0

export const hasSymbol =
  typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol'

export const uuid = prefix => (prefix || '') + (++uuidtag)

export const PolySymbol = (name) => (hasSymbol ? Symbol(name) : name + '-' + uuid())

/**
 * router-tabs provide key
 */
export const ROUTER_TABS_SYMBOL = PolySymbol('ROUTER_TABS_SYMBOL')

/**
 * 朱布局内容Ref，用户tabs affix
 */
export const MAIN_LAYOUT_CONTENT = PolySymbol('MAIN-LAYOUT-CONTENT')


/**
 * 是否显示top Menu
 */
export const IS_SHOW_TOP_MENU = false

/**
 *  Http异常解析策略配置
 * {
 *   message: '异常描述',
 *   ok: boolean
 * }
 * 
 * @param response
 */
export const HTTP_EXCEPTION_POLICY = () => {
  return null
}

/**
 * Http超时参数 分钟 * 秒单位 * 毫秒单位
 */
export const HTTP_TIMEOUT = 2 * 60 * 1000

/**
 * 位置Http异常代码
 */
export const UNKNOW_HTTP_EXCEPTION_CODE = '99999'

