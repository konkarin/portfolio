<template>
  <ul v-if="articles && articles.length > 0" class="artcileList">
    <ArticleItem v-for="article in articles" :key="article.id" :article="article" />
  </ul>
  <div v-else>
    <div>記事がありません</div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from '#app'
import ArticleItem from '@/components/Article/ArticleItem.vue'
import { useArticles } from '@/composables/useArticles'

const route = useRoute()
const tag = route.params.tag as string | undefined
const { articles } = await useArticles({ tag })
</script>

<style scoped lang="scss">
.artcileList {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  justify-items: center;
}

@media screen and (max-width: $md) {
  .artcileList {
    grid-template-columns: 1fr;
  }
}
</style>
