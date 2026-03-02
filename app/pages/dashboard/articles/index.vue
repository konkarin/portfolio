<template>
  <DashboardArticleList />
</template>

<script setup lang="ts">
import { useHead } from '#app'
import DashboardArticleList from '@/components/Dashboard/DashboardArticleList.vue'
useHead({
  title: 'Articles',
})
</script>
