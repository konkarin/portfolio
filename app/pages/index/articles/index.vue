<template>
  <ArticleList :articles="articles" />
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Article } from '~/types'

export default defineNuxtComponent({
  name: 'PagesArticlesIndex',
  props: {
    articles: {
      type: Array as PropType<Article[]>,
      required: true,
    },
  },
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
          content: `${this.$config.public.APP_URL}articles`,
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
})
</script>
