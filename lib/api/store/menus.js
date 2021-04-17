import { IS_SHOW_TOP_MENU } from '../../api/global-symbol'
import hook from '../composition'
// state
const state = () => ({
  /**
   * 是否显示top menus
   * 
   */
  showTopMenu: IS_SHOW_TOP_MENU,
  /**
   * top menus 数据
   * {
   *  router: {
   *    path,
   *    name,
   *    meta
   *  },
   *  childrens: []
   * }
   * 
   */
  topMenus: null,
  /**
   * 侧边条 菜单数据
   * 
   * 同(topMenus)
   */
  subMenus: null,

})

// mutations
const mutations = {
  subMenus: (state, subMenus) => {
    state.subMenus = subMenus
  },
  topMenus: (state, topMenus) => {
    state.topMenus = topMenus
  },
}

const actions = {
  // 加载菜单数据 { commit, state }
  async loadMenus({ commit }) {
    const { http } = hook.useHttp()
    const { response } = await http('/mock/base/getmenus', {}).get()
    if (response) {
      const data = response.data
      //将 首页 放到首位
      const index = data.childrens.findIndex(r => r.router.meta.title === '')
      if (index > 0) {
        data.childrens = [data.childrens[index], ...(data.childrens.slice(0, index)), ...(data.childrens.slice(index + 1))]
      }
      commit('topMenus', data.childrens.map(r => ({
        router: {
          ...(r.router)
        }
      })))
    }
  }
}

//getters
const getters = {}

export default {
  state, mutations, actions, getters, namespaced: true,
}