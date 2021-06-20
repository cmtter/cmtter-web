const props = {
  ui: 'atree',
  checkable: false,
  expandedKeys: [],
  selectedKeys: [],
  checkedKeys: [],
  treeData: [
    {
      title: '节点1',
      key: '1',
      children: [
         { title: '字节点1' ,key: '1-0', disabled: true},
         { title: '字节点2' ,key: '1-2', disableCheckbox: true},
         { title: '字节点3' ,key: '1-3'}
      ]
    },
    {
      title: '节点2',
      key: '2',
      children: [
        { title: '字节点1' ,key: '2-0'},
        { title: '字节点2' ,key: '2-2'},
        { title: '字节点3' ,key: '2-3'}
      ]
    }
  ]
}

const children = []

const slots = {
  title: []
}

const tag = 'atree'

const tagText = '树控件'

export default {
  tag,
  props,
  slots,
  children,
  tagText
}

