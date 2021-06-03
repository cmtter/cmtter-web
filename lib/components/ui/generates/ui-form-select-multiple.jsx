/**
 * 简单多选
 * @author xiufu.wang
 */
 import selectSimple from './ui-form-select'

 function generate(options){
   options = options || {}
   return selectSimple.generate({
    uiaxis: 'ui-form-select-multiple',
    label: '简单多选',
    placeholder: '请选择',
    ...options,
    mode: 'multiple',
    maxTagTextLength: 6,
    maxTagCount: 3,
   })
 }
 
 export default {name: 'form.select.multiple', generate: generate}