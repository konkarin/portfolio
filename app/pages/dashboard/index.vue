<template>
  <div />
</template>

<script lang="ts">
export default defineComponent({
  name: 'PagesDashboardIndex',
  mounted() {
    if (this.$accessor.user) this.$router.replace({ path: '/dashboard/articles' })
  },
})
</script>
