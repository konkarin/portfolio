<template>
  <main class="wrapper">
    <PageTitle>タグ: {{ $route.params.tag }}</PageTitle>
    <div class="article">
      <ArticleList />
      <ArticlesSideMenu />
    </div>
  </main>
</template>

<script setup lang="ts">
const { params } = useRoute()
const { APP_URL } = useRuntimeConfig().public

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
