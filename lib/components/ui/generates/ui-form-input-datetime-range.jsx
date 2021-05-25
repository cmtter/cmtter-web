import formGroup from './ui-form-group'
import formInputDateTime from './ui-form-input-datetime'

function generate(options){
  options = options || {}
  return formGroup.generate({
    showSeparator: true,
    uiaxis: 'ui-form-input-datetime-range',
    label: '开始结束时间',
    name: 'dateTimeRange',
    groups: [
      {vmodel: (options.sVmodel || 'startDatetime'), ui: formInputDateTime.generate({col: (options.sCol || 11), placeholder: (options.sPlaceholder || '开始时间')})},
      {vmodel: (options.eVmodel || 'endDatetime'), ui: formInputDateTime.generate({col: (options.eCol || 11), placeholder: (options.ePlaceholder || '结束时间')})}
    ],
    ...options,
  })
}

export default {name: 'form.input.datetime.range', generate: generate}