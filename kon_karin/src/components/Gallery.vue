<template>
  <div class="wrapper">
    <transition-group appear name="fade" tag="div" class="gallery">
      <div
        class="photo-box"
        v-for="(photo, index) in myPhoto"
        :key="photo.id"
        :index="index"
        @click="openModal(photo.path)"
        :style="{
          transitionDelay: `${index * 100}ms`
        }"
      >
        <img class="thumb-box" :src="photo.thumb">
      </div>
    </transition-group>
    <modal v-if="modal" :path="path" @close="closeModal"></modal>
  </div>
</template>

<script>
import modal from "./parts/Modal";
import myPhoto from "../assets/photo.json";
export default {
  components: { modal },
  data() {
    return {
      myPhoto: myPhoto,
      modal: false,
      path: ""
    };
  },
  methods: {
    openModal(path) {
      this.modal = true;
      this.path = path;
    },
    closeModal() {
      this.modal = false;
    }
  }
};
</script>
