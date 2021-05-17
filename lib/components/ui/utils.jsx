export function defalutProps(props, options = {}){
  Object.keys(options).forEach(p => {
    const tp = props[p]
    const defaultV = options[p]
    if (tp && defaultV !== undefined && defaultV !== null){
      tp.def(defaultV)
    }
  })
  return props
}