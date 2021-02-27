<template>
  <main class="wrapper">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <MarkdownPreview v-html="article.text" />
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
}

interface Data {
  article: Article
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
      },
    }
  },
  async mounted() {
    const articleId = this.$route.params.article
    const collectionPath = `users/${process.env.authorId}/articles`

    const data = await apis.db.getDocById(collectionPath, articleId)

    this.article.text = await convertTextToMarkdown(data.text)
  },
})
</script>
