const props = {
  ui: 'amodal',
  visible: false,
  title: '标题',
  okText: '保存',
  cancelText: '关闭',
}

const children = [{
  tag: 'div',
  children: ['对话框内容']
}]

const slots = {}

const tag = 'amodal'

const tagText = '对话框'

export default {
  tag,
  props,
  slots,
  children,
  tagText
}

