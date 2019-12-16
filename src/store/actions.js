import * as types from './mutation-types'

export const saveUser = ({
  commit,
  state
}, user) => {
  commit(types.SET_USER, user)
}

export const deleteUser = ({
  commit,
  state
}) => {
  commit(types.SET_USER, {})
}

export const saveToken = ({
  commit,
  state
}, token) => {
  commit(types.SET_USER_TOKEN, token)
}

export const deleteToken = ({
  commit,
  state
}) => {
  commit(types.SET_USER_TOKEN, '')
}

export const saveCurrentMenuId = ({
  commit,
  state
}, currentMenuId) => {
  commit(types.SET_CURRENT_MENU_ID, currentMenuId)
}

export const saveCollapsed = ({
  commit,
  state
}, collapsed) => {
  commit(types.SET_COLLAPSED, collapsed)
}
