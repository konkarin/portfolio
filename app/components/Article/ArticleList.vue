<template>
  <div class="article__list">
    <template v-if="articles.length > 0">
      <ArticleItem v-for="article in articles" :key="article.id" :article="article" />
    </template>
    <div v-else>記事がありません</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import { Article } from '@/types/index'

export default defineComponent({
  props: {
    articles: {
      type: Array as PropType<Article[]>,
      required: true,
    },
  },
})
</script>
