<template>
  <section>
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
const recentArticles = computed(() => {
  return useNuxtApp().$articles.value?.slice(0, 2) || []
})
</script>

<style lang="scss" scoped>
h2 {
  margin: 1rem 0;
}

.blog {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.link-button {
  padding: 0.5rem 1rem;
  border-radius: 50px;
  background-color: var(--yellow);
  font-weight: bold;
  transition: opacity 0.3s;
  &:hover {
    opacity: 0.7;
  }
}

.blog-footer {
  margin-top: 2rem;
}
</style>
