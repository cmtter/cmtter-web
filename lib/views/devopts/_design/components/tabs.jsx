const props = {
  ui: 'atabs',
  closable: false
}

const children = [
  {
    tag: 'ATabs.TabPane',
    props: {
      tab: 'tab1',
      key: 'tab1'
    },
    children:[
      {
        tag: 'div',
        children: ['内容']
      }
    ]
  },
  {
    tag: 'ATabs.TabPane',
    props: {
      tab: 'tab2',
      key: 'tab2',
    },
    children:[
      {
        tag: 'div',
        children: ['内容']
      }
    ]
  }
]

const slots = {
  tabBarExtraContent: [
    {
      tag: 'span',
      children: ['扩展内容']
    }
  ]
}

const tag = 'atabs'

const tagText = 'tabs标签页'

export default {
  tag,
  props,
  slots,
  children,
  tagText
}

