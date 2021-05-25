import formGroup from './ui-form-group'
import formInputDate from './ui-form-input-date'

function generate(options){
  options = options || {}
  return formGroup.generate({
    showSeparator: true,
    uiaxis: 'ui-form-input-date-range',
    label: '开始结束日期',
    name: 'dateRange',
    groups: [
      {vmodel: (options.sVmodel || 'startDate'), ui: formInputDate.generate({col: (options.sCol || 11), placeholder: (options.sPlaceholder || '开始日期')})},
      {vmodel: (options.eVmodel || 'endDate'), ui: formInputDate.generate({col: (options.eCol || 11), placeholder: (options.ePlaceholder || '结束日期')})}
    ],
    ...options,
  })
}

export default {name: 'form.input.date.range', generate: generate}