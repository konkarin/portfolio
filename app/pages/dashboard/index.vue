<template>
  <div />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'PagesDashboardIndex',
  mounted() {
    if (this.$store.state.user) this.$router.replace({ path: '/dashboard/profile' })
  },
})
</script>
