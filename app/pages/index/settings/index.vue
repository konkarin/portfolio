<template>
  <ul>
    <li>
      <NuxtLink to="/settings/gallery"> Gallery </NuxtLink>
    </li>
    <li>
      <NuxtLink to="/settings/articles"> Articles </NuxtLink>
    </li>
    <li>
      <NuxtLink to="/settings/post"> Post </NuxtLink>
    </li>
    <li>
      <NuxtLink to="/settings/profile">Profile </NuxtLink>
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  head() {
    return {
      title: 'Settings',
    }
  },
})
</script>
