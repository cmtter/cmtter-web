
//PUBLIC_PATH: 该属性会影响所有的静态资源输入
export default {
  /**
   * 环境变量
   */
  envs: {
    PUBLIC_PATH: '/wabbasedev'
  },
  /**
   * 主布局
   */
  applayout: 'wukuang',

  mode: 'dev',

  /** 配置 */
  devServer: {
    port: 8088,
    open: false,
    proxy: {
      '/appws': {
        target: 'http://www.baidu.com/',
        pathRewrite: { '^/appws': '' },
        changeOrigin: true,
        secure: true,
        ws: true,
        onProxyRes: function (proxyRes) {
          const cookies = proxyRes.headers['set-cookie']
          const cookieRegex = /Path=\/\/abs\//i
          if (cookies) {
            var newCookie = cookies.map(function (cookie) {
              if (cookieRegex.test(cookie)) {
                return cookie.replace(cookieRegex, 'Path=/')
              }
              return cookie
            })
            delete proxyRes.headers['set-cookie']
            proxyRes.headers['set-cookie'] = newCookie
          }
        }
      }
    }
  }
}