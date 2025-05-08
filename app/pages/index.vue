<template>
  <div>
    <HeaderNav />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: `konkarin's photos & blog`,
  meta: [
    { hid: 'og:type', property: 'og:type', content: 'article' },
    {
      hid: 'og:url',
      property: 'og:url',
      // content: `${this.$config.public.APP_URL}`,
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: 'https://konkarin.photo/HomeImg.jpg',
    },
  ],
})
</script>
