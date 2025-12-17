<template>
  <div>
    <HeaderNav />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: `konkarin's blog & photos`,
  meta: [
    { property: 'og:type', content: 'article' },
    {
      property: 'og:url',
      // content: `${this.$config.public.APP_URL}`,
    },
    {
      property: 'og:image',
      content: 'https://konkarin.photo/HomeImg.jpg',
    },
  ],
})

useRouterCommand('root')
</script>
