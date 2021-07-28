/**
 * 利用after-each hook维护tabs数据
 * @param {}} router 
 */
import { getStore } from '@lib/api/store'
import { uuid } from '@lib/api/global-symbol'

function normalTabMeta(meta, store, route) {
  meta = meta || {}
  meta.title = meta.title || '-'
  if (store.state.menus.menusMap && route.query._m && store.state.menus.menusMap[route.query._m]) {
    const menu = store.state.menus.menusMap[route.query._m]
    return {
      ...meta,
      title: ((menu.router && menu.router.title) || meta.title),
      menuKey: route.query._m
    }
  }

  return meta
}

export default function (router) {
  router.afterEach((to, from) => {
    const store = getStore()
    /**
     * tab router路由配置必须指定名称
     */
    if (!store || !to.name) {
      return
    }

    /**
     * 思路:
     * 1. 如果匹配菜单则获取菜单元配置
     * 2. 如果是动态路由且无法匹配菜单则使用 路由定义参数
     * 3. 动态路由页面本身可以运行时定义
     */

    //window._jrouter_

    const toMeta = normalTabMeta(to.meta, store, to)
    const fromMeta = normalTabMeta(from.meta, store, to)
    const key = to.name + (to.params.id || '') + (toMeta.menuKey || '')
    const _uuid = uuid('router-tab-')
    const record = to
    const title = toMeta.title
    const toFullUrl = to.fullPath
    const fromFullUrl = from.fullPath

    store.commit('tab/add', {
      toMeta,
      fromMeta,
      key,
      uuid: _uuid,
      to,
      record,
      title,
      toFullUrl,
      fromFullUrl
    })
  })
  return router
}