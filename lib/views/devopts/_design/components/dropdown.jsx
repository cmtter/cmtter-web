const props = {
  ui: 'dropdown',
  ignoreLayout: true,
  style: {
    margin: ''
  }
}

const children = [{
  tag: 'abutton',
  dsConfig: false,
  props: {
    ignoreLayout: true,
    style: {
      margin: '0 0 0 5px'
    }
  },
  children: ['下拉菜单', {
    dsConfig: false,
    tag: 'iconDownOutlined'
  }]
}]

const slots = {
  overlay: [
    {
      tag: 'AMenu',
      dsConfig: false,
      props: {
        onClick: null
      },
      children: [
        {
          tag: 'AMenu.Item',
          dsConfig: false,
          props:{
            key: 'add1'
          },
          children: [
            {
              dsConfig: false,
              tag: 'a',
              props: {},
              children: ['菜单1']
            }
          ]
        },
        {
          tag: 'AMenu.Item',
          dsConfig: false,
          props:{
            key: 'add2'
          },
          children: [
            {
              tag: 'a',
              dsConfig: false,
              props: {},
              children: ['菜单2']
            }
          ]
        }
      ]
    }      
  ]
}

const tag = 'adropdown'

const tagText = '下拉菜单'

export default {
  tag,
  props,
  slots,
  children,
  tagText
}

