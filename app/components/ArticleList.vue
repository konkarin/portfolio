<template>
  <main class="wrapper">
    <PageTitle>Articles</PageTitle>
    <div class="articleList">
      <div class="articleList__inner">
        <ArticleItem
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
import { Article } from '@/types/index'

interface Data {
  articles: Article[]
}

export default Vue.extend({
  data(): Data {
    return {
      articles: [],
    }
  },
  computed: {
    recentArticles(): Article[] {
      return this.articles.slice(0, 2)
    },
  },
  mounted() {
    this.articles = this.$store.state.articles
  },
  methods: {
    async getArticles() {
      const collectionPath = `users/${process.env.authorId}/articles`

      const articles = await apis.db.getOrderDocs(
        collectionPath,
        'updatedDate',
        'desc',
        10
      )

      return articles
    },

    async setArticles() {
      const articles = await this.getArticles()
      this.articles = articles as Article[]
    },
  },
})
</script>
