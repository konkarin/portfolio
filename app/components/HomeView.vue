<template>
  <main class="wrapper">
    <article class="wrapper-inner">
      <HomeProfile />
      <HomeRss />
      <HomeBlog />
    </article>
  </main>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
h2 {
  margin: 1rem 0;
}
.wrapper-inner {
  max-width: 65ch;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
</style>
