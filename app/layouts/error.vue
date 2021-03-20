<template>
  <div>
    <HeaderNav />
    <main class="wrapper">
      <PageTitle>エラーが発生しました</PageTitle>
      <div class="error">
        <NuxtLink to="/" class="btn">トップへ戻る</NuxtLink>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: 'Error',
    }
  },
}
</script>
