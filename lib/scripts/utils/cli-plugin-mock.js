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
        /**
         * 出现bug，无法正常代理服务端接口,所以这里做一些扩展, 检测requeres.url的前缀为mock的菜执行bodyParser插件
         * 
         */
        const urlencoded = bodyParser.urlencoded({ extended: false })
        const jsonParser = bodyParser.json()
        const rawParser = bodyParser.raw()
        app.use(function (req, res, next) {
          if (req.url.indexOf('/mock') < 0) {
            return next()
          }
          urlencoded(req, res, (err) => {
            if (err) return next(err)
            jsonParser(req, res, (err) => {
              if (err) return next(err)
              rawParser(req, res, next)
            })
          })
        })
        // app.use(bodyParser.urlencoded({ extended: false }))
        // // post json
        // app.use(bodyParser.json())
        // app.use(bodyParser.raw())
        Object.keys(mocksApi).forEach(function (reqUrl) {
          const fn = mocksApi[reqUrl] instanceof Function ? mocksApi[reqUrl] : () => mocksApi[reqUrl]
          app.get(reqUrl, fn)
          app.post(reqUrl, fn)
        })
      })
    }
  }
}
