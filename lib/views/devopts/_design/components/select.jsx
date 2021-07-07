const props = {
  ui: 'select',
  ddtype: 'multiple | multiple-autocomplete | autocomplete',
  value: null,
  onUpdate_value: null,
  datas: [
    { value: 1, label: '选项1'},
    { value: 2, label: '选项1'},
  ]
}

const children = []

const slots = {}

const tag = 'select'

const tagText = 'select选择框'

export default {
  tag,
  props,
  slots,
  children,
  tagText
}

