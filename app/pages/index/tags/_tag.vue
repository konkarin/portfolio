<template>
  <main class="wrapper">
    <PageTitle>タグ: {{ tag }}</PageTitle>
    <div class="article">
      <ArticleList :articles="articles" />
      <ArticlesSideMenu :recent-articles="recentArticles" :tags="tags" />
    </div>
  </main>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  useMeta,
  useStore,
  useContext,
  useFetch,
  useAsync,
  useStatic,
  watch,
} from '@nuxtjs/composition-api'

import { db } from '@/api/apis'
import { Article } from '@/types/index'
import { Order, Query } from '~/api/firestore'
import { State } from '~/store'

export default defineComponent({
  name: 'PagesTag',
  head: {},
  setup() {
    const store = useStore<State>()
    const { params, error } = useContext()

    const articles = ref<Article[]>([])
    const recentArticles = ref<Article[]>([])
    const tags = ref<string[]>([])
    const tag = computed(() => params.value.tag)
    const articleTags = computed((): string[] => {
      return store.state.articleTags
    })

    onMounted(() => {
      const existsArtcileTag = articleTags.value.includes(tag.value)
      if (!existsArtcileTag) {
        error({ message: 'ページが見つかりません' })
      }
    })

    const getArticles = async (param: string) => {
      const artilcesPath = `users/${process.env.AUTHOR_ID}/articles`
      const order: Order = {
        fieldPath: 'releaseDate',
        direction: 'desc',
      }
      const queries1: Query = {
        fieldPath: 'tags',
        filterStr: 'array-contains',
        value: param,
      }
      const queries2: Query = {
        fieldPath: 'isPublished',
        filterStr: '==',
        value: true,
      }
      return (await db
        .getDocsByCompoundQueries(artilcesPath, [queries1, queries2], order)
        .catch((e) => {
          console.error(e)
          return []
        })) as Article[]
    }

    // generate時のみ実行
    useFetch(async () => {
      const data = await getArticles(tag.value)
      articles.value = data
    })

    recentArticles.value = store.state.recentArticles
    tags.value = store.state.articleTags

    // クライアント側の動的ルーティングで実行
    const staticData = useStatic(
      async (param) => await getArticles(param),
      tag,
      'tag'
    )
    watch(staticData, () => {
      if (staticData.value !== null) articles.value = staticData.value
    })

    useMeta({
      title: `${tag.value}の記事`,
      meta: [
        { hid: 'og:type', property: 'og:type', content: 'article' },
        {
          hid: 'og:title',
          property: 'og:title',
          content: `${tag.value}の記事 - kon_karin's photo & blog`,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${process.env.APP_URL}tags/${tag.value}`,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: `${tag.value}の記事`,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: 'https://konkarin.photo/HomeImg.jpg',
        },
      ],
    })

    return { articles, recentArticles, tags, tag, articleTags }
  },
})
</script>
