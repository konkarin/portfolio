<template>
  <ArticleList :articles="articles" />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Article } from '@/types/index'

export default Vue.extend({
  props: {
    articles: {
      type: Array as PropType<Article[]>,
      required: true,
    },
  },
})
</script>
