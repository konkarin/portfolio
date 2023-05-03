<template>
  <div class="articleItem">
    <div class="articleItem__titleContainer">
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
        <div class="articleItem__edit edit" @click="removeArticle">
          <Trash />
          <span class="edit__tooltip">削除</span>
        </div>
      </div>
    </div>
    <div class="articleItem__footer">{{ relativeTime }}に作成</div>
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
    relativeTime(): string {
      return Day.relativeTime(Day.getDate(this.article.createdDate))
    },
  },
  methods: {
    removeArticle() {
      this.$emit('remove')
    },
  },
})
</script>
