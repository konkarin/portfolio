<template>
  <li class="post">
    <NuxtLink :to="`/articles/${article.customId || article.id}`">
      <div class="post-inner">
        <div>
          <p class="post-subTitle">
            {{ releaseDate(article.releaseDate) }}
          </p>
          <p class="post-title">
            {{ article.title }}
          </p>
        </div>
        <p class="post-text">{{ article.text }}</p>
      </div>
      <div class="post-img">
        <img v-if="article.ogpImageUrl" :src="article.ogpImageUrl" alt="" />
        <div class="post-dummyImg" v-else>🦊</div>
      </div>
    </NuxtLink>
  </li>
</template>

<script setup lang="ts">
import type { Article } from '@/types'
import Day from '@/utils/day'

const { article } = defineProps<{
  article: Article
}>()

const releaseDate = (date?: number) => {
  const format = 'YYYY-MM-DD'

  return Day.getDate(date, format)
}
</script>
