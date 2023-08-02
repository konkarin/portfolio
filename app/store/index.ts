import { getAccessorType, mutationTree, actionTree, getterTree } from 'typed-vuex'
import type { DocumentData } from 'firebase/firestore'
import type { User } from 'firebase/auth'
import { db } from '@/api/apis'

interface State {
  isAuth: boolean
  user: User | null
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
  isLoadingImg: false,
  photoModal: {
    url: '',
    show: false,
    exif: {},
  },
})

export const getters = getterTree(state, {
  getUser: (state) => state.user,
})

export const mutations = mutationTree(state, {
  updateAuth(state: State, payload: boolean): void {
    state.isAuth = payload
  },

  updateUser(state: State, payload: User): void {
    state.user = payload
  },

  updateImgList(state: State, payload: DocumentData[]): void {
    state.imgList = payload
  },

  updateLoadingImg(state: State): void {
    state.isLoadingImg = !state.isLoadingImg
  },

  switchPhotoModal(state: State, payload: State['photoModal']): void {
    state.photoModal = payload
  },
})

export const actions = actionTree(
  { state, mutations },
  {
    async nuxtServerInit({ commit }): Promise<void> {
      const authorId = this.$config.public.AUTHOR_ID

      // 画像一覧の取得
      const imgList = await getImgList(authorId)

      commit('updateImgList', imgList)
    },
  }
)

const getImgList = async (authorId: string) => {
  const collectionPath = `/users/${authorId}/images`

  return await db.getDocsData(collectionPath)
}

export const accessorType = getAccessorType({
  state,
  getters,
  mutations,
  actions,
})
