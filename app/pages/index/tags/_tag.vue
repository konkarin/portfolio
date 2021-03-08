<template>
  <main class="wrapper">
    <PageTitle>Tags: {{ $route.params.tag }}</PageTitle>
    <div class="article">
      <ArticleList :articles="articles" />
      <ArticlesSideMenu :tags="tags" />
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
  tag: string
}

export default Vue.extend({
  async asyncData({ params, payload }): Promise<Data> {
    if (payload) {
      return {
        articles: payload,
        tag: params.tag,
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
        tag: params.tag,
      }
    }
  },
  data(): Data {
    return {
      articles: [],
      tag: this.$route.params.tag,
    }
  },
  head(): { title: string } {
    return {
      title: `${this.$route.params.tag}の記事`,
    }
  },
})
</script>
