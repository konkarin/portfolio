<template>
  <main class="wrapper">
    <div v-if="allArticles && articleTags" class="article">
      <NuxtPage :articles="allArticles" />
      <ArticlesSideMenu :recent-articles="recentArticles" :tags="articleTags" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { useNuxtApp } from '#app'

const { $tags: allTags, $aritcles: allArticles } = useNuxtApp()

const articleTags = computed(() => {
  if (allTags.value === null) {
    return []
  }

  return allTags.value.filter((tag) => {
    return allArticles.value.some((article) => article.tags.includes(tag))
  })
})

const recentArticles = computed(() => allArticles.value?.slice(0, 2) || [])

defineExpose({
  allArticles,
  articleTags,
  recentArticles,
})
</script>
