import baseInput from './ui-form-input'

function generate(options){
  options = options || {}
  return baseInput.generate({
    uiaxis: 'ui-form-input-datetime',
    label: '时间',
    placeholder: '请输入时间',
    dateValueFormat: 'YYYY-MM-DD HH:mm:ss',
    ...options,
    inputType: 'datetime'
  })
}
export default {name: 'form.input.datetime', generate: generate}