/**
 * 百分比
 * @author xiufu.wang
 */
 import numberInput from './ui-form-input-number'
 import Conifg from './ui-config'
 const prefix = ''

 function generate(options){
   return numberInput.generate({
    label: '百分比',
    prefix,
    placeholder: '请输入百分比',
    ...(Conifg.units['%']),
     ...options
   })
 }

 export default {name: 'form.input.percentage', generate: generate}