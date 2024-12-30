<template>
  <NuxtLink :to="`/articles/${articleId}`" class="articleItem">
    <div data-test="releaseDate" class="articleItem__subTitle">
      {{ releaseDate }}
    </div>
    <div data-test="articleTitle" class="articleItem__title">
      {{ article.title }}
    </div>
    <div class="articleItem__eyeCatchOuter">
      <div class="articleItem__eyeCatchInner">
        <img
          v-if="article.ogpImageUrl"
          class="articleItem__eyeCatch"
          :src="article.ogpImageUrl"
          loading="lazy"
        />
        <div v-else class="articleItem__emptyEyeCatch">🦊</div>
      </div>
    </div>
  </NuxtLink>
</template>

<script lang="ts">
import Day from '@/utils/day'
import type { Article } from '@/types/index'

export default defineComponent({
  props: {
    article: {
      type: Object as PropType<Article>,
      required: true,
    },
  },
  computed: {
    releaseDate(): string {
      const format = 'YYYY-MM-DD'

      return Day.getDate(this.article.releaseDate, format)
    },
    articleId() {
      return this.article.customId || this.article.id
    },
  },
})
</script>

<style scoped lang="scss"></style>
