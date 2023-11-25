import { defineNuxtPlugin } from '#app'

import { createStore } from 'vuex'
import { useAccessor, mutationTree, actionTree, getterTree } from 'typed-vuex'
import type { DocumentData } from 'firebase/firestore'
import type { User } from 'firebase/auth'
import { db } from '@/api/apis'
import { NuxtApp } from 'nuxt/app'

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
    async nuxtServerInit({ commit }, config): Promise<void> {
      const authorId = config.public.AUTHOR_ID

      // 画像一覧の取得
      const { data: imgList } = await useAsyncData(
        'imgList',
        async () => {
          const result = await getImgList(authorId)

          return result.map((img) => {
            // FIXME: firestoreのtimestamp型をdevalueで解釈できないので一旦消す
            delete img.exif
            return img
          })
        },
        {
          default(): DocumentData[] {
            return []
          },
        }
      )

      commit('updateImgList', imgList.value)
    },
  }
)

const getImgList = async (authorId: string) => {
  const collectionPath = `/users/${authorId}/images`

  return await db.getDocsData(collectionPath)
}

const storePattern = {
  state,
  getters,
  mutations,
  actions,
}

const store = createStore(storePattern)

const accessor = useAccessor(store, storePattern)

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  nuxtApp.vueApp.use(store)
  nuxtApp.vueApp.config.globalProperties.$accessor = accessor

  // Nuxt v2との互換性のためのcontext注入
  // https://github.com/nuxt/nuxt/blob/d4b9e4b0553bcd617ecbc0b8b76871070b347fcb/packages/vue-app/template/index.js#L164-L165
  // store.app = nuxtApp

  if (process.server) {
    store.dispatch('nuxtServerInit', config)
  }

  if (process.server) {
    nuxtApp.payload.storeState = store.state
  } else if (nuxtApp.payload.storeState) {
    store.replaceState(nuxtApp.payload.storeState as typeof store.state)
  }

  return {
    provide: {
      store,
      accessor,
    },
  }
})

declare module 'vue' {
  interface ComponentCustomProperties {
    $accessor: typeof accessor
    // Nuxt v2との互換性のための型定義
    $store: typeof store
  }
}

// Nuxt v2との互換性のための型定義
declare module 'vuex/types/index' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Store<S> {
    app: NuxtApp
  }
}
