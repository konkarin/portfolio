<template>
  <ul>
    <li>
      <NuxtLink to="/mypage/galleryEdit"> Gallery Edit </NuxtLink>
    </li>
    <li>
      <NuxtLink to="/mypage/articleEdit"> Article Edit </NuxtLink>
    </li>
    <li>
      <NuxtLink to="/mypage/articles"> Articles </NuxtLink>
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  head() {
    return {
      title: 'Mypage',
    }
  },
})
</script>
