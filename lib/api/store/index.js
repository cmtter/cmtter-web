import { createStore } from 'vuex'

let storeInstance = null

const modulesFiles = require.context('./', true, /\.js$/)
const storeModules = modulesFiles.keys().reduce((modules, modulePath) => {
  if (/index\.js/.test(modulePath)) {
    return modules
  }
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})


function install(app) {
  if (!storeInstance) {
    storeInstance = createStore({ modules: storeModules })
  }
  app.use(storeInstance)
}

export const getStore = () => storeInstance

export default { install }
