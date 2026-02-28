<template>
  <main class="wrapper">
    <div class="articleContainer">
      <slot />
      <ArticlesSideMenu />
    </div>
  </main>
</template>

<script setup lang="ts">
</script>

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
