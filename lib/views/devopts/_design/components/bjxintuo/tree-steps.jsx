const props = {
  ui: 'treesteps',
  current: 311,
  datas: [
    {
      group: true,
      desc: '产品立项',
      label: '产品立项',
      lineDesc: '审议通过',
      key: 1,
      children: [
        {
          label: '产品立项',
          key: 11,
        }
      ]
    },
    {
      group: true,
      desc: '募集阶段',
      label: '募集阶段',
      lineDesc: '产品成立',
      key: 2,
      children: [
        {
          label: '产品筹备',
          key: 21,
        },
        {
          label: '产品设置',
          key: 22,
        },
        {
          label: '产品募集',
          key: 23,
        }
      ]
    },
    {
      group: true,
      desc: '存续阶段',
      label: '存续阶段',
      key: 3,
      lineDesc: '',
      children: [
        {
          label: '核算计划',
          key: 31,
          children: [
            {
              label: '资金端运营',
              key: 311
            },
            {
              label: '资产端运营',
              key: 321,
            }
          ]
        },

      ]
    },
    {
      group: true,
      desc: '清算阶段',
      label: '清算阶段',
      key: 4,
      children: [
        {
          label: '清算阶段',
          key: 41,
        }
      ]
    }
  ]
}
const children = []

const slots = {}

const tag = 'treesteps'

const tagText = '扩展项目周期导航'

export default {
  tag,
  props,
  slots,
  children,
  tagText
}

