<template>
  <ArticleView :article="article" :markdown-text="markdownText" />
</template>

<script lang="ts">
import Vue from 'vue'
import apis from '@/api/apis'
import { convertTextToMarkdown } from '@/utils/markdown'
import { Article } from '@/types/index'

interface Data {
  article: Article
  markdownText: string
}

const emptyAritcle = {
  id: '',
  title: '',
  text: '',
  isPublished: false,
  updatedDate: null,
  createdDate: null,
  tags: [],
}

export default Vue.extend({
  async asyncData({ params, payload }): Promise<Data> {
    if (payload) {
      return {
        article: payload,
        markdownText: await convertTextToMarkdown(payload.text),
      }
    } else {
      const collectionPath = `users/${process.env.authorId}/articles`
      const article = (await apis.db
        .getDocById(collectionPath, params.article)
        .catch((e) => {
          console.error(e)
          alert('Failed to get articles.\nPlease retry.')

          return emptyAritcle
        })) as Article

      return {
        article,
        markdownText: await convertTextToMarkdown(article.text),
      }
    }
  },
  data(): Data {
    return {
      article: emptyAritcle,
      markdownText: '',
    }
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
          content: `/HomeImg.jpg`,
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
