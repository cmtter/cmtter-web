import UI, { UIConfig } from '@lib/components/ui'
import { UserOutlined, InfoCircleOutlined } from '@ant-design/icons-vue'
import { Card, Button, Descriptions, Dropdown, Menu} from 'ant-design-vue'
import { createVNode } from 'vue'
const { DefineRules } = UIConfig
const DescriptionsItem = Descriptions.Item

// 表单状态模型
export const _testFormState = {
  cmtter1: '默认值',
  cmtter11111: '默认值',
  cmtter2: null,
  cmtter3: null,
  cmtter4: null,
  cmtter5: null,
  cmtter6: null,
  cmtter7: 1211223,
  cmtter8: null,
  cmtter9: null,
  cmtter10: null,
  cmtter11: null,
  cmtter12: null,
  cmtter13: null,
  cmtter14: null,
  cmtter15: null,
  cmtter16: null,
  cmtter17: null,
  cmtter18: null,
  cmtter19: null,

  cmtter20: null,
  cmtter21: null,
  cmtter22: null,
  cmtter23: null,
  cmtter24: null,
  cmtter25: null,
  cmtter26: null,
  cmtter27: null,
  cmtter28: null,
  cmtter29: { "value": 11, "label": "否11", "key": 11 },
  cmtter30: null,
  cmtter31: null,
  cmtter32: null,
  cmtter33: null,
  cmtter34: null,
  cmtter35: null,
  cmtter36: null,
  cmtter37: null,
  cmtter38: null,

  cmtter39: null,
  cmtter40: null,
  cmtter41: null,
  cmtter42: null,
  cmtter43: null,
  cmtter44: null,
  cmtter45: null,
  fileList: []
}

// 表单模型状态校验
export const _testFormStateRules = {
  cmtter1: [
    // DefineRules.isRequired() 
    DefineRules.isNumber(10, 100, '数字范围10~100')
  ]
}

//测试组件
const testInput_prefix = () => <UserOutlined></UserOutlined>
const testInput_suffix = () => createVNode(InfoCircleOutlined, {}, null)
// 测试普通输入框
const testInput = UI.form.input.generate({
  label: '输入框',
  placeholder: '请输入名称',
  //flex: '0 0 350px',
  rules: _testFormStateRules.cmtter1,
  prefix: testInput_prefix,
  suffix: testInput_suffix
})
//文本域
const testTextArea = UI.form.input.generate({
  label: '文本域',
  placeholder: '请输入名称',
  //flex: '0 0 350px',
  inputType:'textarea'
})

// 测试联系方式
const testInputPhone = UI.form.input.phone.generate({
 // flex: '0 0 350px'
})

// 测试邮箱
const testInputEmail = UI.form.input.email.generate({
  //flex: '0 0 350px'
})

// 测试数字
const testInputNumber = UI.form.input.number.generate({
 //flex: '0 0 350px'
})

// 整数
const testInputInteger = UI.form.input.integer.generate({
  //flex: '0 0 350px'
})

//测试币种
const testInputCurrency = UI.form.input.currency.generate({
  //flex: '0 0 350px'
})

//测试币种-万元
const testInputCurrencyWanyuan = UI.form.input.currency.generate({
  //flex: '0 0 350px',
  ...(UIConfig.units['万元'])
})

//百分比
const testInputPercentage = UI.form.input.percentage.generate({
  //flex: '0 0 350px'
})

//日期
const testInputDate = UI.form.input.date.generate({
  //flex: '0 0 350px'
})

// 日期时间
const testInputDatetime = UI.form.input.datetime.generate({
  //flex: '0 0 350px'
})

// 表单分组
const testFormGroup = UI.form.group.generate({
  //flex: '0 0 700px',
  labelCol: 6,
  showSeparator: true,
  rules: [
    DefineRules.isValidator(function () {
      if (!this.m1 || !this.m2) {
        return Promise.reject(((this.m1 ? '' : '起始时间') || (this.m2 ? '' : '结束时间')) + '不能为空')
      }
      if (this.m1 >= this.m2) {
        return Promise.reject('结束时间必须大于起始时间')
      }
      return Promise.resolve(null)
    }, undefined, 'change')
  ],
  groups: [
    { vmodel: 'm1', ui: UI.form.input.datetime.generate({ col: 11, placeholder: '开始时间' }) },
    { vmodel: 'm2', ui: UI.form.input.datetime.generate({ col: 11, placeholder: '结束时间' }) }
  ]
})

