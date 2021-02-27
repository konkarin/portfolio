<template>
  <section class="dashboard__content">
    <h1 class="dashboard__title">Articles</h1>
    <button class="dashboard__btn btn" @click="addArticle">Add new</button>
    <div class="dashboard__articleList">
      <DashboardArticle
        v-for="article in articles"
        :key="article.id"
        :article="article"
      />
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { v4 as uuidv4 } from 'uuid'
import apis from '@/api/apis'
import { Article } from '@/components/DashboardArticle.vue'

interface Data {
  articles: Array<Article>
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
      const collectionPath = `users/${this.$store.state.user.uid}/articles`

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

    addArticle() {
      this.$router.push({ path: `/dashboard/articles/${uuidv4()}` })
    },
  },
})
</script>
