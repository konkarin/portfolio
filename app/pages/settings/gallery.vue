<template>
  <section class="dashboard__content">
    <ImgUploader />
    <GalleryEditor />
  </section>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  head() {
    return {
      title: 'GalleryEdit',
    }
  },
})
</script>
