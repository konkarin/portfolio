<template>
  <main class="wrapper">
    <PageTitle>Articles</PageTitle>
    <div class="article">
      <NuxtChild :articles="articles" />
      <ArticlesSideMenu :recent-articles="recentArticles" :tags="articleTags" />
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import { Article } from '@/types/index'
import apis from '@/api/apis'

export default Vue.extend({
  async fetch(): Promise<void> {
    const articles = await this.getArticles()
    const tags = await this.getAritcleTags()

    this.$store.commit('updateArticles', articles)
    this.$store.commit('updateArticleTags', tags)
  },
  computed: {
    articles() {
      return this.$store.state.articles
    },

    recentArticles(): Article[] {
      return this.articles.slice(0, 2)
    },

    articleTags(): string[] {
      return this.$store.state.articleTags
    },
  },
  methods: {
    async getArticles() {
      const articlesPath = `users/${process.env.authorId}/articles`

      return (await apis.db.getOrderDocs(
        articlesPath,
        'updatedDate',
        'desc'
      )) as Article[]
    },

    async getAritcleTags() {
      const tagsPath = `users/${process.env.authorId}/articleTags`
      return (await apis.db.getDocIds(tagsPath)) as string[]
    },
  },
})
</script>
