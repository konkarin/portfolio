<template>
  <div />
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  mounted() {
    if (this.$store.state.user)
      this.$router.replace({ path: '/dashboard/profile' })
  },
})
</script>
