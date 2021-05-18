/**
 * 数字
 * @author xiufu.wang
 */
 import baseInput from './ui-form-input'
 import UIConfig from './ui-config'
 import JoyinNumberFilled from '../../icon/JoyinNumberFilled'
 import { createVNode } from 'vue'
 const { DefineRules } = UIConfig

 function defaultInputValidator(val){
    if ((!isNaN(+val) && NUMBER_REG.test(val)) || val === '' || val === '-') {
      return true
    } else {
      return false
    }
 }
 const NUMBER_REG = /^-?\d*(\.\d*)?$/

 function generate(options){
   options = options || {}
   const rules = [DefineRules.isNumber()].concat(options.rules || [])
   return baseInput.generate({
     label: '数字',
     placeholder: '请输入数字',
     ...options,
     rules,
     prefix: () => createVNode(JoyinNumberFilled , {}, null),
     inputValidator: (val) => {
        if (options.inputValidator){
            return options.inputValidator(val)
        }
        return defaultInputValidator(val)
     }
   })
 }
 
 export default {name: 'form.input.number', generate: generate}