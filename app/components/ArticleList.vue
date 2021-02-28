<template>
  <main class="wrapper">
    <PageTitle>Articles</PageTitle>
    <div class="articleListWrapper">
      <div class="articleList">
        <Article
          v-for="article in articles"
          :key="article.id"
          :article="article"
        />
      </div>
      <ArticlesSideMenu />
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import apis from '@/api/apis'
import { Article } from '@/components/Article.vue'

interface Data {
  articles: Article[]
}

export default Vue.extend({
  data(): Data {
    return {
      articles: [],
    }
  },
  mounted() {
    this.setArticles()
  },
  methods: {
    async getArticles() {
      const collectionPath = `users/${process.env.authorId}/articles`

      const article = await apis.db.getOrderDocs(
        collectionPath,
        'updatedDate',
        'desc'
      )

      return article
    },

    async setArticles() {
      const articles = await this.getArticles()
      this.articles = articles as Article[]
    },
  },
})
</script>
