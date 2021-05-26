import formGroup from './ui-form-group'
import formInputInteger from './ui-form-input-integer'

function generate(options){
  options = options || {}
  return formGroup.generate({
    showSeparator: true,
    uiaxis: 'ui-form-input-integer-range',
    label: '整数段',
    name: 'integerRange',
    groups: [
      {vmodel: (options.sVmodel || 'startInteger'), ui: formInputInteger.generate({col: (options.sCol || 11), placeholder: (options.sPlaceholder || '最小整数')})},
      {vmodel: (options.eVmodel || 'endInteger'), ui: formInputInteger.generate({col: (options.eCol || 11), placeholder: (options.ePlaceholder || '最大整数')})}
    ],
    ...options,
  })
}

export default {name: 'form.input.integer.range', generate: generate}