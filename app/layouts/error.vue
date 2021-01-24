<template>
  <div>
    <HeaderNav />
    <div class="wrapper">
      <main>
        <PageTitle>ページが見つかりません</PageTitle>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: 'Not Found',
    }
  },
}
</script>
