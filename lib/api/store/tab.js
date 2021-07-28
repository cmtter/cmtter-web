// state
const state = () => ({
  /**
   * {
   * toMeta
   * fromMeta.
   * key,
   * uuid,
   * to,
   * record,
   * title,
   * toFullUrl,
   * fromFullUrl
   * }
   * 
   */
  tabs: [],

  /**
   * tab
   */
  curTab: null

})

// mutations
const mutations = {
  add(state, tab) {
    const _tab = (state.tabs || []).filter(r => (
      (tab.key && (tab.key === r.key))
    ))
    if (_tab.length > 0) {
      if (!state.curTab || state.curTab.uuid !== _tab[0].uuid) {
        state.curTab = _tab[0]
      }
    } else {
      state.curTab = tab
      state.tabs.push(tab)
    }
  },

  updateCurTab(state, tab) {
    state.curTab = { ...(state.curTab), ...tab }
    //更新集合
    const index = state.tabs.findIndex(r => r.uuid === state.curTab.uuid)
    if (index > -1) {
      state.tabs.splice(index, 1, state.curTab)
    }
  },

  remove(state, uuid) {
    const index = state.tabs.findIndex(r => r.uuid === uuid)
    if (index >= 0) {
      state.tabs.splice(index, 1)

      if (uuid === state.curTab.uuid) {
        if (index === 0) {
          state.curTab = state.tabs[0]
        } else {
          state.curTab = state.tabs[index - 1]
        }
      }
    }
  },

  active(state, uuid) {
    if (state.curTab && state.curTab.uuid === uuid) {
      return
    }
    const index = state.tabs.findIndex(r => r.uuid === uuid)
    if (index >= 0) {
      state.curTab = state.tabs[index > 0 ? index : 0]
    }
  }
}

const actions = {

}

//getters
const getters = {}

export default {
  state, mutations, actions, getters, namespaced: true,
}