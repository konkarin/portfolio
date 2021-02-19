<template>
  <div class="dashboard__articleItem">
    <div class="articleItem__container">
      <NuxtLink :to="`/articles/${article.id}`" class="articleItem__title">
        {{ article.title }}
      </NuxtLink>
      <div class="articleItem__actionContainer">
        <div class="articleItem__toggleBtn">
          <ToggleBtn
            :toggle-btn="article.isPublished"
            @toggle="updatePublishing"
          />
          公開する
        </div>
        <NuxtLink
          :to="`/articles/${article.id}`"
          class="articleItem__edit edit"
        >
          <Pencil />
          <span class="edit__tooltip">編集</span>
        </NuxtLink>
      </div>
    </div>
    <div class="articleItem__footer">{{ article.date }}</div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

interface Article {
  title: string
  isPublished: boolean
}

export default Vue.extend({
  props: {
    article: {
      type: Object as PropType<Article>,
      required: true,
    },
  },
  methods: {
    updatePublishing() {
      this.$emit('toggle')
    },
  },
})
</script>
