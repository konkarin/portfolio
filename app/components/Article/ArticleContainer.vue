<template>
  <main class="wrapper">
    <div v-if="allArticles && articleTags" class="articleContainer">
      <NuxtPage :articles="allArticles" />
      <ArticlesSideMenu :recent-articles="recentArticles" :tags="articleTags" />
    </div>
  </main>
</template>

<script setup lang="ts">
const { $tags: allTags, $articles: allArticles } = useNuxtApp()

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

<style lang="scss" scoped>
.articleContainer {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
}

@media screen and (max-width: $lg) {
  .articleContainer {
    display: block;
  }
}
</style>
