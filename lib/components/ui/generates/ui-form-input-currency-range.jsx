import formGroup from './ui-form-group'
import formInputCurrency from './ui-form-input-currency'

function generate(options){
  options = options || {}
  return formGroup.generate({
    showSeparator: true,
    uiaxis: 'ui-form-input-currency-range',
    label: '金额段',
    name: 'currencyRange',
    groups: [
      {vmodel: (options.sVmodel || 'startCurrency'), ui: formInputCurrency.generate({col: (options.sCol || 11), placeholder: (options.sPlaceholder || '最小金额')})},
      {vmodel: (options.eVmodel || 'endCurrency'), ui: formInputCurrency.generate({col: (options.eCol || 11), placeholder: (options.ePlaceholder || '最大金额')})}
    ],
    ...options,
  })
}

export default {name: 'form.input.currency.range', generate: generate}