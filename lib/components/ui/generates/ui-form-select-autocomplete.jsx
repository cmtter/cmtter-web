/**
 * 自动补全-选择, 适应场景
 * 1. 查询表单
 * 2. 支持选择及输入
 * 3. 支持多选
 * 
 * @author xiufu.wang
 */
 import selectSimple, {NULL_FUNCTION, NULL_ARRAY } from './ui-form-select-simple'

 function generate(options){
   options = options || {}
   return selectSimple.generate({
    uiaxis: 'ui-form-select-autocomplete',
    label: '自动补全',
    placeholder: '请选择',
    maxTagTextLength: 6,
    maxTagCount: 3,
    //使用场景
    scene: 'autoComplete',
    ...options,
    datas: NULL_ARRAY,
    loadDatas: NULL_FUNCTION
   })
 }
 
 export default {name: 'form.select.autocomplete', generate: generate}