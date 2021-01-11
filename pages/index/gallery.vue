<template>
  <div class="wrapper">
    <h1>Gallery</h1>
    <div v-if="isGettingImg" class="overlay">
      <div class="loader" />
    </div>
    <transition-group v-else appear name="page" tag="div" class="gallery">
      <div
        v-for="(photo, index) in photoList"
        :key="photo.fileName"
        class="photo-box"
        :style="{ transitionDelay: `${index * 100}ms` }"
        @click="openModal(photo.url)"
      >
        <!-- ims.srcが404の時、Modalを非表示にしたい
        @error="substituteSrc(index)" -->
        <div class="thumb-box">
          <img class="thumb-img" :src="photo.thumburl" />
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

import firebase from '@/plugins/firebase'

type Data = {
  photoList: object[]
  showModal: boolean
  imgSrc: string
  isGettingImg: boolean
}

export default Vue.extend({
  transition: 'page',
  data(): Data {
    return {
      photoList: [],
      showModal: false,
      imgSrc: '',
      isGettingImg: false,
    }
  },
  async mounted(): Promise<void> {
    this.isGettingImg = true
    await this.getImages()
    this.isGettingImg = false
  },
  methods: {
    async getImages(): Promise<void> {
      const snapshot = await firebase.firestore().collection('images').get()

      this.photoList = snapshot.docs.map((doc) => doc.data())
    },

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
