<template>
  <article class="articleView">
    <header class="articleView__header">
      <img v-if="article.ogpImageUrl" class="articleView__eyeCatch" :src="article.ogpImageUrl" />
      <h1>{{ article.title }}</h1>
      <div class="articleView__subTitle">
        <div>{{ releaseDate }} 公開</div>
        <div v-if="updatedDate">（{{ updatedDate }} 更新）</div>
      </div>
      <div class="articleView__tag">
        <NuxtLink
          v-for="tag in article.tags"
          :key="tag"
          :to="`/tags/${tag}`"
          class="articleTag articleTag--link"
          data-test="articleTag"
        >
          {{ tag }}
        </NuxtLink>
      </div>
    </header>
    <div class="articleView__content">
      <MarkdownPreview :html-text="htmlText" />
    </div>
    <footer class="articleView__footer">
      <a
        :href="twitterShareUrl"
        class="articleView__footerLink shareBtn shareBtn--md"
        target="_blank"
        rel="nofollow noopener noreferrer"
        data-test="twitterShare"
      >
        <Twitter />
      </a>
    </footer>
  </article>
</template>

<script lang="ts">
import type { Article } from '@/types/index'
import Day from '@/utils/day'
import MarkdownPreview from '@/components/MarkdownPreview.vue'
import Twitter from '@/components/svg/Twitter.vue'

export default defineComponent({
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
      if (this.article.updatedDate === undefined || this.article.updatedDate === 0) return ''
      return Day.getDate(this.article.updatedDate, 'YYYY-MM-DD')
    },
    articleId() {
      return this.article.customId || this.article.id
    },
    twitterShareUrl(): string {
      const text = encodeURIComponent(this.article.title)
      return `https://twitter.com/share?url=${this.$config.public.APP_URL}/articles/${this.articleId}&text=${text}`
    },
  },
})
</script>

<style scoped lang="scss">
.articleView {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  width: calc(100% - 300px);
}
@media screen and (max-width: $md) {
  .articleView {
    width: 100%;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--lightBlack);
  }
}

.articleView__header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.articleView__eyeCatch {
  object-fit: cover;
  aspect-ratio: 16 / 9;
}

.articleView__subTitle {
  display: flex;
  flex-direction: row;
  color: var(--gray);
}

.articleView__footer {
  display: flex;
}
.articleView__footerLink {
  display: inline-flex;
}
</style>
