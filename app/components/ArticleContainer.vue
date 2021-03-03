<template>
  <main class="wrapper">
    <PageTitle>Articles</PageTitle>
    <div class="article">
      <NuxtChild :articles="articles" />
      <ArticlesSideMenu :recent-articles="recentArticles" />
    </div>
  </main>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Article } from '@/types/index'

export default Vue.extend({
  props: {
    articles: {
      type: Array as PropType<Article[]>,
      required: true,
    },
  },
  computed: {
    recentArticles(): Article[] {
      return this.articles.slice(0, 2)
    },
  },
})
</script>
