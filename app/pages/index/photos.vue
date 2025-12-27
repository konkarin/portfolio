<template>
  <PhotosView />
</template>

<script setup lang="ts">
defineOptions({
  name: 'PagesPhotos',
})

const { APP_URL } = useRuntimeConfig().public

useHead({
  title: 'Photos',
  meta: [
    {
      name: 'description',
      content: 'Photos by konkarin',
    },
    { property: 'og:type', content: 'article' },
    {
      property: 'og:title',
      content: 'Photos - konkarin.photo',
    },
    {
      property: 'og:url',
      content: `${APP_URL}/photos`,
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
