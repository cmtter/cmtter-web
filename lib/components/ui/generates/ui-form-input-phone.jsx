/**
 * 联系方式
 * @author xiufu.wang
 */
import baseInput from './ui-form-input'
import UIConfig from './ui-config'
import { PhoneOutlined } from '@ant-design/icons-vue'
import { createVNode } from 'vue'
const { DefineRules } = UIConfig

function generate(options){
  options = options || {}
  const rules = [DefineRules.isPhone()].concat(options.rules || [])
  return baseInput.generate({
    uiaxis: 'ui-form-input-phone',
    label: '联系方式',
    placeholder: '请输入联系方式',
    ...options,
    rules,
    prefix: () => createVNode(PhoneOutlined, {}, null)
  })
}

export default {name: 'form.input.phone', generate: generate}