<template>
  <div class="articleItem">
    <div class="articleItem__container">
      <NuxtLink
        :to="`/dashboard/articles/${article.id}`"
        class="articleItem__title"
      >
        {{ article.title }}
      </NuxtLink>
      <div class="articleItem__actionContainer">
        <NuxtLink
          :to="`/dashboard/articles/${article.id}`"
          class="articleItem__edit edit"
        >
          <Pencil />
          <span class="edit__tooltip">編集</span>
        </NuxtLink>
      </div>
    </div>
    <div class="articleItem__footer">
      {{ relativeTime }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Day from '@/utils/day'
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
  computed: {
    relativeTime() {
      return Day.relativeTime((this.article.updatedDate as Timestamp).toDate())
    },
  },
})
</script>
