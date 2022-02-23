<template>
  <main class="wrapper">
    <PageTitle>タグ: {{ $route.params.tag }}</PageTitle>
    <div class="article">
      <ArticleList :articles="articles" />
      <ArticlesSideMenu :recent-articles="recentArticles" :tags="tags" />
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import apis from '@/api/apis'
import { Order, Queries } from '@/types/firebase'
import { Article } from '@/types/index'

interface Data {
  articles: Article[]
  recentArticles: Article[]
  tag: string
  tags: string[]
}

export default Vue.extend({
  name: 'PagesTag',
  async asyncData({ params, payload, store }): Promise<Data> {
    if (payload) {
      return {
        articles: payload,
        recentArticles: store.state.recentArticles,
        tag: params.tag,
        tags: store.state.articleTags,
      }
    } else {
      const artilcesPath = `users/${process.env.authorId}/articles`

      const order: Order = {
        fieldPath: 'releaseDate',
        direction: 'desc',
      }
      const queries1: Queries = {
        fieldPath: 'tags',
        filterStr: 'array-contains',
        value: params.tag,
      }
      const queries2: Queries = {
        fieldPath: 'isPublished',
        filterStr: '==',
        value: true,
      }

      const articles = (await apis.db
        .getDocsByCompoundQueries(artilcesPath, queries1, queries2, order)
        .catch((e) => {
          console.error(e)
          return []
        })) as Article[]

      return {
        articles,
        recentArticles: store.state.recentArticles,
        tag: params.tag,
        tags: store.state.articleTags,
      }
    }
  },
  data(): Data {
    return {
      articles: [],
      recentArticles: [],
      tag: this.$route.params.tag,
      tags: [],
    }
  },
  computed: {
    articleTags(): string[] {
      return this.$store.state.articleTags
    },
  },
  mounted() {
    // 存在しないタグにアクセスしたらエラー
    const existsArtcileTag = this.articleTags.includes(this.$route.params.tag)

    if (!existsArtcileTag)
      this.$nuxt.error({ message: 'ページが見つかりません' })
  },
  head(): any {
    return {
      title: `${this.$route.params.tag}の記事`,
      meta: [
        { hid: 'og:type', property: 'og:type', content: 'article' },
        {
          hid: 'og:title',
          property: 'og:title',
          content: `${this.$route.params.tag}の記事 - kon_karin's photo & blog`,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${process.env.APP_URL}tags/${this.$route.params.tag}`,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: `${this.$route.params.tag}の記事`,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: 'https://konkarin-photo.web.app/HomeImg.jpg',
        },
      ],
    }
  },
})
</script>
