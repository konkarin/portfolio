<template>
  <div class="sideMenu">
    <aside class="sideMenu__content">
      <div class="sideMenu__title">最新記事</div>
      <ArticlesSideMenuItem
        v-for="article in recentArticles"
        :key="article.id"
        :article="article"
      />
    </aside>
    <div class="sideMenu__content">
      <div class="sideMenu__title">タグ</div>
      <div v-for="tag in tags" :key="tag" class="sideMenuItem">
        <NuxtLink :to="`/tags/${tag}`" class="sideMenuItem__title" no-prefetch>
          {{ tag }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { articles: allArticles } = await useArticles()
const { tags: allTags } = await useArticleTags()

const tags = computed(() => {
  if (allTags.value === null) {
    return []
  }

  return allTags.value.filter((tag) => {
    return allArticles.value.some((article) => article.tags.includes(tag))
  })
})

const recentArticles = computed(() => allArticles.value?.slice(0, 2) || [])
</script>

<style lang="scss" scoped>
.sideMenu {
  position: sticky;
  top: 80px;
  width: 300px;
  height: calc(100vh - 140px);
  padding-left: 3rem;
  // .articleViewと合わせる
  max-width: 70ch;
  margin: 0 auto;
}

.sideMenu__content {
  overflow-y: auto;
  margin-top: 2rem;
  &:first-child {
    margin-top: 1rem;
  }
}

.sideMenu__title {
  font-size: 1.2rem;
  font-weight: bold;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--black);
}

@media screen and (max-width: $lg) {
  .sideMenu {
    margin-top: 6rem;
    display: block;
    width: 100%;
    height: 100%;
    padding: 0;
  }
}
</style>
