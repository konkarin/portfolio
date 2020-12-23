<template>
  <div>
    <HeaderNav />
    <NuxtChild />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import HeaderNav from '@/components/HeaderNav.vue'

export default Vue.extend({
  components: {
    HeaderNav,
  },
})
</script>
