<template>
  <PhotosView />
</template>

<script setup lang="ts">
import { useRuntimeConfig, useRoute, useHead } from '#app'
import PhotosView from '@/components/PhotosView.vue'
defineOptions({
  name: 'PagesPhotoDetail',
})

const { APP_URL } = useRuntimeConfig().public
const route = useRoute()

useHead({
  title: 'Photo',
  meta: [
    {
      name: 'description',
      content: 'Photos by konkarin',
    },
    { property: 'og:type', content: 'article' },
    {
      property: 'og:title',
      content: 'Photo - konkarin.photo',
    },
    {
      property: 'og:url',
      content: `${APP_URL}/photos/${route.params.id}`,
    },
    {
      property: 'og:description',
      content: 'Photos by konkarin',
    },
    {
      property: 'og:image',
      content: 'https://konkarin.photo/HomeImg.jpg',
    },
  ],
})
</script>
