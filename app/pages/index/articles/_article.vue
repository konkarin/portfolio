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

export default Vue.extend({
  async asyncData({ params, payload }): Promise<Data> {
    if (payload) {
      return {
        article: payload,
        markdownText: await convertTextToMarkdown(payload.text),
      }
    } else {
      const collectionPath = `users/${process.env.authorId}/articles`
      const article = (await apis.db.getDocById(
        collectionPath,
        params.article
      )) as Article
      return {
        article,
        markdownText: await convertTextToMarkdown(article.text),
      }
    }
  },
  data(): Data {
    return {
      article: {
        id: '',
        title: '',
        text: '',
        isPublished: false,
        updatedDate: null,
        createdDate: null,
        tags: [],
      },
      markdownText: '',
    }
  },
  head(): { title: string } {
    return {
      title: this.article.title,
    }
  },
})
</script>
