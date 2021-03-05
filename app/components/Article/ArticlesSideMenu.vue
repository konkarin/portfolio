<template>
  <div class="sideMenu">
    <aside class="sideMenu__content">
      <div class="sideMenu__title">最新記事</div>
      <ArticlesSideMenuItem
        v-for="article in recentArticles"
        :key="article.id"
        :article="article"
      />
    </aside>
    <!-- <div class="sideMenu__content">
      <div class="sideMenu__title">タグ</div>
      <div v-for="tag in tags" :key="tag" class="sideMenu__item">
        <NuxtLink to="">
          {{ tag }}
        </NuxtLink>
      </div>
    </div> -->
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Article } from '@/types/index'

interface Data {
  tags: string[]
}

export default Vue.extend({
  props: {
    recentArticles: {
      type: Array as PropType<Article[]>,
      required: true,
    },
  },
  data(): Data {
    return {
      tags: [],
    }
  },
})
</script>