//测试日期段
const testFormInputDateRange = UI.form.input.date.range.generate({
  //flex: '0 0 600px',
  labelCol: 6,
  sVmodel: 'cmtter11',
  eVmodel: 'cmtter12',
  rules: [
    DefineRules.isValidator(function () {
      if (!this.cmtter11 || !this.cmtter12) {
        return Promise.reject(((this.cmtter11 ? '' : '起始日期') || (this.cmtter14 ? '' : '结束日期')) + '不能为空')
      }
      if (this.cmtter11 >= this.cmtter12) {
        return Promise.reject('结束日期必须大于起始日期')
      }
      return Promise.resolve(null)
    }, undefined, 'change')
  ],
})

//测试日期时间段
const testFormInputDatetimeRange = UI.form.input.datetime.range.generate({
 // flex: '0 0 650px',
 labelCol: 6,
  sVmodel: 'cmtter13',
  eVmodel: 'cmtter14',
  rules: [
    DefineRules.isValidator(function () {
      if (!this.cmtter13 || !this.cmtter14) {
        return Promise.reject(((this.cmtter13 ? '' : '起始时间') || (this.cmtter14 ? '' : '结束时间')) + '不能为空')
      }
      if (this.cmtter13 >= this.cmtter14) {
        return Promise.reject('结束时间必须大于起始时间')
      }
      return Promise.resolve(null)
    }, undefined, 'change')
  ],
})

// 测试金额段
const testFormInputCurrencyRange = UI.form.input.currency.range.generate({
  //flex: '0 0 600px',
  labelCol: 6,
  sVmodel: 'cmtter17',
  eVmodel: 'cmtter18',
  rules: [
    DefineRules.isValidator(function () {
      if (!this.cmtter17 || !this.cmtter18) {
        return Promise.reject(((this.cmtter17 ? '' : '最小金额') || (this.cmtter18 ? '' : '最大金额')) + '不能为空')
      }
      if (this.cmtter17 >= this.cmtter18) {
        return Promise.reject('最大金额必须大于最小金额')
      }
      return Promise.resolve(null)
    }, undefined, 'change')
  ],
})

// 测试数字段
const testFormInputNumberRange = UI.form.input.number.range.generate({
  //flex: '0 0 600px',
  labelCol: 6,
  sVmodel: 'cmtter19',
  eVmodel: 'cmtter20',
  rules: [],
})

// 测试整数段
const testFormInputIntegerRange = UI.form.input.integer.range.generate({
  //flex: '0 0 600px',
  labelCol: 6,
  sVmodel: 'cmtter21',
  eVmodel: 'cmtter22',
  rules: [],
})

// 测试百分比段
const testFormInputPercentageRange = UI.form.input.percentage.range.generate({
  //flex: '0 0 600px',
  labelCol: 6,
  sVmodel: 'cmtter23',
  eVmodel: 'cmtter24',
  rules: [],
})

//测试数据源
const testDatasource = UI.datasource.generate({
  url: '/mock/base/getUserInfo',
  method: 'POST',
  showLoadding: true,
  autoLoad: true
})

//测试操作
const testAction = UI.action.generate({})

// 容器
const testContaner = UI.contaner.generate({
  columnCount: 2,
  justify: 'start'
})

//测试通用组件创建--Card
const testCard = UI.component.generate({
  col: 12,
  component: Card,
  props: {
    title: '标题',
    size: 'small'
  },
  slots: {
    default: ({hostComp}) => {
      return <div> hello! 我是基于UI.component.generate创建的控件, 访问宿主环境变量 [{hostComp.hostVar}] <Button onClick={hostComp.updateHostVar}>点击我更改宿主环境变量</Button></div>
    }
  }
})

// 创建简单的select
const testSimpleSelect = UI.form.select.generate({
  flex: '0 0 550px',
  rules: [DefineRules.isValidator(function (v, options) {
    //v.host  宿主
    if (v && options && options.value) {
      return Promise.resolve()
    }
    //不能返回undefined
    return Promise.reject(false)
  }, '必填项', 'change')],
  datas: [
    { v: 1, l: '是1', a: '123' },
    { v: 2, l: '否2', a: '123' },
    { v: 3, l: '否3', a: '123' },
    { v: 4, l: '否4', a: '123' },
    { v: 5, l: '否5', a: '123' },
    { v: 6, l: '否6', a: '123' },
    { v: 7, l: '否7', a: '123' },
    { v: 8, l: '否8', a: '123' },
    { v: 9, l: '否9', a: '123' },
    { v: 10, l: '否10', a: '123' },
    { v: 11, l: '否11', a: '123' },
    { v: 12, l: '否12', a: '123' },
    { v: 13, l: '否13', a: '123' },
    { v: 14, l: '否14', a: '123' }
  ],
  fields: ['v', 'l']
})

