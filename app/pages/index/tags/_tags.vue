<template>
  <main class="wrapper">
    <PageTitle>Tags: {{ $route.params.tags }}</PageTitle>
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
  tags: string[]
}

export default Vue.extend({
  async asyncData({ params }): Promise<Data> {
    const artilcesPath = `users/${process.env.authorId}/articles`

    const queries: Queries = {
      fieldPath: 'tags',
      filterStr: 'array-contains',
      value: params.tags,
    }

    const articles = (await apis.db.getDocsByQueries(
      artilcesPath,
      queries
    )) as Article[]

    const tagsPath = `users/${process.env.authorId}/articleTags`
    const tags = (await apis.db.getDocIds(tagsPath)) as string[]

    return {
      articles,
      tags,
    }
  },
  data(): Data {
    return {
      articles: [],
      tags: [],
    }
  },
})
</script>
