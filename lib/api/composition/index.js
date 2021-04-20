const modulesFiles = require.context('./', true, /\use-(.+).js$/)
const useModules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  const normalName = moduleName.indexOf('-') > 0 ? (moduleName.split('-').map((r, i, arr) => (i > 0 ? (arr[i][0].toLocaleUpperCase() + arr[i].slice(1)) : r))).join('') : moduleName
  modules[normalName] = value.default
  return modules
}, {})



export default useModules
