<template>
  <DashboardArticleList />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PagesDashboardArticlesIndex',
  head() {
    return {
      title: 'Articles',
    }
  },
})
</script>
