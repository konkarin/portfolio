<template>
  <div class="articleItem">
    <div class="articleItem__container">
      <NuxtLink :to="`/articles/edit/${article.id}`" class="articleItem__title">
        {{ article.title }}
      </NuxtLink>
      <div class="articleItem__actionContainer">
        <NuxtLink
          :to="`/articles/edit/${article.id}`"
          class="articleItem__edit edit"
        >
          <Pencil />
          <span class="edit__tooltip">編集</span>
        </NuxtLink>
      </div>
    </div>
    <div class="articleItem__footer">
      {{ relativeTime(article.updatedDate) }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Day from '@/utils/day'

interface Article {
  title: string
  isPublished: boolean
}

const day = new Day()

export default Vue.extend({
  props: {
    article: {
      type: Object as PropType<Article>,
      required: true,
    },
  },
  methods: {
    relativeTime(date: string) {
      return day.relativeTime(date)
    },
  },
})
</script>
