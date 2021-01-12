import { preloadImgList, imgList } from '@/api/apis'

type State = {
  isAuth: boolean
  imgList: imgList
}

export const state = (): State => ({
  isAuth: false,
  imgList: [],
})

export const mutations = {
  updateAuth(state: State, payload: boolean): void {
    state.isAuth = payload
  },

  setImgList(state: State, payload: imgList): void {
    state.imgList = payload
  },
}

export const actions = {
  async getImgList({ commit }): Promise<void> {
    const imgs = await preloadImgList()
    commit('setImgList', imgs)
  },
}
