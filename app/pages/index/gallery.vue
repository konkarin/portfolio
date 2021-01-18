<template>
  <div class="wrapper">
    <h1>Gallery</h1>
    <div v-if="isLoadingImg" class="overlay">
      <div class="loader" />
    </div>
    <transition-group v-else appear name="gallery" tag="div" class="gallery">
      <!-- TODO: 最初の数枚をプリロードする -->
      <div
        v-for="(photo, index) in photoList"
        :key="photo.originalFileName"
        class="photo-box"
        :style="{ transitionDelay: `${index * 100 + 100}ms` }"
        @click="openModal(photo.originalUrl)"
      >
        <!-- ims.srcが404の時、Modalを非表示にしたい
        @error="substituteSrc(index)" -->
        <div class="thumb-box">
          <img class="thumb-img" :src="photo.thumbUrl" />
        </div>
      </div>
    </transition-group>
    <transition name="fade-modal">
      <PhotoModal v-if="showModal" :img-src="imgSrc" @close="closeModal" />
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

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
    photoList() {
      return this.$store.state.imgList
    },
    isLoadingImg() {
      return this.$store.state.isLoadingImg
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
    //   this.photoList[index].thumburl = 'https://pbs.twimg.com/profile_images/1211962587442642944/iOxDr-Ba_400x400.jpg'
    // }
  },
  head() {
    return {
      title: 'Gallery',
    }
  },
})
</script>
