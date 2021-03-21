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
  head(): any {
    return {
      title: `kon_karin's photo & blog`,
      meta: [
        { hid: 'og:type', property: 'og:type', content: 'article' },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${process.env.APP_URL}`,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: `/HomeImg.jpg`,
        },
      ],
    }
  },
})
</script>
