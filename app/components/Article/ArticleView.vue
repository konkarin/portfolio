<template>
  <article v-if="article" class="articleView">
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
          no-prefetch
        >
          {{ tag }}
        </NuxtLink>
      </div>
    </header>
    <div class="articleView__content">
      <aside v-if="toc.length > 0" class="articleView__toc">
        <p class="articleView__tocTitle">目次</p>
        <nav>
          <ul>
            <li
              v-for="heading in toc"
              :key="heading.id"
              :class="[`articleView__tocItem--h${heading.level}`]"
            >
              <a :href="`#${heading.id}`">{{ heading.text }}</a>
            </li>
          </ul>
        </nav>
      </aside>
      <MarkdownPreview :html-text="htmlText" />
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

import { useRoute, useRuntimeConfig, useHead, createError, useAsyncData } from '#app'
import MarkdownPreview from '@/components/Article/MarkdownPreview.vue'
import { useArticle } from '@/composables/useArticle'
import Day from '@/utils/day'

const { params, path } = useRoute()
const { article } = await useArticle(params.article as string)

if (!article.value) {
  throw createError({
    statusCode: 404,
    statusMessage: '記事が見つかりませんでした。',
    fatal: true,
  })
}

const { APP_URL } = useRuntimeConfig().public

const articleId = computed(() => article.value?.customId || article.value?.id)

const ogDescription = computed(() => {
  const text = article.value?.text || ''
  if (text === '') {
    return ''
  } else if (text.length > 100) {
    return text.slice(0, 100)
  } else {
    return text
  }
})

const ogImage = computed(() => {
  const img = article.value?.ogpImageUrl
  return img || 'https://konkarin.photo/HomeImg.jpg'
})

onMounted(() => {
  if (article.value?.customId && !path.includes(article.value.customId)) {
    history.pushState(null, '', `/articles/${article.value.customId}`)
  }
})

// markdown変換ライブラリ(remark/rehype/highlight.js, 計~570KB)はサイズが大きいため、
// 動的importでクライアントバンドルから分離する。記事ページはプリレンダされるため、
// 変換はビルド時(サーバー)に実行され、結果はpayloadにキャッシュされる。
// クライアントのhydration時はキャッシュを読むだけでハンドラは再実行されず、
// 変換ライブラリのチャンクもフェッチされない。
const { data: rendered } = await useAsyncData(
  `article-rendered-${article.value?.id}`,
  async () => {
    const { convertMarkdownTextToHTML, getHeadings } = await import('@/utils/markdown')
    const text = article.value?.text || ''
    return {
      // ogp: true は記事内の単独行リンクをOGPカードに変換する。
      // この変換はprerender時(Node)に実行され結果はpayloadにキャッシュされるため、
      // ブラウザ側で外部URLへのfetch(CORS)は発生しない。
      htmlText: await convertMarkdownTextToHTML(text, { ogp: true }),
      toc: getHeadings(text),
    }
  },
)

const htmlText = computed(() => rendered.value?.htmlText || '')
const toc = computed(() => rendered.value?.toc || [])

const releaseDate = computed(() => Day.getDate(article.value?.releaseDate || 0, 'YYYY-MM-DD'))
const updatedDate = computed(() => {
  if (article.value?.updatedDate === undefined || article.value?.updatedDate === 0) return ''
  return Day.getDate(article.value.updatedDate, 'YYYY-MM-DD')
})

useHead({
  title: article.value?.title || '記事がありません。',
  meta: [
    { property: 'og:type', content: 'article' },
    {
      property: 'og:title',
      content: `${article.value?.title} - konkarin.photo`,
    },
    {
      property: 'og:url',
      content: `${APP_URL}/articles/${articleId.value}`,
    },
    {
      property: 'og:image',
      content: ogImage.value,
    },
    {
      property: 'og:description',
      content: ogDescription.value,
    },
  ],
})
</script>

<style scoped lang="scss">
.articleView {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  width: calc(100% - 300px);
  // .sideMenuと合わせる
  max-width: 70ch;
  margin: 0 auto;
}
@media screen and (max-width: $lg) {
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
  &:has(img) > h1 {
    margin-top: 3rem;
  }
}

.articleView__eyeCatch {
  object-fit: cover;
  aspect-ratio: 16 / 9;
}

.articleView__content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.articleView__toc {
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--lightBlack);
  border-radius: 8px;

  ul {
    list-style-type: disc;
    padding-left: 1.2rem;
    margin: 0;
  }

  li {
    // ショートハンドのmarginはmargin-leftも0で上書きしてしまい、
    // 見出しレベル別のインデント(.articleView__tocItem--h*)が効かなくなるため縦方向のみ指定する
    margin-block: 0.5rem;
    line-height: 1.5;

    &::marker {
      color: var(--black);
    }
  }

  a {
    color: var(--darkYellow);
    text-decoration: none;
    font-size: 0.95rem;
    display: inline-block;
    &:hover {
      text-decoration: underline;
      opacity: 0.7;
    }
  }
}

.articleView__tocTitle {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
}

.articleView__tocItem--h1 {
  margin-left: 0;
  list-style-type: disc;
}
.articleView__tocItem--h2 {
  margin-left: 1rem;
  list-style-type: disc;
}
.articleView__tocItem--h3 {
  margin-left: 2rem;
  list-style-type: circle;
}
.articleView__tocItem--h4 {
  margin-left: 3rem;
  list-style-type: square;
}

.articleView__subTitle {
  display: flex;
  flex-direction: row;
  color: var(--gray);
}

.articleTag {
  color: var(--white);
  background: var(--gray);
  padding: 0.1em 0.4em 0.2em;
  border-radius: 3px;

  &--link {
    transition: 0.3s;
    &:hover {
      opacity: 0.6;
    }
  }
}
</style>
