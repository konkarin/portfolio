<template>
  <main class="wrapper">
    <PageTitle>タグ: {{ $route.params.tag }}</PageTitle>
    <div class="article">
      <ArticleList :articles="articlesByTag" />
      <ArticlesSideMenu :recent-articles="recentArticles" :tags="tags" />
    </div>
  </main>
</template>

<script lang="ts">
import { db } from '@/api/apis'
import { Article } from '@/types/index'
import { Order, Query } from '~/api/firestore'
import { getArticleTags, getArticles } from '~/utils/article'

interface Data {
  articlesByTag: Article[]
  recentArticles: Article[]
  tag: string
  tags: string[]
}

export default defineNuxtComponent({
  name: 'PagesTag',
  scrollToTop: true,
  async asyncData({ params, payload, $config }): Promise<Data> {
    if (payload) {
      const { articlesByTag, recentArticles, allTags } = payload
      return {
        articlesByTag,
        recentArticles,
        tag: params.tag,
        tags: allTags,
      }
    } else {
      const artilcesPath = `users/${$config.public.AUTHOR_ID}/articles`

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

      const articlesByTag = (await db
        .getDocsByCompoundQueries(artilcesPath, [queries1, queries2], order)
        .catch((e) => {
          console.error(e)
          return []
        })) as Article[]

      const aritcles = await getArticles($config.public.AUTHOR_ID)
      const recentArticles = aritcles.slice(0, 2)

      const allTags = await getArticleTags($config.public.AUTHOR_ID)

      return {
        articlesByTag,
        recentArticles,
        tag: params.tag,
        tags: allTags,
      }
    }
  },
  data(): Data {
    return {
      articlesByTag: [],
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
          content: `${this.$config.public.APP_URL}tags/${this.$route.params.tag}`,
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
})
</script>
