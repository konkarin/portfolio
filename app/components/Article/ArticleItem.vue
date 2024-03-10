<template>
  <NuxtLink :to="`/articles/${article.id}`" class="articleItem">
    <div data-test="releaseDate" class="articleItem__subTitle">
      {{ releaseDate }}
    </div>
    <div data-test="articleTitle" class="articleItem__title">
      {{ article.title }}
    </div>
    <div class="articleItem__eyeCatchOuter">
      <div class="articleItem__eyeCatchInner">
        <img v-if="article.ogpImageUrl" class="articleItem__eyeCatch" :src="article.ogpImageUrl" />
        <div v-else class="articleItem__emptyEyeCatch">🦊</div>
      </div>
    </div>
  </NuxtLink>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
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
    releaseDate(): string {
      const format = 'YYYY-MM-DD'

      return Day.getDate(this.article.releaseDate, format)
    },
  },
})
</script>

<style scoped lang="scss"></style>
