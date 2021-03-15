<template>
  <main class="home-image" />
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  head() {
    return {
      title: 'Home',
      meta: [
        { hid: 'og:type', property: 'og:type', content: 'article' },
        {
          hid: 'og:title',
          property: 'og:title',
          content: "kon_karin's photo & blog",
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${process.env.APP_URL}`,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: 'kon_karinの写真とブログです。',
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: `/HomeImg.jpg`,
        },
      ],
    }
  },
})
</script>