const testMultipleSimpleSelect = UI.form.select.multiple.generate({
  flex: '0 0 550px',
  label: '2万条(多选)',
  rules: [DefineRules.isValidator(function (v, options) {
    //v.host  宿主
    if (v && options && options.length >= 3) {
      return Promise.resolve()
    }
    //不能返回undefined
    return Promise.reject(false)
  }, '必填项，且必须至少选择3个', 'change')],
  loadDatas: function () {
    // this 访问数组环境
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Array.from({ length: 20000 }).map((r, index) => ({
          v: index + (r || '_id'),
          l: '选项' + (index + 1)
        })))
      }, 100);
    })
  },
  fields: ['v', 'l']
})

let uuid = 1
const testAutocompleteSelect = UI.form.select.autocomplete.generate({
  flex: '0 0 550px',
  loadDatasAsync: function (text) {
    //this 是host宿主环境
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Array.from({ length: 10 }).map((r, index) => ({
          v: (++uuid) + (r || ''),
          l: (text || '选项') + (index + 1)
        })))
      }, 100);
    })

  },
  fields: ['v', 'l']
})

const testMultipleAutocompleteSelect = UI.form.select.multiple.autocomplete.generate({
  flex: '0 0 550px',
  loadDatasAsync: function (text) {
    //this 是host宿主环境
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Array.from({ length: 10 }).map((r, index) => ({
          v: (++uuid) + (r || ''),
          l: (text || '选项') + (index + 1)
        })))
      }, 100);
    })

  },
  fields: ['v', 'l']
})


//创建tree数据
function createTreeData(level, childrenCount, total, rootCount) {
  if (level === 0 || level < total) {
    return Array.from({ length: level === 0 ? rootCount : childrenCount }).map((r, index) => ({
      value: '节点id-' + (r || index) + '-' + level + '' + (++uuid),
      label: '节点label-' + (r || index) + '-' + level,
      uuid: ++uuid,
      ...(total === 0 ? {} : { children: createTreeData(level + 1, childrenCount, total, rootCount) })
    }))
  } else {
    return Array.from({ length: childrenCount }).map((r, index) => ({
      value: '节点id-' + (r || index) + '-' + level + '' + (++uuid),
      label: '节点label-' + (r || index) + '-' + level,
      uuid: ++uuid
    }))
  }
}
// 测试下拉树
const testTreeSelect = UI.form.tree.select.generate({
  label: '静态数据(单)',
  flex: '0 0 750px',
  datas: createTreeData(0, 2, 1, 4),
  // canSelectParent: true,
  // loadDatas: function(){
  //   // this 代表宿主
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve(createTreeData(0, 1, 1, 3))
  //     }, 5000);
  //   })
  // }
  // /**
  //  * 异步模式下 isLeaf需要手动维护
  //  * @param {*} treenode 
  //  * @param {*} params 
  //  * @returns 
  //  */
  // loadDatasAsync: function(treenode, params){
  //   // this 宿主
  //   console.log(treenode, params);
  //   return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(createTreeData(0, 1, 0, 3).map(r => ({...r, isLeaf: r.uuid % 3 === 0})))
  //   }, 1000);
  //   })
  // }
})

const testTreeSelect1 = UI.form.tree.select.generate({
  flex: '0 0 750px',
  label: '父节点不可选',
  datas: createTreeData(0, 2, 1, 4),
  canSelectParent: false
})

const testTreeSelect2 = UI.form.tree.select.generate({
  flex: '0 0 750px',
  label: '接口获取数据',
  loadDatas: function () {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(createTreeData(0, 2, 1, 4),)
      }, 5000);
    })
  }
})

const testTreeSelect3 = UI.form.tree.select.generate({
  flex: '0 0 750px',
  label: '按需加载',
  loadDatasAsync: function () { // function(treenode, params){
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(createTreeData(0, 1, 0, 3).map(r => ({ ...r, isLeaf: r.uuid % 3 === 0 })))
      }, 1000);
    })
  }
})

