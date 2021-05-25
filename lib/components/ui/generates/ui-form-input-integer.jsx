/**
 * 整数
 * @author xiufu.wang
 */
 import numberInput from './ui-form-input-number'
 
 function generate(options){
   return numberInput.generate({
    uiaxis: 'ui-form-input-integer',
    label: '整数',
    placeholder: '请输入整数',
     ...options,
     inputValidator: (val) => {
       if (val && val.indexOf('.') > -1){
        return false
       }
      return !val || (val && (val === '-')) || (parseInt(val) === (+val))
     }
   })
 }
 
 export default {name: 'form.input.integer', generate: generate}