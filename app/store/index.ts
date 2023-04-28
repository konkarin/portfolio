import {
  getAccessorType,
  mutationTree,
  actionTree,
  getterTree,
} from 'typed-vuex'
import { DocumentData } from 'firebase/firestore'
import { User } from 'firebase/auth'
import { db } from '@/api/apis'
import { Article } from '@/types/index'
import { Query, Order } from '~/api/firestore'

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

  updateArticles(state: State, payload: Article[]): void {
    state.articles = payload
  },

  updateRecentArticles(state: State, payload: Article[]): void {
    state.recentArticles = payload
  },

  updateArticleTags(state: State, payload: string[]): void {
    state.articleTags = payload
  },
})

export const actions = actionTree(
  { state, mutations },
  {
    async nuxtServerInit({ commit }): Promise<void> {
      const authorId = this.$config.public.AUTHOR_ID

      // 一覧用の記事一覧
      const articles = await getArticles(authorId)

      // サイドメニュー用の最新記事一覧
      const recentArticles = articles.slice(0, 2)

      // サイドメニュー用のタグ一覧
      const articleTags = await getArticleTags(authorId)

      // 記事が存在しないタグをフィルター
      const existTags = articleTags.filter((tag) => {
        return articles.some((article) => article.tags.includes(tag))
      })

      commit('updateArticles', articles)
      commit('updateRecentArticles', recentArticles)
      commit('updateArticleTags', existTags)

      // 画像一覧の取得
      const imgList = await getImgList(authorId)

      commit('updateImgList', imgList)
    },
  }
)

const getArticles = async (authorId: string) => {
  const articlesPath = `users/${authorId}/articles`
  const queries: Query = {
    fieldPath: 'isPublished',
    filterStr: '==',
    value: true,
  }
  const order: Order = {
    fieldPath: 'releaseDate',
    direction: 'desc',
  }

  // 一覧用の記事一覧
  return (await db
    .getOrderDocsByQueries(articlesPath, queries, order)
    .catch((e) => {
      console.error(e)
      return []
    })) as Article[]
}

const getArticleTags = async (authorId: string) => {
  const tagsPath = `users/${authorId}/articleTags`
  // サイドメニュー用のタグ一覧
  return await db.getDocIds(tagsPath).catch((e) => {
    console.error(e)
    return [] as string[]
  })
}

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
