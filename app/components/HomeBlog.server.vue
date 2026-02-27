<template>
  <section class="server-component">
    <h2>Blog</h2>
    <ul class="blog">
      <HomeBlogItem v-for="article in recentArticles" :key="article.id" :article />
    </ul>
    <div class="blog-footer">
      <NuxtLink to="articles" class="link-button">View All Posts</NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
const { articles: allArticles } = await useArticles()
const recentArticles = computed(() => {
  return allArticles.value?.slice(0, 2) || []
})
</script>
