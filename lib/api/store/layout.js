// state
const state = () => ({
  collapsed: false
})

// mutations
const mutations = {
  collapsed(state) {
    state.collapsed = !state.collapsed
  }
}

const actions = {

}

//getters
const getters = {}

export default {
  state, mutations, actions, getters, namespaced: true,
}