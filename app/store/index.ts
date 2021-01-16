import { loadImgList, DocumentData } from '@/api/apis'

type State = {
  isAuth: boolean
  imgList: DocumentData
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

  setImgList(state: State, payload: DocumentData): void {
    state.imgList = payload
  },

  updateLoadingImg(state: State) {
    state.isLoadingImg = !state.isLoadingImg
  },
}

export const actions = {
  async getImgList({ commit }): Promise<void> {
    const loadedImgList = await loadImgList()

    commit('setImgList', loadedImgList)
    commit('updateLoadingImg')
  },
}
