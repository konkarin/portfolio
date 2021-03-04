<template>
  <ArticleContainer :articles="articles" />
</template>

<script lang="ts">
import Vue from 'vue'
import { Article } from '@/types/index'
import apis from '@/api/apis'

interface Data {
  articles: Article[]
}

export default Vue.extend({
  async asyncData(): Promise<Data> {
    const collectionPath = `users/${process.env.authorId}/articles`

    const articles = (await apis.db.getOrderDocs(
      collectionPath,
      'updatedDate',
      'desc'
    )) as Article[]

    return {
      articles,
    }
  },
  data(): Data {
    return {
      articles: [],
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
  },
  head() {
    return {
      title: 'Articles',
    }
  },
})
</script>
