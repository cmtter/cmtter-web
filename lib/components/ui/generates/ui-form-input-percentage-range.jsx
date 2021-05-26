import formGroup from './ui-form-group'
import formInputPercentage from './ui-form-input-percentage'

function generate(options){
  options = options || {}
  return formGroup.generate({
    showSeparator: true,
    uiaxis: 'ui-form-input-percentage-range',
    label: '百分比段',
    name: 'percentageRange',
    groups: [
      {vmodel: (options.sVmodel || 'startPercentage'), ui: formInputPercentage.generate({col: (options.sCol || 11), placeholder: (options.sPlaceholder || '最小百分比')})},
      {vmodel: (options.eVmodel || 'endPercentage'), ui: formInputPercentage.generate({col: (options.eCol || 11), placeholder: (options.ePlaceholder || '最大百分比')})}
    ],
    ...options,
  })
}

export default {name: 'form.input.percentage.range', generate: generate}