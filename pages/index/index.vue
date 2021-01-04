<template>
  <div class="home-image" />
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  transition: 'page',
  head() {
    return {
      title: 'Home',
    }
  },
})
</script>
