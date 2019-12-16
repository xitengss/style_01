import * as types from './mutation-types'

const mutations = {
  [types.SET_USER] (state, user) {
    state.user = user
  },
  [types.SET_USER_TOKEN] (state, token) {
    state.token = token
  },
  [types.SET_CURRENT_MENU_ID] (state, currentMenuId) {
    state.currentMenuId = currentMenuId
  },
  [types.SET_FUNCLIST] (state, funcList) {
    state.funcList = funcList
  },
  [types.SET_COLLAPSED] (state, collapsed) {
    state.collapsed = collapsed
  }
}

export default mutations
