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
      hid: 'description',
      name: 'description',
      content: "konkarin's photos & blog.",
    },
    { hid: 'og:type', property: 'og:type', content: 'article' },
    {
      hid: 'og:title',
      property: 'og:title',
      content: "konkarin's photos & blog",
    },
    {
      hid: 'og:url',
      property: 'og:url',
      content: APP_URL,
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content: "konkarin's photos & blog.",
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: 'https://konkarin.photo/HomeImg.jpg',
    },
  ],
})
</script>
