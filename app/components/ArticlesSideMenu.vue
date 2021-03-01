<template>
  <aside class="sideMenu">
    <div class="sideMenu__content">
      <div class="sideMenu__title">最新記事</div>
      <ArticleSideMenuItem
        v-for="article in recentArticles"
        :key="article.id"
        :article="article"
      />
    </div>
    <!-- <div class="sideMenu__content">
      <div class="sideMenu__title">タグ</div>
      <div v-for="tag in tags" :key="tag" class="sideMenu__item">
        <NuxtLink to="">
          {{ tag }}
        </NuxtLink>
      </div>
    </div> -->
  </aside>
</template>

<script lang="ts">
import Vue from 'vue'
import apis from '@/api/apis'
import { Article } from '@/components/ArticleItem.vue'

interface Data {
  recentArticles: Article[]
  tags: string[]
}

export default Vue.extend({
  data(): Data {
    return {
      recentArticles: [],
      tags: [],
    }
  },
  mounted() {
    this.setRecentArticles()
  },
  methods: {
    async getRecentArticles() {
      const collectionPath = `users/${process.env.authorId}/articles`

      const article = await apis.db.getOrderDocs(
        collectionPath,
        'updatedDate',
        'desc',
        3
      )

      return article
    },

    async setRecentArticles() {
      const articles = await this.getRecentArticles()
      this.recentArticles = articles as Article[]
    },
  },
})
</script>
