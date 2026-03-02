<script setup lang="ts">
import ArticlesSideMenu from '@/components/Article/ArticlesSideMenu.vue'
</script>

<template>
  <div class="wrapper">
    <div class="articleContainer">
      <slot />
      <ArticlesSideMenu />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.articleContainer {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
}

@media screen and (max-width: $lg) {
  .articleContainer {
    display: block;
  }
}
</style>
