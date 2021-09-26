<template>
  <section class="dashboard__content">
    <h1 class="dashboard__title">Articles</h1>
    <button class="dashboard__btn btn" @click="addArticle">Add new</button>
    <div class="dashboard__item">
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
import Vue from 'vue'
import { v4 as uuidv4 } from 'uuid'
import Apis from '@/api/apis'
import { Article } from '@/types/index'

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

      // TODO: 型引数を渡す方がいい？
      const article = (await Apis.db.getOrderDocs(
        collectionPath,
        'createdDate',
        'desc'
      )) as Article[]

      return article
    },

    async setArticles() {
      this.articles = await this.getArticles()
    },

    addArticle() {
      this.$router.push({ path: `/dashboard/articles/${uuidv4()}` })
    },

    async removeArticle(docId: string) {
      const collectionPath = `users/${this.$store.state.user.uid}/articles`

      await Apis.db.deleteDoc(collectionPath, docId).catch((e) => {
        console.error(e)
        alert('削除に失敗しました')
      })
      // TODO: onSnapshotでリアルタイムに反映させたい
      alert('削除しました')
    },
  },
})
</script>
