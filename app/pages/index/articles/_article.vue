<template>
  <ArticleView :article="article" :html-text="htmlText" />
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Context } from '@nuxt/types'
import { MetaInfo } from 'vue-meta'
import { db } from '@/api/apis'
import { convertMarkdownTextToHTML } from '@/utils/markdown'
import { Article } from '@/types/index'

interface Data {
  article: Article
  htmlText: string
}

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

export default defineComponent({
  name: 'PagesArticle',
  props: {
    articles: {
      type: Array as PropType<Article[]>,
      required: true,
    },
  },
  async asyncData({ params, payload, $config }: Context): Promise<Data> {
    if (payload) {
      return {
        article: payload,
        htmlText: await convertMarkdownTextToHTML(payload.text),
      }
    } else {
      const collectionPath = `users/${$config.public.AUTHOR_ID}/articles`
      const article = (await db.getDocById(collectionPath, params.article).catch((e) => {
        console.error(e)
        return emptyAritcle
      })) as Article

      const htmlText = await convertMarkdownTextToHTML(article.text)

      return {
        article,
        htmlText,
      }
    }
  },
  data(): Data {
    return {
      article: emptyAritcle,
      htmlText: '',
    }
  },
  head(): MetaInfo {
    return {
      title: this.article.title || '記事がありません。',
      meta: [
        { hid: 'og:type', property: 'og:type', content: 'article' },
        {
          hid: 'og:title',
          property: 'og:title',
          content: `${this.article.title} - konkarin's photos & blog`,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${this.$config.public.APP_URL}articles/${this.article.id}`,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.ogImage,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.ogDescription,
        },
      ],
    }
  },
  computed: {
    ogDescription(): string {
      const text = this.article.text
      if (text === '') {
        return ''
      } else if (text.length > 100) {
        return text.slice(0, 100)
      } else {
        return text
      }
    },
    ogImage(): string {
      const img = this.article.ogpImageUrl

      return img || 'https://konkarin.photo/HomeImg.jpg'
    },
  },
  mounted() {
    // 存在しない記事にアクセスしたらエラー
    const existsArtcile = this.articles.some((article) => this.$route.params.article === article.id)

    if (!existsArtcile) this.$nuxt.error({ message: 'ページが見つかりません' })
  },
})
</script>
