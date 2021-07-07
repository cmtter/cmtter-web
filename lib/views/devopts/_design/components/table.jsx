const props = {
  ui: 'atable',
  flex: 'auto',
  rowSelection: {},
  columns: [
    {
      title: 'col1',
      dataIndex: 'col1',
      key: 'col1',
    },
    {
      title: 'col2',
      dataIndex: 'col2',
      key: 'col2',
    },
    {
      title: 'col3',
      dataIndex: 'col3',
      key: 'col3',
    },
    {
      title: 'col4',
      dataIndex: 'col4',
      key: 'col4',
    },
    {
      title: 'col5',
      dataIndex: 'col5',
      key: 'col5',
    }
  ],
  datasource: {
    total: 50, 
    pageSize: 10, 
    current: 1,
    datas: [
     { col1: 'data1', col2: 'dataw', col3: 'dataw', col4: 'dataw', col5: 'dataw', key: 1},
     { col1: 'data1', col2: 'dataw', col3: 'dataw', col4: 'dataw', col5: 'dataw', key: 2},
     { col1: 'data1', col2: 'dataw', col3: 'dataw', col4: 'dataw', col5: 'dataw', key: 1},
     { col1: 'data1', col2: 'dataw', col3: 'dataw', col4: 'dataw', col5: 'dataw', key: 1},
     { col1: 'data1', col2: 'dataw', col3: 'dataw', col4: 'dataw', col5: 'dataw', key: 1},
     { col1: 'data1', col2: 'dataw', col3: 'dataw', col4: 'dataw', col5: 'dataw', key: 1},
     { col1: 'data1', col2: 'dataw', col3: 'dataw', col4: 'dataw', col5: 'dataw', key: 1},
     { col1: 'data1', col2: 'dataw', col3: 'dataw', col4: 'dataw', col5: 'dataw', key: 1},
     { col1: 'data1', col2: 'dataw', col3: 'dataw', col4: 'dataw', col5: 'dataw', key: 1},
     { col1: 'data1', col2: 'dataw', col3: 'dataw', col4: 'dataw', col5: 'dataw', key: 1},
    ]
  }
}

const children = []

const slots = {
  col5CellSlot: [
    {
      tag: 'span',
      children: [
        {
          tag: 'abutton',
          props: {
            type: 'link',
            ignoreLayout: true
          },
          children: ['修改']
        },
        ' | ',
        {
          tag: 'a',
          props: {
            ignoreLayout: true
          },
          children: ['删除']
        }
      ]
    }
  ],
  expandedRowRender: [
    {
      tag: 'div',
      children: [
        '扩展内容'
      ]
    }
  ],
  title: [
    {
      tag: 'span',
      children: ['标题']
    }
  ]
}

const tag = 'atable'

const tagText = 'table表格'

export default {
  tag,
  props,
  slots,
  children,
  tagText
}

