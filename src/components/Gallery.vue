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
        :thumb-path="thumbPath"
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
      thumbPath: ''
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
    openModal (thumbPath) {
      this.showModal = true
      this.thumbPath = thumbPath
    },
    closeModal () {
      this.showModal = false
    }
  }
}
</script>
