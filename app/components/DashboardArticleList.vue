<template>
  <section class="dashboard__content">
    <h1 class="dashboard__title">Articles</h1>
    <button class="dashboard__btn btn" @click="addArticle">Add new</button>
    <div class="dashboard__articleList">
      <DashboardArticle
        v-for="(article, index) in articles"
        :key="article.title"
        :article="article"
        @toggle="updatePublishing(index)"
      />
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { v4 as uuidv4 } from 'uuid'
import Day from '@/utils/day'

const day = new Day()

interface Article {
  id: string
  title: string
  isPublished: boolean
  date: string
}

interface Data {
  articles: Array<Article>
}

export default Vue.extend({
  data(): Data {
    return {
      articles: [
        {
          id: 'hoge',
          title: 'hoge',
          isPublished: true,
          date: day.relativeTime('2021-02-18'),
        },
        {
          id: 'fuga',
          title: 'fuga',
          isPublished: true,
          date: day.relativeTime('2021-02-15'),
        },
        {
          id: 'piyo',
          title: 'piyo',
          isPublished: true,
          date: day.relativeTime('2021-02-10'),
        },
      ],
    }
  },
  methods: {
    addArticle() {
      this.$router.push({ path: `/articles/${uuidv4()}` })
    },
    updatePublishing(index: number) {
      this.articles[index].isPublished = !this.articles[index].isPublished
    },
  },
})
</script>
