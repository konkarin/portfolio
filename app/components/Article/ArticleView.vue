<template>
  <div class="article__container">
    <template v-if="!article.id">記事がありません</template>
    <template v-else>
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
            :to="`/tags/${tag}`"
            class="articleFooter__content articleTag articleTag--link"
          >
            {{ tag }}
          </NuxtLink>
        </div>
        <div class="articleFooter__container">
          <a
            :href="twitterShareUrl"
            class="articleFooter__content shareBtn shareBtn--md"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            <Twitter />
          </a>
        </div>
      </div>
    </template>
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
    updatedDate(): string {
      return Day.getDate(this.article.updatedDate, 'YYYY-MM-DD')
    },
    twitterShareUrl(): string {
      const text = encodeURIComponent(this.article.title)
      return `https://twitter.com/share?url=${process.env.APP_URL}articles/${this.$route.params.article}&text=${text}`
    },
  },
})
</script>
