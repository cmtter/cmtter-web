const modulesFiles = require.context('./', true, /\.md$/)
const exportDocs = modulesFiles.keys().reduce((modules, modulePath) => {
  const value = modulesFiles(modulePath)
  const m = value.default
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  modules['helper-' + moduleName] = m
  return modules
}, {})

export default exportDocs