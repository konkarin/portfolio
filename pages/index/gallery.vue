<template>
  <div class="wrapper">
    <h1>Gallery</h1>
    <transition-group appear name="page" tag="div" class="gallery">
      <div
        v-for="(photo, index) in photoList"
        :key="photo.fileName"
        class="photo-box"
        :index="index"
        :style="{
          transitionDelay: `${index * 100}ms`,
        }"
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

<script>
import Vue from 'vue'

import firebase from '@/plugins/firebase'
import PhotoModal from '@/components/PhotoModal'

export default Vue.extend({
  transition: 'page',
  components: { PhotoModal },
  data() {
    return {
      photoList: [],
      showModal: false,
      imgSrc: '',
    }
  },
  mounted() {
    this.getImages()
  },
  methods: {
    async getImages() {
      const snapshot = await firebase.firestore().collection('images').get()

      this.photoList = snapshot.docs.map((doc) => doc.data())
    },
    openModal(url) {
      // ims.srcが404の時、Modalを非表示にしたい
      this.showModal = true
      this.imgSrc = url
    },
    closeModal() {
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
