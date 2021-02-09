<template>
  <div class="wrapper">
    <PageTitle>Gallery</PageTitle>
    <div v-if="isLoadingImg" class="overlay">
      <div class="loader" />
    </div>
    <ImgContainer :img-list="imgList" />
    <transition name="fade-modal">
      <PhotoModal
        v-if="photoModal.show"
        :img-src="photoModal.url"
        @close="closeModal"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { DocumentData } from '@/types/firebase'

export default Vue.extend({
  transition: 'page',
  computed: {
    photoModal() {
      return this.$store.state.photoModal
    },
    imgList() {
      return this.$store.state.imgList as DocumentData[]
    },
    isLoadingImg() {
      return this.$store.state.isLoadingImg as boolean
    },
  },
  methods: {
    closeModal(): void {
      const payload = {
        url: '',
        show: false,
      }

      this.$store.commit('switchPhotoModal', payload)
    },

    // ims.srcが404の時、Modalを非表示にしたい
    // substituteSrc (index) {
    //   this.imgList[index].thumburl = 'https://pbs.twimg.com/profile_images/1211962587442642944/iOxDr-Ba_400x400.jpg'
    // }
  },
  head() {
    return {
      title: 'Gallery',
    }
  },
})
</script>
