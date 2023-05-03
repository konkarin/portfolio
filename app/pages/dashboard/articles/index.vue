<template>
  <DashboardArticleList />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'PagesDashboardArticlesIndex',
  head() {
    return {
      title: 'Articles',
    }
  },
})
</script>
