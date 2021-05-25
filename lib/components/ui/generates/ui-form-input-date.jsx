import baseInput from './ui-form-input'


function generate(options){
  options = options || {}
  return baseInput.generate({
    uiaxis: 'ui-form-input-date',
    label: '日期',
    placeholder: '请输入日期',
    dateValueFormat: 'YYYY-MM-DD',
    ...options,
    inputType: 'date'
  })
}

export default {name: 'form.input.date', generate: generate}