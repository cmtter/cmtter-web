import http from '@lib/api/tools/http'

/**
 * 框架runtime通用事务配置
 */
// 返回菜单
export function getMenus(){
  console.log(http && 'is http api');
  return undefined
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
