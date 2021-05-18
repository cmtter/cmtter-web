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
  cmtter7: null,
  cmtter8: null
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
  testInputInteger
}