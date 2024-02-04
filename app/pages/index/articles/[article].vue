<template>
  <ArticleView :article="article" :html-text="htmlText" />
</template>

<script lang="ts">
import { PropType } from 'vue'
import { convertMarkdownTextToHTML } from '@/utils/markdown'
import { Article } from '@/types/index'

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

export default defineNuxtComponent({
  name: 'PagesArticle',
  props: {
    articles: {
      type: Array as PropType<Article[]>,
      required: true,
    },
  },
  async setup(props) {
    const { APP_URL } = useRuntimeConfig().public
    const { params } = useRoute()

    const article = computed(() => {
      const data = props.articles.find((article) => article.id === params.article)
      return data || emptyAritcle
    })

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
          content: `${APP_URL}/articles/${article.value.id}`,
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
    return {
      article,
      htmlText: await convertMarkdownTextToHTML(article.value.text),
    }
  },
  mounted() {
    // 存在しない記事にアクセスしたらエラー
    const existsArtcile = this.articles.some((article) => this.$route.params.article === article.id)

    // TODO:
    // if (!existsArtcile) this.$nuxt.error({ message: 'ページが見つかりません' })
  },
})
</script>
