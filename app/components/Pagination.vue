<template>
  <nav v-if="totalPages > 1" class="pagination" aria-label="ページネーション">
    <button
      type="button"
      class="pagination__nav"
      :disabled="currentPage <= 1"
      aria-label="前のページ"
      @click="goTo(currentPage - 1)"
    >
      ‹
    </button>

    <ul class="pagination__list">
      <li v-for="(page, index) in pageItems" :key="index">
        <span v-if="page === '...'" class="pagination__ellipsis">…</span>
        <button
          v-else
          type="button"
          class="pagination__page"
          :class="{ 'pagination__page--current': page === currentPage }"
          :aria-current="page === currentPage ? 'page' : undefined"
          @click="goTo(page)"
        >
          {{ page }}
        </button>
      </li>
    </ul>

    <button
      type="button"
      class="pagination__nav"
      :disabled="currentPage >= totalPages"
      aria-label="次のページ"
      @click="goTo(currentPage + 1)"
    >
      ›
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const { currentPage, totalPages } = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  change: [page: number]
}>()

// 表示するページ番号の配列を生成する（多い場合は省略記号で間引く）
const pageItems = computed<(number | '...')[]>(() => {
  const total = totalPages
  const current = currentPage
  // 現在ページの前後何ページ分を表示するか
  const siblings = 1

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const items: (number | '...')[] = []
  const left = Math.max(2, current - siblings)
  const right = Math.min(total - 1, current + siblings)

  items.push(1)
  if (left > 2) items.push('...')
  for (let page = left; page <= right; page++) {
    items.push(page)
  }
  if (right < total - 1) items.push('...')
  items.push(total)

  return items
})

const goTo = (page: number) => {
  if (page < 1 || page > totalPages || page === currentPage) return
  emit('change', page)
}
</script>

<style scoped lang="scss">
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.pagination__list {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.pagination__page,
.pagination__nav {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 38px;
  height: 38px;
  padding: 0 0.5em;
  font-size: 1em;
  font-weight: bold;
  color: var(--black);
  background-color: transparent;
  border: 1px solid var(--gray);
  border-radius: 0.5em;
  transition: 0.3s;
  // ホバー可能なデバイス（マウス等）のみホバー色を適用する
  // タッチデバイスでタップ後にホバー色が残留するのを防ぐ
  @media (hover: hover) {
    &:hover:not(:disabled) {
      cursor: pointer;
      background-color: var(--yellow);
    }
  }
  &:disabled {
    cursor: default;
    opacity: 0.4;
  }
}

.pagination__page--current {
  color: var(--black);
  background-color: var(--yellow);
  border-color: var(--yellow);
}

.pagination__ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 38px;
  height: 38px;
  color: var(--gray);
}
</style>
