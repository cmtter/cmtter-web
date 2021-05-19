const bodyParser = require('body-parser')
export default (mocksApi) => {
  return {
    id: 'cli-plugin-joinmock',
    apply: function (api, options) {
      api.configureDevServer(function (app, server) {
        /**
         * 参考文档https://www.npmjs.com/package/body-parser
         */
        // formData
        app.use(bodyParser.urlencoded({ extended: false }))
        // post json
        app.use(bodyParser.json())
        app.use(bodyParser.raw())
        Object.keys(mocksApi).forEach(function (reqUrl) {
          const fn = mocksApi[reqUrl] instanceof Function ? mocksApi[reqUrl] : () => mocksApi[reqUrl]
          app.get(reqUrl, fn)
          app.post(reqUrl, fn)
        })
      })
    }
  }
}
