<template>
  <div class="article__container">
    <h1>{{ article.title }}</h1>
    <div class="article__content">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <MarkdownPreview v-html="markdownText" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Article } from '@/types/index'

export default Vue.extend({
  props: {
    article: {
      type: Object as PropType<Article>,
      required: true,
    },
    markdownText: {
      type: String,
      required: true,
    },
  },
})
</script>
