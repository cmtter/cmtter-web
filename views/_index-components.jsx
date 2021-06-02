import UI, { UIConfig } from '@lib/components/ui'
import { UserOutlined, InfoCircleOutlined } from '@ant-design/icons-vue'
import { Card, Button } from 'ant-design-vue'
import { createVNode } from 'vue'
const { DefineRules } = UIConfig

// 表单状态模型
export const _testFormState = {
  cmtter1: '默认值',
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
  cmtter29:  { "value": 11, "label": "否11", "key": 11 },
  cmtter30: null,
  cmtter31: null,
  cmtter32: null,
  cmtter33: null,
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
  flex: '0 0 350px',
  rules: _testFormStateRules.cmtter1,
  prefix: testInput_prefix,
  suffix: testInput_suffix
})

// 测试联系方式
const testInputPhone = UI.form.input.phone.generate({
  flex: '0 0 350px'
})

// 测试邮箱
const testInputEmail = UI.form.input.email.generate({
  flex: '0 0 350px'
})

// 测试数字
const testInputNumber = UI.form.input.number.generate({
  flex: '0 0 350px'
})

// 整数
const testInputInteger = UI.form.input.integer.generate({
  flex: '0 0 350px'
})

//测试币种
const testInputCurrency = UI.form.input.currency.generate({
  flex: '0 0 350px'
})

//测试币种-万元
const testInputCurrencyWanyuan = UI.form.input.currency.generate({
  flex: '0 0 350px',
  ...(UIConfig.units['万元'])
})

//百分比
const testInputPercentage = UI.form.input.percentage.generate({
  flex: '0 0 350px'
})

//日期
const testInputDate = UI.form.input.date.generate({
  flex: '0 0 350px'
})

// 日期时间
const testInputDatetime = UI.form.input.datetime.generate({
  flex: '0 0 350px'
})

// 表单分组
const testFormGroup = UI.form.group.generate({
  flex: '0 0 700px',
  labelCol: 3,
  showSeparator: true,
  rules: [
    DefineRules.isValidator(function(){
      if (!this.m1 || !this.m2){
        return Promise.reject(((this.m1 ? '' : '起始时间') || (this.m2 ? '' : '结束时间'))+'不能为空')
      }
      if(this.m1 >= this.m2 ){
        return Promise.reject('结束时间必须大于起始时间')
      }
      return Promise.resolve(null)
    }, undefined, 'change')
  ],
  groups: [
    {vmodel: 'm1', ui: UI.form.input.datetime.generate({col: 11, placeholder: '开始时间'})},
    {vmodel: 'm2', ui: UI.form.input.datetime.generate({col: 11, placeholder: '结束时间'})}
  ]
})

//测试日期段
const  testFormInputDateRange = UI.form.input.date.range.generate({
  flex: '0 0 600px',
  labelCol: 4,
  sVmodel: 'cmtter11',
  eVmodel: 'cmtter12',
  rules: [
    DefineRules.isValidator(function(){
      if (!this.cmtter11 || !this.cmtter12){
        return Promise.reject(((this.cmtter11 ? '' : '起始日期') || (this.cmtter14 ? '' : '结束日期'))+'不能为空')
      }
      if(this.cmtter11 >= this.cmtter12 ){
        return Promise.reject('结束日期必须大于起始日期')
      }
      return Promise.resolve(null)
    }, undefined, 'change')
  ],
})

//测试日期时间段
const testFormInputDatetimeRange = UI.form.input.datetime.range.generate({
  flex: '0 0 650px',
  labelCol: 4,
  sVmodel: 'cmtter13',
  eVmodel: 'cmtter14',
  rules: [
    DefineRules.isValidator(function(){
      if (!this.cmtter13 || !this.cmtter14){
        return Promise.reject(((this.cmtter13 ? '' : '起始时间') || (this.cmtter14 ? '' : '结束时间'))+'不能为空')
      }
      if(this.cmtter13 >= this.cmtter14 ){
        return Promise.reject('结束时间必须大于起始时间')
      }
      return Promise.resolve(null)
    }, undefined, 'change')
  ],
})

// 测试金额段
const testFormInputCurrencyRange = UI.form.input.currency.range.generate({
  flex: '0 0 600px',
  labelCol: 4,
  sVmodel: 'cmtter17',
  eVmodel: 'cmtter18',
  rules: [
    DefineRules.isValidator(function(){
      if (!this.cmtter17 || !this.cmtter18){
        return Promise.reject(((this.cmtter17 ? '' : '最小金额') || (this.cmtter18 ? '' : '最大金额'))+'不能为空')
      }
      if(this.cmtter17 >= this.cmtter18 ){
        return Promise.reject('最大金额必须大于最小金额')
      }
      return Promise.resolve(null)
    },undefined, 'change')
  ],
})

// 测试数字段
const testFormInputNumberRange = UI.form.input.number.range.generate({
  flex: '0 0 600px',
  labelCol: 4,
  sVmodel: 'cmtter19',
  eVmodel: 'cmtter20',
  rules: [],
})

// 测试整数段
const testFormInputIntegerRange = UI.form.input.integer.range.generate({
  flex: '0 0 600px',
  labelCol: 4,
  sVmodel: 'cmtter21',
  eVmodel: 'cmtter22',
  rules: [],
})

// 测试百分比段
const testFormInputPercentageRange = UI.form.input.percentage.range.generate({
  flex: '0 0 600px',
  labelCol: 4,
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
  columnCount: 3,
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
  slots:{
    default: (hostComp) => {
      return <div> hello! 我是基于UI.component.generate创建的控件, 访问宿主环境变量 [{hostComp.hostVar}] <Button onClick={hostComp.updateHostVar}>点击我更改宿主环境变量</Button></div>
    }
  }
})

// 创建简单的select
const testSimpleSelect = UI.form.select.simple.generate({
  flex: '0 0 350px',
  datas: [
    {v: 1, l: '是1', a: '123'},
    {v: 2, l: '否2', a: '123'},
    {v: 3, l: '否3', a: '123'},
    {v: 4, l: '否4', a: '123'},
    {v: 5, l: '否5', a: '123'},
    {v: 6, l: '否6', a: '123'},
    {v: 7, l: '否7', a: '123'},
    {v: 8, l: '否8', a: '123'},
    {v: 9, l: '否9', a: '123'},
    {v: 10, l: '否10', a: '123'},
    {v: 11, l: '否11', a: '123'},
    {v: 12, l: '否12', a: '123'},
    {v: 13, l: '否13', a: '123'},
    {v: 14, l: '否14', a: '123'}
  ],
  fields: ['v', 'l']
})

const testMultipleSimpleSelect = UI.form.select.multiple.simple.generate({
  flex: '0 0 550px',
  label: '2万条(多选)',
  loadDatas: function(){
    // this 访问数组环境
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Array.from({length: 20000}).map((r, index) => ({
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
  loadDatasAsync: function(text){
    //this 是host宿主环境
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Array.from({length: 10}).map((r, index) => ({
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
  loadDatasAsync: function(text){
    //this 是host宿主环境
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Array.from({length: 10}).map((r, index) => ({
          v: (++uuid) + (r || ''),
          l: (text || '选项') + (index + 1)
        })))
      }, 100);
    })

  },
  fields: ['v', 'l']
})

export default {
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
  testMultipleAutocompleteSelect
}