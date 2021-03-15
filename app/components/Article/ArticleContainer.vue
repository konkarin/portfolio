<template>
  <main class="wrapper">
    <PageTitle>Articles</PageTitle>
    <div class="article">
      <NuxtChild />
      <ArticlesSideMenu :recent-articles="recentArticles" :tags="articleTags" />
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import { Article } from '@/types/index'

export default Vue.extend({
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
})
</script>
