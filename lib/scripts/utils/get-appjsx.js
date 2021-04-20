import getExistFile from './get-exist-file'
const path = require('path')

export default function (cwd) {
  const files = ['app.jsx', 'app.js']
  const appjs = getExistFile({ cwd: path.resolve(cwd, '../'), files })
  let importAppConfigJsx = ''
  let insallAppConfig = ''
  if (appjs) {
    importAppConfigJsx = `import * as appjs from '${appjs.replace(/\\/g, '/')}'`
    insallAppConfig = `
app.use({
  install: function(app){
    app.config.globalProperties.$appconfig = appjs
    return app
  }
})
    `
    return {
      importAppConfigJsx,
      insallAppConfig
    }
  }

  return {}

}