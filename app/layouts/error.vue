<template>
  <div class="error">
    <PageTitle v-if="error">{{ error.message }}</PageTitle>
    <PageTitle v-else>エラーが発生しました</PageTitle>
    <NuxtLink to="/" class="btn error__btn">トップへ戻る</NuxtLink>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  head() {
    return {
      title: 'エラー',
    }
  },
})
</script>
