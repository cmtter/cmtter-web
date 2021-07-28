// import http from '@lib/api/tools/http'
//引入测试菜单数据
import menus from './menu.json'

/**
 * 返回菜单，数据结构
 *
 * childrens: {tree}
 * urlMeunsMap: {[url]: [router]}
 * idMenusMap: {[id]: [router]}
 * 
 * @returns 
 */
export async function getMenus(){
  function walkTree(arr, cache, callback, childrenField = 'children'){
    arr = arr || []
    const childrens = cache.$childrens || (cache.$childrens = [])
    const urlMeunsMap = cache.urlMeunsMap || (cache.urlMeunsMap = [])
    const idMenusMap = cache.idMenusMap || (cache.idMenusMap = [])
    arr.forEach(r => {
      const f = callback(r, cache)
      if (f){
        childrens.push(f)
      }
      if (f[childrenField] && f[childrenField].length > 0){
        f.urlMeunsMap = urlMeunsMap
        f.idMenusMap = idMenusMap
        walkTree(f[childrenField], f, callback)
      }
    });
    //排序
    cache.$childrens = cache.$childrens.sort((a, b) => (a.router.order-b.router.order > 0 ? 1 : -1))
  }

  //后端数据
  const responseMenuDatas = menus
  // 定义返回结果
  const results = {$childrens: [], urlMeunsMap: {}, idMenusMap: {}}
  walkTree(responseMenuDatas, results, (item, cache) => {
    const urlMeunsMap = cache.urlMeunsMap || (cache.urlMeunsMap = [])
    const idMenusMap = cache.idMenusMap || (cache.idMenusMap = [])
    if (item.url){
      item.url = '/system/use'
      const urlSeps = item.url.split('?')
      //给每一个菜单增加一个id,便于tab获取菜单标题
      const queryStrSeps = urlSeps[1] ? urlSeps[1].split('&').fliter(r => !!r) : []
      queryStrSeps.push('_m=' + (item.pageId || item.id))
      item.url = urlSeps[0] + '?' + queryStrSeps.join('&')
    }
    
    const router = {
      title: item.title,
      name: (item.pageId || item.id),
      url: item.url,
      hasUrl: !!(item.url),
      order: item.order,
      icon: item.icon,
      hasIcon: !!(item.icon)
    }

    if (router.hasUrl){
      urlMeunsMap[router.url] = item
    }
    idMenusMap[router.name] = item
    item.router = router
    return item
    
  })

  const indexMenu = {
    id:'dashboard',
    title: '工作台',
    url: "/dashboard",
    pageId: "dashboard",
    order:0,
    router: {
      title: '工作台',
      name: 'dashboard',
      url: '/dashboard',
      hasUrl: true,
      order: 0,
      icon: '',
      hasIcon: false
    }
  }
  //添加工作台
  results.$childrens.unshift(indexMenu)
  results.urlMeunsMap[indexMenu.url] = indexMenu
  results.idMenusMap[indexMenu.id] = indexMenu
  return results
}

export function resovleHomePath(){
  return {
    path: '/dashboard'
  }
}


/**
 * 路由跳转拦截处理
 * https://next.router.vuejs.org/zh/guide/advanced/navigation-guards.html
 */
export function beforeEach(to, from, next){
  if (to.name === '404'){
    next(resovleHomePath())
  }else{
    next()
  }
}