// tree多选
const testTreeMultipleSelect = UI.form.tree.select.multiple.generate({
  flex: '0 0 750px',
  label: '静态数据(多)',
  datas: createTreeData(0, 3, 1, 5),
})

const testTreeMultipleSelect1 = UI.form.tree.select.multiple.generate({
  flex: '0 0 750px',
  label: '父节点不可选(多)',
  datas: createTreeData(0, 3, 1, 5),
  canSelectParent: false
})

const testTreeMultipleSelect2 = UI.form.tree.select.multiple.generate({
  flex: '0 0 750px',
  label: '父节点不可选(多)',
  loadDatas: function () {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(createTreeData(0, 2, 1, 4),)
      }, 5000);
    })
  }
})


const testTreeMultipleSelect3 = UI.form.tree.select.multiple.generate({
  flex: '0 0 750px',
  label: '按需加载(多)',
  loadDatasAsync: function () { //function(treenode, params){
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(createTreeData(0, 1, 0, 3).map(r => ({ ...r, isLeaf: r.uuid % 3 === 0 })))
      }, 1000);
    })
  }
})

// 工具条
const testToolbar = UI.toolbar.generate({
  col: 24,
  max: 4,
  actions: Array.from({ length: 10 }).map(() => ({
    action: 'acttion-' + (++uuid),
    text: '新增操作' + (++uuid)
  }))
})

const testToolbar1 = UI.toolbar.generate({
  col: 24,
  align: 'left',
  max: 2,
  actions: Array.from({ length: 10 }).map(() => ({
    action: 'acttion-' + (++uuid),
    text: '新增操作' + (++uuid)
  }))
})

const testToolbar2 = UI.toolbar.generate({
  col: 24,
  align: 'center',
  max: 4,
  actions: Array.from({ length: 10 }).map(() => ({
    action: 'acttion-' + (++uuid),
    text: '新增操作' + (++uuid)
  }))
})

//表格
const testTable = UI.datatable.generate({
  flex: 'auto',
  columns: [
    {
      // title: '姓名',
      dataIndex: 'name',
      key: 'name',
      //统一设置为true，这样可以在@change 事件中对数据进行排序
      sorter: true,
      colSpan: 2
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
      colSpan: 0
    }
  ],
  slots: {
    nameCellSlot: function () {
      return <a>ddddddddddd</a>
    },
    ageCellSlot: function () {
      return <a>ddddddddddd--age</a>
    },
    nameHeaderSlot: function () {
      return <a style="color:red">自定义头</a>
    },
    title: function () {
      return <div style="text-align: right;"> 测试title </div>
    },
    footer: function () {
      return <div style="text-align: right;"> 测试Footer </div>
    }
  }
})

// 头分组
const testTable1 = UI.datatable.generate({
  flex: 'auto',
  columns: [
    {
      title: '基本信息',
      children: [
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '学历',
          dataIndex: 'xueli',
          key: 'xueli',
        },
        {
          title: '生日',
          dataIndex: 'brs',
          key: 'brs',
        },
      ]
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address'
    }
  ]
})

// 行分组
function createCustomRender(filed) {
  return ({ record, text }) => {
    const rowSpanF = record.rowSpanF || {}
    return {
      children: <span>{text}</span>,
      props: {
        rowSpan: (filed in rowSpanF) ? rowSpanF[filed] : 1
      }
    }
  }
}
const testTable2 = UI.datatable.generate({
  flex: 'auto',
  columns: [
    //  a a2 a21  a22 a211 a212
    {
      title: 'a',
      dataIndex: 'a',
      customRender: createCustomRender('a')
    },
    {
      title: 'a2',
      dataIndex: 'a2',
      customRender: createCustomRender('a2')
    },
    {
      title: 'a21',
      dataIndex: 'a21',
      customRender: createCustomRender('a22')
    },
    {
      title: 'a22',
      dataIndex: 'a22',
      customRender: createCustomRender('a22')
    },


    {
      title: 'a211',
      dataIndex: 'a211',
      customRender: createCustomRender('a211')
    },
    {
      title: 'a212',
      dataIndex: 'a212',
      customRender: createCustomRender('a212')
    }
  ]
})

