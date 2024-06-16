<template>
  <NuxtLink :to="`/articles/${articleId}`" class="sideMenuItem">
    <div class="sideMenuItem__subTitle" data-test="releaseDate">
      {{ releaseDate }}
    </div>
    <div class="sideMenuItem__title" data-test="articleTitle">
      {{ article.title }}
    </div>
  </NuxtLink>
</template>

<script lang="ts">
import Day from '@/utils/day'
import { Article } from '@/types/index'

export default defineComponent({
  props: {
    article: {
      type: Object as PropType<Article>,
      required: true,
    },
  },
  computed: {
    articleId() {
      return this.article.customId || this.article.id
    },
    releaseDate(): string {
      const format = 'YYYY-MM-DD'

      return Day.getDate(this.article.releaseDate, format)
    },
  },
})
</script>
