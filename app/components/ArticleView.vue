<template>
  <main class="wrapper">
    <div class="article">
      <div class="article__container">
        <h1>{{ article.title }}</h1>
        <div class="article__content">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <MarkdownPreview v-html="markdownText" />
        </div>
      </div>
      <ArticlesSideMenu />
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import apis from '@/api/apis'
import { convertTextToMarkdown } from '@/utils/markdown'
import { Timestamp } from '@/types/firebase'

export interface Article {
  id: string
  title: string
  text: string
  isPublished: boolean
  updatedDate: Timestamp
  createdDate: Timestamp
}

interface Data {
  article: Article
  markdownText: string
}

export default Vue.extend({
  data(): Data {
    return {
      article: {
        id: '',
        title: '',
        text: '',
        isPublished: false,
        updatedDate: null,
        createdDate: null,
      },
      markdownText: '',
    }
  },
  async mounted() {
    const articleId = this.$route.params.article
    const collectionPath = `users/${process.env.authorId}/articles`

    const data = await apis.db.getDocById(collectionPath, articleId)

    this.markdownText = await convertTextToMarkdown(data.text)
    this.article = data as Article
  },
  head(): { title: string } {
    return {
      title: this.article.title,
    }
  },
})
</script>
