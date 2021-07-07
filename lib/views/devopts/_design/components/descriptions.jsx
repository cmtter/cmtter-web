/**
 * 详情列表
 */
 const props = {
  ui: 'adescriptions',
  size: 'small|middle'
}

/**
 * 可配置插槽
 */
const slots = {
  title: [{
    tag: 'div',
    children: ['基础信息']
  }]
}

/**
 * 可配置内容
 */
const children = [{
  tag: 'ADescriptions.Item',
  props: {
    label: '标签'
  },
  children: ['内容']
},{
  tag: 'ADescriptions.Item',
  props: {
    label: '标签'
  },
  children: ['内容']
},
{
  tag: 'ADescriptions.Item',
  props: {
    label: '标签'
  },
  children: ['内容']
},
{
  tag: 'ADescriptions.Item',
  props: {
    label: '标签'
  },
  children: ['内容']
},
{
  tag: 'ADescriptions.Item',
  props: {
    label: '标签'
  },
  children: ['内容']
},
{
  tag: 'ADescriptions.Item',
  props: {
    label: '标签'
  },
  children: ['内容']
}

]

/**
 * 标签
 */
const tag = 'adescriptions'
/**
 * 标题
 */
const tagText = 'descriptions详情列表'

export default {
  tag,
  props,
  slots,
  children,
  tagText
}

