<template>
  <main class="wrapper">
    <div v-if="articles && articleTags" class="article">
      <NuxtPage :articles="articles" />
      <ArticlesSideMenu :recent-articles="recentArticles" :tags="articleTags" />
    </div>
  </main>
</template>

<script lang="ts">
import { useArticles } from '@/composables/useArticles'
import ArticlesSideMenu from '@/components/Article/ArticlesSideMenu.vue'

export default defineComponent({
  components: {
    ArticlesSideMenu,
  },
  setup() {
    const { articles, articleTags } = useArticles()
    const recentArticles = computed(() => articles.value?.slice(0, 2))

    return {
      articles,
      recentArticles,
      articleTags,
    }
  },
})
</script>
