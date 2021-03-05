<template>
  <div class="article__container">
    <h1>{{ article.title }}</h1>
    <div class="article__subTitle">{{ updatedDate }} 更新</div>
    <article class="article__content">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <MarkdownPreview v-html="markdownText" />
    </article>
    <div class="article__content articleFooter">
      <div class="articleFooter__container">
        <NuxtLink
          v-for="tag in article.tags"
          :key="tag"
          :to="`/articles?tag=${tag}`"
          class="articleFooter__content articleTag articleTag--link"
        >
          {{ tag }}
        </NuxtLink>
      </div>
      <div class="articleFooter__container">
        <div class="articleFooter__content shareBtn shareBtn--md">
          <Twitter />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Article } from '@/types/index'
import Day from '@/utils/day'

export default Vue.extend({
  props: {
    article: {
      type: Object as PropType<Article>,
      required: true,
    },
    markdownText: {
      type: String,
      required: true,
    },
  },
  computed: {
    updatedDate() {
      return Day.getDate(this.article.updatedDate, 'YYYY-MM-DD')
    },
  },
})
</script>
