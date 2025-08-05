<template>
  <main class="wrapper">
    <PageTitle>タグ: {{ $route.params.tag }}</PageTitle>
    <div class="article">
      <ArticleList :articles="filterdArticlesByTag" />
      <ArticlesSideMenu :recent-articles="recentArticles" :tags="allTags || []" />
    </div>
  </main>
</template>

<script setup lang="ts">
import type { Article } from '@/types/index'

const { params } = useRoute()
const { APP_URL } = useRuntimeConfig().public

const { $tags: allTags, $articles: allArticles } = useNuxtApp()

const filterdArticlesByTag = computed(() => {
  return allArticles.value.filter((article: Article) => {
    return article.tags.includes(params.tag as string)
  })
})

const recentArticles = computed(() => {
  return allArticles.value?.slice(0, 2) || []
})

useHead({
  title: `Articles of '${params.tag}'`,
  meta: [
    {
      name: 'description',
      content: `Articles of '${params.tag}'`,
    },
    { property: 'og:type', content: 'article' },
    {
      property: 'og:title',
      content: `Articles of '${params.tag}' - konkarin's photos & blog`,
    },
    {
      property: 'og:url',
      content: `${APP_URL}/tags/${params.tag}`,
    },
    {
      property: 'og:description',
      content: `Articles of '${params.tag}'`,
    },
    {
      property: 'og:image',
      content: 'https://konkarin.photo/HomeImg.jpg',
    },
  ],
})
</script>

<script lang="ts">
export default {
  name: 'PagesTag',
}
</script>

<style lang="scss" scoped>
.article {
  display: flex;
  justify-content: space-between;
}

@media screen and (max-width: $lg) {
  .article {
    display: block;
  }
}
</style>
