/**
 * 邮箱
 * @author xiufu.wang
 */
 import baseInput from './ui-form-input'
 import UIConfig from './ui-config'
 import { MailOutlined } from '@ant-design/icons-vue'
 import { createVNode } from 'vue'
 const { DefineRules } = UIConfig
 
 function generate(options){
   options = options || {}
   const rules = [DefineRules.isEmail()].concat(options.rules || [])
   return baseInput.generate({
    uiaxis: 'ui-form-input-email',
     label: '邮箱',
     placeholder: '请输入邮箱',
     ...options,
     rules,
     prefix: () => createVNode(MailOutlined, {}, null)
   })
 }

export default {name: 'form.input.email', generate: generate}