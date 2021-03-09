<template>
  <main class="wrapper">
    <PageTitle>Tags: {{ $route.params.tag }}</PageTitle>
    <div class="article">
      <ArticleList :articles="articles" />
      <ArticlesSideMenu :recent-articles="recentArticles" :tags="tags" />
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import apis from '@/api/apis'
import { Queries } from '@/types/firebase'
import { Article } from '@/types/index'

interface Data {
  articles: Article[]
  recentArticles: Article[]
  tag: string
  tags: string[]
}

export default Vue.extend({
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

      const queries: Queries = {
        fieldPath: 'tags',
        filterStr: 'array-contains',
        value: params.tag,
      }

      const articles = (await apis.db.getDocsByQueries(
        artilcesPath,
        queries
      )) as Article[]

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
  head(): { title: string } {
    return {
      title: `${this.$route.params.tag}の記事`,
    }
  },
})
</script>
