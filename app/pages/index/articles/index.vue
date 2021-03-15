<template>
  <ArticleList :articles="articles" />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  computed: {
    articles() {
      return this.$store.state.articles
    },
  },
})
</script>
