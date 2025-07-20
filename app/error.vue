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
