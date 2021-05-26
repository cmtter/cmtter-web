import formGroup from './ui-form-group'
import formInputNumber from './ui-form-input-number'

function generate(options){
  options = options || {}
  return formGroup.generate({
    showSeparator: true,
    uiaxis: 'ui-form-input-number-range',
    label: '数字段',
    name: 'numberRange',
    groups: [
      {vmodel: (options.sVmodel || 'startNumber'), ui: formInputNumber.generate({col: (options.sCol || 11), placeholder: (options.sPlaceholder || '最小数字')})},
      {vmodel: (options.eVmodel || 'endNumber'), ui: formInputNumber.generate({col: (options.eCol || 11), placeholder: (options.ePlaceholder || '最大数字')})}
    ],
    ...options,
  })
}
export default {name: 'form.input.number.range', generate: generate}