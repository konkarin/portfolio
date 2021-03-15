<template>
  <ArticleContainer />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  head() {
    return {
      title: 'Articles',
      meta: [
        { hid: 'og:type', property: 'og:type', content: 'article' },
        {
          vmid: 'og:title',
          property: 'og:title',
          content: "Articles - kon_karin's photo & blog",
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${process.env.APP_URL}articles`,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: 'kon_karinが書いた記事の一覧です。',
        },
      ],
    }
  },
})
</script>
