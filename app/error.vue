<template>
  <div class="error">
    <PageTitle v-if="error">{{ error.message }}</PageTitle>
    <PageTitle v-else>エラーが発生しました</PageTitle>
    <div>
      <button class="btn error__btn" @click="clearError({ redirect: '/' })">トップへ戻る</button>
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

.error__btn {
  margin-top: 1rem;
}
</style>
