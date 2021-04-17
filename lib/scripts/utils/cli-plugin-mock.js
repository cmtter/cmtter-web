export default (mocksApi) => {
  return {
    id: 'cli-plugin-joinmock',
    apply: function (api, options) {
      api.configureDevServer(function (app, server) {
        Object.keys(mocksApi).forEach(function (reqUrl) {
          const fn = mocksApi[reqUrl] instanceof Function ? mocksApi[reqUrl] : () => mocksApi[reqUrl]
          app.get(reqUrl, fn)
          app.post(reqUrl, fn)
        })
      })
    }
  }
}
