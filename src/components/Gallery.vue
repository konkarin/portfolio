<template>
  <div class="wrapper">
    <h1>Gallery</h1>
    <transition-group
      appear
      name="fade"
      tag="div"
      class="gallery"
    >
      <div
        v-for="(photo, index) in photoList"
        :key="photo.fileName"
        class="photo-box"
        :index="index"
        :style="{
          transitionDelay: `${index * 100}ms`
        }"
        @click="openModal(photo.url)"
      >
        <!-- ims.srcが404の時、Modalを非表示にしたい
        @error="substituteSrc(index)" -->
        <div class="thumb-box">
          <img
            class="thumb-img"
            :src="photo.thumburl"
          >
        </div>
      </div>
    </transition-group>
    <transition name="fade-modal">
      <modal
        v-if="showModal"
        :img-src="imgSrc"
        @close="closeModal"
      />
    </transition>
  </div>
</template>

<script>
import modal from './parts/Modal'
import firebase from '../firebase.js'

export default {
  components: { modal },
  data () {
    return {
      photoList: [],
      showModal: false,
      imgSrc: ''
    }
  },
  mounted () {
    firebase
      .firestore()
      .collection('images')
      .get()
      .then(snapshot => {
        const array = []
        snapshot.forEach(doc => {
          array.push(doc.data())
        })
        this.photoList = array
      })
  },
  methods: {
    openModal (url) {
      // ims.srcが404の時、Modalを非表示にしたい
      this.showModal = true
      this.imgSrc = url
    },
    closeModal () {
      this.showModal = false
    }
    // ims.srcが404の時、Modalを非表示にしたい
    // substituteSrc (index) {
    //   this.photoList[index].thumburl = 'https://pbs.twimg.com/profile_images/1211962587442642944/iOxDr-Ba_400x400.jpg'
    // }
  }
}
</script>
