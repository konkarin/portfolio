<template>
  <div v-if="articles && articles.length > 0">
    <ul ref="listRef" class="artcileList">
      <ArticleItem
        v-for="article in paginatedArticles"
        :key="article.id"
        :article="article"
      />
    </ul>
    <Pagination
      :current-page="currentPage"
      :total-pages="totalPages"
      @change="onPageChange"
    />
  </div>
  <div v-else>
    <div>記事がありません</div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'

import { useRoute } from '#app'
import ArticleItem from '@/components/Article/ArticleItem.vue'
import Pagination from '@/components/Pagination.vue'
import { useArticles } from '@/composables/useArticles'

// 1ページあたりに表示する記事数
const PER_PAGE = 8

const route = useRoute()
const tag = route.params.tag as string | undefined
const { articles } = await useArticles({ tag })

const currentPage = ref(1)
const listRef = ref<HTMLElement | null>(null)

const totalPages = computed(() =>
  Math.max(1, Math.ceil((articles.value?.length ?? 0) / PER_PAGE)),
)

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * PER_PAGE
  return articles.value?.slice(start, start + PER_PAGE) ?? []
})

const onPageChange = async (page: number) => {
  currentPage.value = page
  // 再描画でスムーズスクロールが中断されるため、DOM更新を待ってから一覧の先頭へスクロールする
  await nextTick()
  listRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
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
