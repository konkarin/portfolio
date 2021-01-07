<template>
  <div v-if="isAuth">
    <ImgUploader />
    <GalleryEditor />
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  computed: {
    isAuth() {
      return this.$store.state.isAuth
    },
  },
  head() {
    return {
      title: 'GalleryEdit',
    }
  },
})
</script>
