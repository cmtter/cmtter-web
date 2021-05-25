import UI, { UIConfig } from '@lib/components/ui'
import { UserOutlined, InfoCircleOutlined } from '@ant-design/icons-vue'
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
  flex: '0 0 600px',
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
      if (!this.cmtter13 || !this.cmtter14){
        return Promise.reject(((this.cmtter13 ? '' : '最小金额') || (this.cmtter14 ? '' : '最大金额'))+'不能为空')
      }
      if(this.cmtter13 >= this.cmtter14 ){
        return Promise.reject('最大金额必须大于最小金额')
      }
      return Promise.resolve(null)
    })
  ],

})

// 容器
const testContaner = UI.contaner.generate({
  columnCount: 3,
  justify: 'start'
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
  testFormInputCurrencyRange
}