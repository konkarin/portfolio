import apis from '@/api/apis'
import firebase from '@/plugins/firebase'
import { DocumentData, FirebaseUser, Order, Queries } from '@/types/firebase'
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
  recentArticles: Article[]
  articleTags: string[]
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
  articles: [],
  recentArticles: [],
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

  updateRecentArticles(state: State, payload: Article[]) {
    state.recentArticles = payload
  },

  updateArticleTags(state: State, payload: string[]) {
    state.articleTags = payload
  },
}

export const actions = {
  async nuxtServerInit({ commit }) {
    // 一覧用の記事一覧
    const articles = await getArticles()

    // サイドメニュー用の最新記事一覧
    const recentArticles = articles.slice(0, 2)

    // サイドメニュー用のタグ一覧
    const articleTags = await getArticleTags()

    commit('updateArticles', articles)
    commit('updateRecentArticles', recentArticles)
    commit('updateArticleTags', articleTags)

    // 画像一覧の取得
    const imgList = await getImgList()

    commit('updateImgList', imgList)
  },
}

const getArticles = async () => {
  const articlesPath = `users/${process.env.authorId}/articles`
  const queries: Queries = {
    fieldPath: 'isPublished',
    filterStr: '==',
    value: true,
  }
  const order: Order = {
    fieldPath: 'updatedDate',
    direction: 'desc',
  }

  // 一覧用の記事一覧
  return (await apis.db
    .getOrderDocsByQueries(articlesPath, queries, order)
    .catch((e) => {
      console.error(e)
      return []
    })) as Article[]
}

const getArticleTags = async () => {
  const tagsPath = `users/${process.env.authorId}/articleTags`
  // サイドメニュー用のタグ一覧
  return (await apis.db.getDocIds(tagsPath).catch((e) => {
    console.error(e)
    return []
  })) as string[]
}

const getImgList = async () => {
  const collectionPath = `/users/${process.env.authorId}/images`

  return await apis.db.getDocs(collectionPath)
}
