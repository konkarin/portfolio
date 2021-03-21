<template>
  <NuxtLink
    :to="`/articles/${article.id}`"
    class="sideMenuItem"
    @click.native="scrollTop"
  >
    <div class="sideMenuItem__subTitle">
      {{ articleDate }}
    </div>
    <div class="sideMenuItem__title">{{ article.title }}</div>
  </NuxtLink>
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
  methods: {
    scrollTop() {
      window.scrollTo(0, 0)
    },
  },
})
</script>
