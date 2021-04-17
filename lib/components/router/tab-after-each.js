/**
 * 利用after-each hook维护tabs数据
 * @param {}} router 
 */
import { getStore } from '@lib/api/store'
import { uuid } from '@lib/api/global-symbol'

function normalTabMeta(meta) {
  meta = meta || {}
  meta.title = meta.title || '-'
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

    const toMeta = normalTabMeta(to.meta)
    const fromMeta = normalTabMeta(from.meta)
    const key = to.name + (to.params.id || '')
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