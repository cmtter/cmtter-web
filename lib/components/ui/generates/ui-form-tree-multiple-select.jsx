/**
 * 树多选
 * @author xiufu.wang
 */
 import treeSelect from './ui-form-tree-select'

 function generate(options){
   options = options || {}
   return treeSelect.generate({
    uiaxis: 'ui-form-tree-select-multiple',
    label: 'Tree多选',
    placeholder: '请选择',
    ...options,
    multiple: true
   })
 }
 
 export default {name: 'form.tree.select.multiple', generate: generate}