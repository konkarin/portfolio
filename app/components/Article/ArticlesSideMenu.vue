<template>
  <div class="sideMenu">
    <aside class="sideMenu__content">
      <div class="sideMenu__title">最新記事</div>
      <ArticlesSideMenuItem
        v-for="article in recentArticles"
        :key="article.id"
        :article="article"
      />
    </aside>
    <div class="sideMenu__content">
      <div class="sideMenu__title">タグ</div>
      <div v-for="tag in tags" :key="tag" class="sideMenuItem">
        <NuxtLink :to="`/tags/${tag}`" class="sideMenuItem__title">
          {{ tag }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { Article } from '@/types/index'

export default defineComponent({
  props: {
    recentArticles: {
      type: Array as PropType<Article[]>,
      required: true,
    },
    tags: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
})
</script>
