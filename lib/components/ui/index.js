const _UIS_ = window._$UIS$_ = {}
function toArray(name) {
  return name instanceof Array ? name : name.split('.')
}

function defineUIGenerate(name, generate) {
  name = toArray(name)
  let targetObj = _UIS_
  name.forEach(p => {
    targetObj = targetObj[p] || (targetObj[p] = {})
  });
  targetObj.generate = generate
}

const modulesFiles = require.context('./generates', true, /\.jsx$/)
modulesFiles.keys().reduce((modules, modulePath) => {
  const value = modulesFiles(modulePath)
  const m = value.default
  if (m && m.name && m.generate) {
    defineUIGenerate(m.name)
  }
  return modules
}, {})

export default _UIS_