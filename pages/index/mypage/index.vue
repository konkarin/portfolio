<template>
  <div v-if="isAuth">
    <h3>Index</h3>
    <div>
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
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  head() {
    return {
      title: 'Mypage',
    }
  },
})
</script>
