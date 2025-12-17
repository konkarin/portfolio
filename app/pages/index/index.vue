<template>
  <HomeView />
</template>

<script setup lang="ts">
defineOptions({
  name: 'PageIndex',
})

const { APP_URL } = useRuntimeConfig().public

useHead({
  title: 'Home',
  meta: [
    {
      name: 'description',
      content: "konkarin's blog & photos.",
    },
    { property: 'og:type', content: 'article' },
    {
      property: 'og:title',
      content: "konkarin's blog & photos",
    },
    {
      property: 'og:url',
      content: APP_URL,
    },
    {
      property: 'og:description',
      content: "konkarin's blog & photos.",
    },
    {
      property: 'og:image',
      content: 'https://konkarin.photo/HomeImg.jpg',
    },
  ],
})
</script>
