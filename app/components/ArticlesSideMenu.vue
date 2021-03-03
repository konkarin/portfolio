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
