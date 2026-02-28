<template>
  <ArticleContainer>
    <ArticleList />
  </ArticleContainer>
</template>

<script setup lang="ts">
const { APP_URL } = useRuntimeConfig().public
useHead({
  title: 'Articles',
  meta: [
    {
      name: 'description',
      content: "konkarin's article list.",
    },
    { property: 'og:type', content: 'article' },
    {
      property: 'og:title',
      content: 'Articles - konkarin.photo',
    },
    {
      property: 'og:url',
      content: `${APP_URL}/articles`,
    },
    {
      property: 'og:description',
      content: "konkarin's article list.",
    },
    {
      property: 'og:image',
      content: 'https://konkarin.photo/HomeImg.jpg',
    },
  ],
})
</script>
