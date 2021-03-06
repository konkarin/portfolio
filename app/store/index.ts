import apis, { loadImgList } from '@/api/apis'
import firebase from '@/plugins/firebase'
import { DocumentData, FirebaseUser } from '@/types/firebase'
import { Article } from '@/types/index'

interface State {
  isAuth: boolean
  user: FirebaseUser
  imgList: DocumentData[]
  isLoadingImg: boolean
  photoModal: {
    url: string
    show: boolean
    exif: object
  }
  articles: Article[]
  articleTags: string[]
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
  articles: [],
  articleTags: [],
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

  updateArticles(state: State, payload: Article[]) {
    state.articles = payload
  },

  updateArticleTags(state: State, payload: string[]) {
    state.articleTags = payload
  },
}

export const actions = {
  async nuxtServerInit({ commit }) {
    const articlesPath = `users/${process.env.authorId}/articles`

    const articles = (await apis.db.getOrderDocs(
      articlesPath,
      'updatedDate',
      'desc'
    )) as Article[]

    const tagsPath = `users/${process.env.authorId}/articleTags`
    const tags = (await apis.db.getDocIds(tagsPath)) as string[]

    commit('updateArticles', articles)
    commit('updateArticleTags', tags)
  },

  async preloadImgList({ commit }): Promise<void> {
    const loadedImgList = await loadImgList()

    commit('updateImgList', loadedImgList)
    commit('updateLoadingImg')
  },
}
