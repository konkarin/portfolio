<template>
  <section class="dashboard__content dashboardArticleList">
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

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { db } from '@/api/apis'
import type { Article } from '@/types/index'

const { $store } = useNuxtApp()
const router = useRouter()

const articles = ref<Article[]>([])
const getArticles = async () => {
  const collectionPath = `users/${$store.state.user?.uid}/articles`

  // TODO: 型引数を渡す方がいい？
  const article = (await db.getOrderDocs(collectionPath, 'createdDate', 'desc')) as Article[]

  return article
}
const setArticles = async () => {
  articles.value = await getArticles()
}
const addArticle = () => {
  router.push({ path: `/dashboard/articles/${uuidv4()}` })
}
const { showToast } = useToast()
const removeArticle = async (docId: string) => {
  const collectionPath = `users/${$store.state.user?.uid}/articles`

  await db.deleteDoc(collectionPath, docId).catch((e) => {
    console.error(e)
    showToast({
      title: '削除に失敗しました',
      type: 'error',
    })
  })
  // TODO: onSnapshotでリアルタイムに反映させたい
  showToast({
    title: '削除しました',
    type: 'success',
  })
}
onMounted(() => {
  setArticles()
})
</script>

<style lang="scss" scoped>
.dashboard__title {
  display: flex;
}

.dashboardArticleList__header {
  display: flex;
  justify-content: flex-end;
}

.dashboardArticleList__body {
  margin-top: 1rem;
}
</style>
