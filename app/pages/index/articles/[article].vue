<template>
  <ArticleView :article="article" :html-text="htmlText" />
</template>

<script setup lang="ts">
import { convertMarkdownTextToHTML } from '@/utils/markdown'
import type { Article } from '@/types/index'

const emptyAritcle: Article = {
  id: '',
  title: '',
  text: '',
  isPublished: false,
  updatedDate: 0,
  releaseDate: 0,
  createdDate: 0,
  tags: [],
  ogpImageUrl: '',
}

const props = defineProps<{
  articles: Article[]
}>()

const { APP_URL } = useRuntimeConfig().public
const { params, path } = useRoute()

const existsArtcile = props.articles.some(
  (article) => params.article === article.id || params.article === article.customId,
)
if (!existsArtcile) {
  throw createError({
    statusCode: 404,
    statusMessage: '記事が見つかりませんでした。',
    fatal: true,
  })
}

const article = computed(() => {
  const data = props.articles.find(
    (article) => params.article === article.id || params.article === article.customId,
  )
  return data || emptyAritcle
})

const articleId = computed(() => article.value.customId || article.value.id)

const ogDescription = computed(() => {
  const text = article.value.text
  if (text === '') {
    return ''
  } else if (text.length > 100) {
    return text.slice(0, 100)
  } else {
    return text
  }
})

const ogImage = computed(() => {
  const img = article.value.ogpImageUrl

  return img || 'https://konkarin.photo/HomeImg.jpg'
})

useHead({
  title: article.value.title || '記事がありません。',
  meta: [
    { hid: 'og:type', property: 'og:type', content: 'article' },
    {
      hid: 'og:title',
      property: 'og:title',
      content: `${article.value.title} - konkarin's photos & blog`,
    },
    {
      hid: 'og:url',
      property: 'og:url',
      content: `${APP_URL}/articles/${articleId.value}`,
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: ogImage.value,
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content: ogDescription.value,
    },
  ],
})

onMounted(() => {
  if (article.value.customId && !path.includes(article.value.customId)) {
    history.pushState(null, '', `/articles/${article.value.customId}`)
  }
})

const htmlText = await convertMarkdownTextToHTML(article.value.text)
</script>
