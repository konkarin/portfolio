<template>
  <main class="wrapper">
    <div class="article">
      <NuxtChild />
      <ArticlesSideMenu :recent-articles="recentArticles" :tags="articleTags" />
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Article } from '@/types/index'
import ArticlesSideMenu from '@/components/Article/ArticlesSideMenu.vue'

export default defineComponent({
  components: {
    ArticlesSideMenu,
  },
  computed: {
    articles(): Article[] {
      return this.$store.state.articles
    },

    recentArticles(): Article[] {
      return this.articles.slice(0, 3)
    },

    articleTags(): string[] {
      return this.$store.state.articleTags
    },
  },
})
</script>
