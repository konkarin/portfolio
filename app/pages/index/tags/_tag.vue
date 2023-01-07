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
import { db } from '@/api/apis'
import { Article } from '@/types/index'
import { Order, Query } from '~/api/firestore'

interface Data {
  articles: Article[]
  recentArticles: Article[]
  tag: string
  tags: string[]
}

export default Vue.extend({
  name: 'PagesTag',
  scrollToTop: true,
  async asyncData({ params, payload, store }): Promise<Data> {
    if (payload) {
      return {
        articles: payload,
        recentArticles: store.state.recentArticles,
        tag: params.tag,
        tags: store.state.articleTags,
      }
    } else {
      const artilcesPath = `users/${process.env.AUTHOR_ID}/articles`

      const order: Order = {
        fieldPath: 'releaseDate',
        direction: 'desc',
      }
      const queries1: Query = {
        fieldPath: 'tags',
        filterStr: 'array-contains',
        value: params.tag,
      }
      const queries2: Query = {
        fieldPath: 'isPublished',
        filterStr: '==',
        value: true,
      }

      const articles = (await db
        .getDocsByCompoundQueries(artilcesPath, [queries1, queries2], order)
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
  head(): any {
    return {
      title: `Articles of '${this.$route.params.tag}'`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `Articles of '${this.$route.params.tag}'`,
        },
        { hid: 'og:type', property: 'og:type', content: 'article' },
        {
          hid: 'og:title',
          property: 'og:title',
          content: `Articles of '${this.$route.params.tag}' - konkarin's photos & blog`,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${process.env.APP_URL}tags/${this.$route.params.tag}`,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: `Articles of '${this.$route.params.tag}'`,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: 'https://konkarin.photo/HomeImg.jpg',
        },
      ],
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
})
</script>
