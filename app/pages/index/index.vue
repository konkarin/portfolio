<template>
  <HomeView />
</template>

<script setup lang="ts">
import { useRuntimeConfig, useHead } from '#app'
import HomeView from '@/components/HomeView.vue'
defineOptions({
  name: 'PageIndex',
})

const { APP_URL } = useRuntimeConfig().public

useHead({
  title: 'Home',
  meta: [
    {
      name: 'description',
      content: 'konkarin.photo',
    },
    { property: 'og:type', content: 'article' },
    {
      property: 'og:title',
      content: 'konkarin.photo',
    },
    {
      property: 'og:url',
      content: APP_URL,
    },
    {
      property: 'og:description',
      content: 'konkarin.photo',
    },
    {
      property: 'og:image',
      content: 'https://konkarin.photo/HomeImg.jpg',
    },
  ],
})
</script>
