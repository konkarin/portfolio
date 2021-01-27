import { loadImgList, DocumentData } from '@/api/apis'
import firebase from '@/plugins/firebase'

type State = {
  isAuth: boolean
  user: firebase.User
  imgList: DocumentData
  isLoadingImg: boolean
}

export const state = (): State => ({
  isAuth: false,
  user: null,
  imgList: [],
  isLoadingImg: true,
})

export const mutations = {
  updateAuth(state: State, payload: boolean): void {
    state.isAuth = payload
  },

  updateUser(state: State, payload: firebase.User): void {
    state.user = payload
  },

  updateImgList(state: State, payload: DocumentData): void {
    state.imgList = payload
  },

  updateLoadingImg(state: State) {
    state.isLoadingImg = !state.isLoadingImg
  },
}

export const actions = {
  async preloadImgList({ commit }): Promise<void> {
    const loadedImgList = await loadImgList()

    commit('updateImgList', loadedImgList)
    commit('updateLoadingImg')
  },
}
