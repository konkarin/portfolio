<template>
  <div>
    <HeaderNav />
    <NuxtPage />
  </div>
</template>

<script lang="ts">
import HeaderNav from '@/components/HeaderNav.vue'

export default defineNuxtComponent({
  name: 'PagesIndex',
  components: {
    HeaderNav,
  },
  head() {
    return {
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
    }
  },
})
</script>
