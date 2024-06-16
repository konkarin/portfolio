<template>
  <section class="dashboard__content dashboardArticleList">
    <h1 class="dashboard__title">Articles</h1>
    <div class="dashboardArticleList__header">
      <button class="btn" @click="addArticle">Add new</button>
    </div>
    <div class="dashboardArticleList__body">
      <DashboardArticle
        v-for="article in articles"
        :key="article.id"
        :article="article"
        @remove="removeArticle(article.id)"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { db } from '@/api/apis'
import type { Article } from '@/types/index'

interface Data {
  articles: Array<Article>
}

export default defineComponent({
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
      const collectionPath = `users/${this.$store.state.user?.uid}/articles`

      // TODO: 型引数を渡す方がいい？
      const article = (await db.getOrderDocs(collectionPath, 'createdDate', 'desc')) as Article[]

      return article
    },

    async setArticles() {
      this.articles = await this.getArticles()
    },

    addArticle() {
      this.$router.push({ path: `/dashboard/articles/${uuidv4()}` })
    },

    async removeArticle(docId: string) {
      const collectionPath = `users/${this.$store.state.user?.uid}/articles`

      await db.deleteDoc(collectionPath, docId).catch((e) => {
        console.error(e)
        alert('削除に失敗しました')
      })
      // TODO: onSnapshotでリアルタイムに反映させたい
      alert('削除しました')
    },
  },
})
</script>
