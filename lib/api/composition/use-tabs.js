import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import useState from './use-state'
import useStore from './use-store'
export default function () {
  const state = useState('tab')
  const store = useStore()
  const router = useRouter()

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

  return {
    tabs,
    curTab,
    activeTabKey,
    deleteTab,
    activeTab
  }
}