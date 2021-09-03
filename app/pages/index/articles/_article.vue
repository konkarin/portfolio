<template>
  <ArticleView :article="article" :html-text="htmlText" />
</template>

<script lang="ts">
import Vue from 'vue'
import apis from '@/api/apis'
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
}

export default Vue.extend({
  async asyncData({ params, payload }): Promise<Data> {
    if (payload) {
      return {
        article: payload,
        htmlText: await convertMarkdownTextToHTML(payload.text),
      }
    } else {
      const collectionPath = `users/${process.env.authorId}/articles`
      const article = (await apis.db
        .getDocById(collectionPath, params.article)
        .catch((e) => {
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
  computed: {
    articles() {
      return this.$store.state.articles
    },
  },
  mounted() {
    // 存在しない記事にアクセスしたらエラー
    const existsArtcile = this.articles.some(
      (article) => this.$route.params.article === article.id
    )

    if (!existsArtcile) this.$nuxt.error({ message: 'ページが見つかりません' })
  },
  head(): any {
    return {
      title: this.article.title || '記事がありません。',
      meta: [
        { hid: 'og:type', property: 'og:type', content: 'article' },
        {
          hid: 'og:title',
          property: 'og:title',
          content: `${this.article.title} - kon_karin's photo & blog`,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${process.env.APP_URL}articles/${this.article.id}`,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: 'https://konkarin-photo.web.app/HomeImg.jpg',
        },
        // TODO:
        // {
        //   hid: 'og:description',
        //   property: 'og:description',
        //   content: ``,
        // },
      ],
    }
  },
})
</script>
