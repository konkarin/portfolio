<template>
  <div class="article__container">
    <h1>{{ article.title }}</h1>
    <div class="article__subTitle subTitle">
      <div class="subTitle__item">{{ releaseDate }} 公開</div>
      <div v-if="updatedDate" class="subTitle__item">
        {{ updatedDate }} 更新
      </div>
    </div>
    <article class="article__content">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <MarkdownPreview v-html="htmlText" />
    </article>
    <div class="article__content articleFooter">
      <div class="articleFooter__container">
        <NuxtLink
          v-for="tag in article.tags"
          :key="tag"
          :to="`/tags/${tag}`"
          class="articleFooter__content articleTag articleTag--link"
          data-test="articleTag"
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
          data-test="twitterShare"
        >
          <Twitter />
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Article } from '@/types/index'
import Day from '@/utils/day'
import MarkdownPreview from '@/components/MarkdownPreview.vue'
import Twitter from '@/components/svg/Twitter.vue'

export default Vue.extend({
  components: {
    MarkdownPreview,
    Twitter,
  },
  props: {
    article: {
      type: Object as PropType<Article>,
      required: true,
    },
    htmlText: {
      type: String,
      required: true,
    },
  },
  computed: {
    releaseDate(): string {
      return Day.getDate(this.article.releaseDate, 'YYYY-MM-DD')
    },
    updatedDate(): string {
      if (
        this.article.updatedDate === undefined ||
        this.article.updatedDate === 0
      )
        return ''
      return Day.getDate(this.article.updatedDate, 'YYYY-MM-DD')
    },
    twitterShareUrl(): string {
      const text = encodeURIComponent(this.article.title)
      return `https://twitter.com/share?url=${process.env.APP_URL}articles/${this.$route.params.article}&text=${text}`
    },
  },
})
</script>
