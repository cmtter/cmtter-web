import { computed, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useState from './use-state'
import useStore from './use-store'
export default function () {
  const state = useState('tab')
  const stateMenu = useState('menus')
  const store = useStore()
  const router = useRouter()
  const curRoute = useRoute()

  function deleteTab(uid) {
    store.commit('tab/remove', uid)
  }

  function activeTab(uid) {
    store.commit('tab/active', uid)
  }
  const activeTabKey = ref((state.curTab || {}).uuid)
  //初始化 activeTabKey
  const tabs = computed(() => state.tabs)
  const curTab = computed(() => state.curTab)
  const menusMap = computed(() => stateMenu.menusMap)

  // 当前tab发生变化: 更新activeTabKey
  watch(curTab, () => {
    if (activeTabKey.value !== curTab.value.uuid) {
      activeTabKey.value = curTab.value.uuid
    }
  })

  watch(activeTabKey, () => {
    if (activeTabKey.value !== curTab.value.uuid) {
      store.commit('tab/active', activeTabKey.value)
    }
    router.push(curTab.value.toFullUrl)
  })

  //初始化参数数据监控菜单数据变化
  const syncCurTabFromMenu = () => {
    const _m = curRoute.query._m
    let curMunuInfo = null
    if (_m && (curMunuInfo = menusMap.value[_m])) {
      const key = (curRoute.name + (curRoute.params.id || '') + _m)
      if (key === curTab.value.key) {
        return
      }
      store.commit('tab/updateCurTab', {
        title: curMunuInfo.router.title,
        key: key
      })
    }
  }

  syncCurTabFromMenu()

  return {
    tabs,
    curTab,
    activeTabKey,
    deleteTab,
    activeTab
  }
}