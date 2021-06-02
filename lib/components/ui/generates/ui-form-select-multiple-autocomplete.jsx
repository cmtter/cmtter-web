/**
 * 自动补全-多选
 * @author xiufu.wang
 */
 import selectAutocomplete from './ui-form-select-autocomplete'

 function generate(options){
   options = options || {}
   return selectAutocomplete.generate({
    uiaxis: 'ui-form-select-multiple-autocomplete',
    label: '自动补全多选',
    placeholder: '请选择',
    ...options,
    mode: 'multiple',
    scene: 'multipleautoComplete'
   })
 }
 
 export default {name: 'form.select.multiple.autocomplete', generate: generate}