export const state = () => ({
  isAuth: false,
})

export const mutation = {
  updateAuth(state, payload) {
    state.isAuth = payload
  },
}
