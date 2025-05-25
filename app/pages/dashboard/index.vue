<template>
  <div />
</template>

<script lang="ts">
export default defineComponent({
  name: 'PagesDashboardIndex',
  mounted() {
    if (this.$store.state.user) this.$router.replace({ path: '/dashboard/articles' })
  },
})
</script>