// const testTreeData = [
//   {
//     a: 'a1',
//     a2: 'a2',
//     children: [
//       { a21: 'a21-1', a22: 'a22-1' },
//       { a21: 'a21-2', a22: 'a22-2' },
//       {
//         a21: 'a21-3',
//         a22: 'a22-3',
//         children: [
//           { a211: 'a211-1', a212: 'a212-1' },
//           { a211: 'a211-2', a212: 'a212-2' },
//           { a211: 'a211-3', a212: 'a212-3' }
//         ]
//       },
//       { a21: 'a21-4', a22: 'a22-4' }
//     ]
//   }
// ]

//扩展列(应用字段特别多的场景)
const testTable3 = UI.datatable.generate({
  flex: 'auto',
  columns: [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    { title: 'Action', dataIndex: '', key: 'x', },
  ],
  datasource: [
    {
      key: 1,
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
    },
    {
      key: 2,
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
    },
    {
      key: 3,
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.',
    },
  ],
  slots: {
    expandedRowRender: function ({record, hostComp}) {
      if (hostComp) {

        return (
          <Descriptions>
            {
              Object.keys(record).map(r => <DescriptionsItem label={r}>{record[r]}</DescriptionsItem>)
            }
          </Descriptions>

        )
      }

    }
  }
})

// tree 表格
const testTable4 = UI.datatable.generate({
  flex: 'auto',
  columns: [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: '12%',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      width: '30%',
      key: 'address',
    }
  ],
  datasource: [
    {
      key: 1,
      name: 'John Brown sr.',
      age: 60,
      address: 'New York No. 1 Lake Park',
      children: [
        {
          key: 11,
          name: 'John Brown',
          age: 42,
          address: 'New York No. 2 Lake Park',
        },
        {
          key: 12,
          name: 'John Brown jr.',
          age: 30,
          address: 'New York No. 3 Lake Park',
          children: [
            {
              key: 121,
              name: 'Jimmy Brown',
              age: 16,
              address: 'New York No. 3 Lake Park',
            },
          ],
        },
        {
          key: 13,
          name: 'Jim Green sr.',
          age: 72,
          address: 'London No. 1 Lake Park',
          children: [
            {
              key: 131,
              name: 'Jim Green',
              age: 42,
              address: 'London No. 2 Lake Park',
              children: [
                {
                  key: 1311,
                  name: 'Jim Green jr.',
                  age: 25,
                  address: 'London No. 3 Lake Park',
                },
                {
                  key: 1312,
                  name: 'Jimmy Green sr.',
                  age: 18,
                  address: 'London No. 4 Lake Park',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      key: 2,
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ]
})

// 表单上传
const testUpload = UI.form.upload.generate({})

//创建 dropdown
console.log('------Dropdown-----------------', Dropdown);
const Abutton = UI.component.generate({
  component: Button
})
const MenuItem = Menu.Item
const testDropdown = createVNode(Dropdown, {}, {
  overlay: function(){
    return createVNode(Menu, {}, {
      default: () => {
        return (
            <>
              <MenuItem key="1">dddddd</MenuItem>
              <MenuItem key="2">dddddd22</MenuItem>
            </>

        )

      }
    })
  },
  default: function(){
    return <Abutton>测试dddddd</Abutton>
  }
})

export default {
  testDropdown,
  testUpload,
  testTable4,
  testTable3,
  testTable1,
  testTable2,
  testInput,
  testContaner,
  testInputPhone,
  testInputEmail,
  testInputNumber,
  testInputInteger,
  testInputCurrency,
  testInputCurrencyWanyuan,
  testInputPercentage,
  testInputDate,
  testInputDatetime,
  testFormGroup,
  testFormInputDateRange,
  testFormInputDatetimeRange,
  testFormInputCurrencyRange,
  testFormInputNumberRange,
  testFormInputIntegerRange,
  testFormInputPercentageRange,
  testDatasource,
  testAction,
  testCard,
  testSimpleSelect,
  testMultipleSimpleSelect,
  testAutocompleteSelect,
  testMultipleAutocompleteSelect,
  testTreeSelect,
  testTreeMultipleSelect,
  testTreeSelect1,
  testTreeMultipleSelect1,
  testTreeMultipleSelect2,
  testTreeMultipleSelect3,

  testTreeSelect2,
  testTreeSelect3,
  testToolbar,
  testToolbar1,
  testToolbar2,
  testTable,
  testTextArea
}