<template>
  <GalleryView />
</template>

<script setup lang="ts">
defineOptions({
  name: 'PagesGallery',
})

const { APP_URL } = useRuntimeConfig().public

useHead({
  title: 'Gallery',
  meta: [
    {
      name: 'description',
      content: 'Photos by konkarin',
    },
    { property: 'og:type', content: 'article' },
    {
      property: 'og:title',
      content: "Gallery - konkarin's photos & blog",
    },
    {
      property: 'og:url',
      content: `${APP_URL}/gallery`,
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
