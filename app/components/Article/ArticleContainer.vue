<template>
  <main class="wrapper">
    <PageTitle>Articles</PageTitle>
    <div class="article">
      <NuxtChild :articles="articles" />
      <ArticlesSideMenu :recent-articles="recentArticles" :tags="tags" />
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
    tags: {
      type: Array as PropType<string[]>,
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
