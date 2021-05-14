const _UIS_ = window._$UIS$_ = {}
function toArray(name) {
  return name instanceof Array ? name : name.split('\.')
}

function defineUIGenerate(name, generate) {
  name = toPropsArray(name)
  let targetObj
  name.forEach(p => {
    targetObj = _UIS_[p] || (_UIS_[p] = {})
  });
  targetObj.generate = generate
}

const modulesFiles = require.context('./generates', true, /\.jsx$/)
const storeModules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  const m = value.default
  if (m && m.name && m.generate) {
    defineUIGenerate(m.name)
  }
  return modules
}, {})

export default _UIS_