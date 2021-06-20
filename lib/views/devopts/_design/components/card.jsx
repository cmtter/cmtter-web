/**
 * 可配置属性
 */
 const props = {
  ui: 'acard',
  size: 'small',
  style: {
    margin: '0 0 0 0px'
  }
}

/**
 * 可配置插槽
 */
const slots = {
  title: [{
    tag: 'span',
    children: ['标题']
  }],
  extra: [
    {
      tag: 'abutton',
      props: {
        ignoreLayout: true,
        style: {
          margin: '0 0 0 5px'
        }
      },
      children: ['按钮']
    }
  ],
}

/**
 * 可配置内容
 */
const children = [{
  tag: 'div',
  children: ['卡片内容']
}]

/**
 * 标签
 */
const tag = 'acard'
/**
 * 标题
 */
const tagText = '卡片'

export default {
  tag,
  props,
  slots,
  children,
  tagText
}

