<template>
  <DashboardPhotos />
</template>

<script setup lang="ts">
import { useHead } from '#app'
import DashboardPhotos from '@/components/Dashboard/DashboardPhotos.vue'
useHead({
  title: 'PhotosEdit',
})
</script>
