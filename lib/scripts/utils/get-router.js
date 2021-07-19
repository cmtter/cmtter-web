const globby = require('globby')
const { sep, resolve } = require('path')
const BuildInRouters = ['500', 'login', '404']
const dashboard = { name: 'dashboard', path: 'dashboard' }

/**
 * 特殊处理
 * @param { } cwd 
 * @param {*} options 
 * @returns 
 */
function getTitle(title) {
  if (title === 'devopts') {
    return '页面设计'
  }
  if (title.indexOf('helper') > -1) {
    return '帮助文档'
  }
  if (title.indexOf('uidemos') > -1) {
    return '组件实例'
  }
  return title
}


export default async function (cwd, options) {

  const rootPath = resolve(cwd, '../views')
  let customerRouters = await globby(['**/*.*(jsx|vue)'], {
    cwd: rootPath,
    ignore: ['**/commons/**/*.*(jsx|vue)', '**/components/**/*.*(jsx|vue)', '**/_*/*.*(jsx|vue)', '**/-*/*.*(jsx|vue)', '**/-*.*(jsx|vue)', '**/_*.*(jsx|vue)']
  })
  let hasDashboard = false

  //开发环境，则自定注入内置文档view
  const docViewIndex = customerRouters.length
  const docViewRootPath = resolve(cwd, './views')
  if (process.env.NODE_ENV !== 'production') {

    if (process.env.NODE_ENV === 'development') {
      const docViews = await globby(['**/*.*(jsx|vue)'], {
        cwd: docViewRootPath,
        ignore: ['**/commons/**/*.*(jsx|vue)', '**/components/**/*.*(jsx|vue)', '**/_*/*.*(jsx|vue)', '**/-*/*.*(jsx|vue)', '**/-*.*(jsx|vue)', '**/_*.*(jsx|vue)']
      })
      customerRouters = (customerRouters || []).concat(docViews)
    }
  }

  customerRouters = customerRouters.map((routeFile, index) => {
    //转换成小写
    const normalFile = routeFile.toLowerCase().replace(/\\/g, '/').replace(/\/\//g, '/')
    const hasIdParams = normalFile.indexOf('~') >= 0
    const noSubFile = normalFile.replace(/~/g, '').replace(/\/index.(vue|jsx)$/, '').replace(/\.(vue|jsx)$/, '')
    //路由名称
    const routeName = (noSubFile === '/' || noSubFile === '' || noSubFile === 'index') ? dashboard.name : (noSubFile.replace(/\//g, '-'))
    //路径
    const routerPath = (noSubFile === '/' || noSubFile === '' || noSubFile === 'index') ? dashboard.path : noSubFile
    //组件
    const componentPath = resolve((index >= docViewIndex ? docViewRootPath : rootPath), routeFile).replace(/\\/g, '/')
    const component = `dyncImport(() => import(/* webpackChunkName: "router-${routeName}" */ \"${componentPath}\"))`
    if (!hasDashboard && routeName === dashboard.name) {
      hasDashboard = true
    }
    return `
      {
        name: \"${routeName}\",
        path: \"${routerPath}${hasIdParams ? '/:id' : ''}\",
        component: ${component},
        meta: {title: \"${getTitle(routeName.replace(/-/g, '&'))}\", closable: ${routeName === dashboard.name ? 'false' : 'true'}}
      }
    `
  })

  // 添加工作台重定向
  if (hasDashboard) {
    let redirect = `{name: \"${dashboard.name}\"}`
    if (options.importAppConfigJsx) {
      redirect = `appjs.resovleHomePath ? appjs.resovleHomePath() : ${redirect}`
    }
    customerRouters.unshift(
      `
        {
          path: \"/\",
          redirect: ${redirect}
  
        }
      `
    )
  }

  const routers = [
    `
      {
        path: \"/\",
        component: dyncImport(() => import(/* webpackChunkName: "router-main"*/ \"${resolve(__dirname, '../../applayout/' + options.applayout + '/layout/main.jsx').replace(/\\/g, '/')}\")),
        children: [
          ${customerRouters.join(',')}
        ]

      }
    `
  ]

  // 添加404 login 500
  BuildInRouters.forEach(p => {
    routers.push(`
      {
        name: \"${p}\",
        path: \"/${p === "404" ? ":pathMatch(.*)*" : p}\",
        component: dyncImport(() => import(/* webpackChunkName: "router-${p}" */ \"${resolve(__dirname, '../../components/' + p + '.vue').replace(/\\/g, '/')}\"))
      }
    `)
  });
  return routers
}