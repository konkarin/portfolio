<template>
  <ArticleList :articles="articles" />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'PagesArticlesIndex',
  head() {
    return {
      title: 'Articles',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: "konkarin's article list.",
        },
        { hid: 'og:type', property: 'og:type', content: 'article' },
        {
          hid: 'og:title',
          property: 'og:title',
          content: "Articles - konkarin's photos & blog",
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${process.env.APP_URL}articles`,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: "konkarin's article list.",
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: 'https://konkarin.photo/HomeImg.jpg',
        },
      ],
    }
  },
  computed: {
    articles() {
      return this.$store.state.articles
    },
  },
})
</script>
