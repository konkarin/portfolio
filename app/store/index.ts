import { loadImgList } from '@/api/apis'
import firebase from '@/plugins/firebase'
import { DocumentData, FirebaseUser } from '@/types/firebase'

type State = {
  isAuth: boolean
  user: FirebaseUser
  imgList: DocumentData[]
  isLoadingImg: boolean
  photoModal: {
    url: string
    show: boolean
    exif: object
  }
}

export const state = (): State => ({
  isAuth: false,
  user: null,
  imgList: [],
  isLoadingImg: true,
  photoModal: {
    url: '',
    show: false,
    exif: {},
  },
})

export const mutations = {
  updateAuth(state: State, payload: boolean): void {
    state.isAuth = payload
  },

  updateUser(state: State, payload: firebase.User): void {
    state.user = payload
  },

  updateImgList(state: State, payload: DocumentData[]): void {
    state.imgList = payload
  },

  updateLoadingImg(state: State) {
    state.isLoadingImg = !state.isLoadingImg
  },

  switchPhotoModal(state: State, payload: State['photoModal']) {
    state.photoModal = payload
  },
}

export const actions = {
  async preloadImgList({ commit }): Promise<void> {
    const loadedImgList = await loadImgList()

    commit('updateImgList', loadedImgList)
    commit('updateLoadingImg')
  },
}
