<template>
  <div class="articleItem">
    <div class="articleItem__subTitle">{{ articleDate }}</div>
    <NuxtLink :to="`/articles/${article.id}`" class="articleItem__title">
      {{ article.title }}
    </NuxtLink>
    <!-- <div class="articleItem__footer">
      タグが入る
      {{ article.tag }}
    </div> -->
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Day from '@/utils/day'
import { Article } from '@/types/index'

export default Vue.extend({
  props: {
    article: {
      type: Object as PropType<Article>,
      required: true,
    },
  },
  computed: {
    articleDate(): string {
      const format = 'YYYY-MM-DD'

      return Day.getDate(this.article.updatedDate, format)
    },
  },
  head() {
    return {
      title: 'Articles',
    }
  },
})
</script>
