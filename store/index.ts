import { preloadImgList, imgList } from '@/api/apis'

type State = {
  isAuth: boolean
  imgList: imgList
  isLoadingImg: boolean
}

export const state = (): State => ({
  isAuth: false,
  imgList: [],
  isLoadingImg: true,
})

export const mutations = {
  updateAuth(state: State, payload: boolean): void {
    state.isAuth = payload
  },

  setImgList(state: State, payload: imgList): void {
    state.imgList = payload
  },

  updateLoadingImg(state: State) {
    state.isLoadingImg = !state.isLoadingImg
  },
}

export const actions = {
  async getImgList({ commit }): Promise<void> {
    const imgs = await preloadImgList()

    commit('setImgList', imgs)
    commit('updateLoadingImg')
  },
}
