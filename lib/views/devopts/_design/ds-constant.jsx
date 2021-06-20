import { PolySymbol } from '../../../api/global-symbol'
/**
 * ds-worker role 程序员
 */
export const DS_WORKER_SYMBOL = PolySymbol('DS_WORKER_SYMBOL')

/**
 * ds-component slot 插槽
 */
export const DS_SLOT_SYMBOL = PolySymbol('DS_SLOT_SYMBOL')

 /**
 * ds-component component 组件
 */
export const DS_COMPONENT_SYMBOL = PolySymbol('DS_COMPONENT_SYMBOL')

/**
 * ds-component children 内容
 */
export const DS_CHILDREN_SYMBOL = PolySymbol('DS_CHILDREN_SYMBOL')

/**
 *ds-config strategy 配置控件的处理策略
 */
export const DS_CONFIG_STRATEGY_INNER = 'inner'
export const DS_CONFIG_STRATEGY_WAPPER = 'wapper'
export const DS_CONFIG_STRATEGY_ALL = 'all'
export const DS_CONFIG_STRATEGY = {
  ATabPane: DS_CONFIG_STRATEGY_INNER,
  span: DS_CONFIG_STRATEGY_INNER,
  SPAN: DS_CONFIG_STRATEGY_INNER,
  Span: DS_CONFIG_STRATEGY_INNER,
  amodal: DS_CONFIG_STRATEGY_ALL
}

