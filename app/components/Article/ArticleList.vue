<template>
  <ul v-if="articles.length > 0" class="artcileList">
    <ArticleItem v-for="article in articles" :key="article.id" :article="article" />
  </ul>
  <div v-else><div>記事がありません</div></div>
</template>

<script lang="ts">
import type { Article } from '@/types/index'

export default defineComponent({
  props: {
    articles: {
      type: Array as PropType<Article[]>,
      required: true,
    },
  },
})
</script>

<style scoped lang="scss">
.artcileList {
  width: calc(100% - 300px);
  display: flex;
  flex-direction: column;
}

@media screen and (max-width: $md) {
  .artcileList {
    width: 100%;
  }
}
</style>
