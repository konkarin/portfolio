<template>
  <div class="error">
    <PageTitle v-if="error">{{ error.message }}</PageTitle>
    <PageTitle v-else>エラーが発生しました</PageTitle>
    <div class="error__button">
      <BaseButton @click="clearError({ redirect: '/' })">トップへ戻る</BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead, clearError } from '#app'
import BaseButton from '@/components/BaseButton.vue'
import PageTitle from '@/components/PageTitle.vue'
defineProps<{
  error: {
    message?: string
  }
}>()

useHead({
  title: 'エラー',
})
</script>

<style lang="scss" scoped>
.error {
  margin-top: 5rem;
  text-align: center;
}

.error__button {
  margin-top: 1rem;
}
</style>
