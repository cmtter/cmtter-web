import UI, { UIConfig } from '@lib/components/ui'

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
const testInput = UI.form.input.generate({
  label: '输入框',
  labelCol: 6,
  placeholder: '请输入名称',
  wrapperCol: 16,
  flex: '0 0 300px',
  rules: _testFormStateRules.cmtter1
})

const testContaner = UI.contaner.generate({
  columnCount: 3,
  justify: 'start'
})

export default {
  testInput,
  testContaner
}