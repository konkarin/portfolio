<template>
  <div class="articleItem">
    <NuxtLink :to="`/articles/${article.id}`" class="articleItem__title">
      {{ article.title }}
    </NuxtLink>
    <div class="articleItem__footer">date</div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Timestamp } from '@/types/firebase'

export interface Article {
  id: string
  title: string
  text: string
  isPublished: boolean
  updatedDate: Timestamp
}

export default Vue.extend({
  props: {
    article: {
      type: Object as PropType<Article>,
      required: true,
    },
  },
  head() {
    return {
      title: 'Articles',
    }
  },
})
</script>
