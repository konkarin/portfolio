type State = {
  isAuth: Boolean
}

export const state = (): State => ({
  isAuth: false,
})

export const mutations = {
  updateAuth(state: State, payload: Boolean) {
    state.isAuth = payload
  },
}
