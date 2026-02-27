<template>
  <main class="wrapper">
    <PageTitle>タグ: {{ $route.params.tag }}</PageTitle>
    <div class="article">
      <ArticleList :articles="articlesByTag || []" />
      <ArticlesSideMenu :recent-articles="recentArticles" :tags="allTags || []" />
    </div>
  </main>
</template>

<script setup lang="ts">
const { params } = useRoute()
const { APP_URL } = useRuntimeConfig().public

const { articles: articlesByTag } = await useArticles({
  tag: params.tag as string,
})
const { articles: recentArticles } = await useArticles({ limit: 2 })
const { tags: allTags } = await useArticleTags()

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
      content: `Articles of '${params.tag}' - konkarin.photo`,
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
