<template>
  <div class="wrapper">
    <PageTitle>Gallery</PageTitle>
    <div v-if="isLoadingImg" class="overlay">
      <div class="loader" />
    </div>
    <ImgContainer :img-list="imgList" @open="openModal" />
    <transition name="fade-modal">
      <PhotoModal v-if="showModal" :img-src="imgSrc" @close="closeModal" />
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { DocumentData } from '@/types/firebase'

type Data = {
  showModal: boolean
  imgSrc: string
}

export default Vue.extend({
  transition: 'page',
  data(): Data {
    return {
      showModal: false,
      imgSrc: '',
    }
  },
  computed: {
    imgList() {
      return this.$store.state.imgList as DocumentData[]
    },
    isLoadingImg() {
      return this.$store.state.isLoadingImg as boolean
    },
  },
  methods: {
    openModal(url: string): void {
      // ims.srcが404の時、Modalを非表示にしたい
      this.showModal = true
      this.imgSrc = url
    },

    closeModal(): void {
      this.showModal = false
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
