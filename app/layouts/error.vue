<template>
  <div class="error">
    <PageTitle v-if="error">{{ error.message }}</PageTitle>
    <PageTitle v-else>エラーが発生しました</PageTitle>
    <div>
      <NuxtLink to="/" class="btn error__btn">トップへ戻る</NuxtLink>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'LayoutError',
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
