<template>
  <ArticleContainer :articles="articles" :tags="tags" />
</template>

<script lang="ts">
import Vue from 'vue'
import { Article } from '@/types/index'
import apis from '@/api/apis'

interface Data {
  articles: Article[]
  tags: string[]
}

export default Vue.extend({
  async asyncData(): Promise<Data> {
    const articlesPath = `users/${process.env.authorId}/articles`

    const articles = (await apis.db.getOrderDocs(
      articlesPath,
      'updatedDate',
      'desc'
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
  async mounted() {
    // asyncDataのフォールバック処理
    if (this.articles.length === 0) {
      const collectionPath = `users/${process.env.authorId}/articles`

      this.articles = (await apis.db.getOrderDocs(
        collectionPath,
        'updatedDate',
        'desc'
      )) as Article[]
    }

    if (this.tags.length === 0) {
      const tagsPath = `users/${process.env.authorId}/articleTags`
      this.tags = (await apis.db.getDocIds(tagsPath)) as string[]
    }
  },
  head() {
    return {
      title: 'Articles',
    }
  },
})
</script>
