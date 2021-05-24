/**
 * 币种
 * @author xiufu.wang
 */
 import numberInput from './ui-form-input-number'
 
 const prefix = '￥'

 function generate(options){

   return numberInput.generate({
    label: '币种',
    prefix,
    placeholder: '请输入币种',
    suffix: '元',
     ...options
   })
 }

 export default {name: 'form.input.currency', generate: generate}