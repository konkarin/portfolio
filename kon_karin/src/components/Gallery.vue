<template>
  <div class="wrapper">
    <transition-group appear name="fade" tag="div" class="gallery">
      <div
        class="photo-box"
        v-for="(photo, index) in myPhoto"
        :key="photo.fileName"
        :index="index"
        @click="openModal(photo.url)"
        :style="{
          transitionDelay: `${index * 100}ms`
        }"
      >
        <img class="thumb-box" :src="photo.thumburl">
      </div>
    </transition-group>
    <modal v-if="modal" :thumbPath="thumbPath" @close="closeModal"></modal>
  </div>
</template>

<script>
import modal from "./parts/Modal";
import firebase from "../firebase.js"

export default {
  components: { modal },
  data() {
    return {
      myPhoto: [],
      modal: false,
      thumbPath: ""
    };
  },
  methods: {
    openModal(thumbPath) {
      this.modal = true;
      this.thumbPath = thumbPath;
    },
    closeModal() {
      this.modal = false;
    }
  },
  mounted() {
    firebase.firestore().collection("images")
      .get()
      .then(snapshot => {
        const array = [];
        snapshot.forEach(doc => {
          array.push(doc.data());
        });
        this.myPhoto = array;
      });
  }
};
</script>
