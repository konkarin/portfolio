<template>
  <main class="wrapper">
    <div v-if="articles && articleTags" class="article">
      <NuxtPage :articles="articles" />
      <ArticlesSideMenu :recent-articles="recentArticles" :tags="articleTags" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { getArticleTags, getArticles } from '~/utils/article'

const { AUTHOR_ID } = useRuntimeConfig().public

const { data: articles } = await useAsyncData('articles', () => {
  return getArticles(AUTHOR_ID)
})
const articleComputed = computed(() => articles.value || [])

const { data: tags } = await useAsyncData('tags', () => {
  return getArticleTags(AUTHOR_ID)
})
const articleTags = computed(() => {
  if (tags.value === null) {
    return []
  }

  return tags.value.filter((tag) => {
    return articleComputed.value.some((article) => article.tags.includes(tag))
  })
})

const recentArticles = computed(() => articles.value?.slice(0, 2) || [])
</script>
