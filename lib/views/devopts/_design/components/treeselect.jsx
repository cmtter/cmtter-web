const props = {
  ui: 'treeselect',
  ddtype: 'multiple',
  value: null,
  onUpdate_value: null,
  datas: [
    {
      value: 1,
      label: '选项1',
      children: [
        {
          value: 11,
          label: '子选项1-1'
        },
        {
          value: 12,
          label: '子选项1-2'
        }
      ]
    },
    {
      value: 2,
      label: '选项2',
      children: [
        {
          value: 21,
          label: '子选项2-1'
        },
        {
          value: 22,
          label: '子选项2-2'
        }
      ]
    }
  ]
}

const children = []

const slots = {}

const tag = 'treeselect'

const tagText = '树选择框'

export default {
  tag,
  props,
  slots,
  children,
  tagText
}

