<template>
  <div class="modal__mask" @click="$emit('close')">
    <div class="modal__container">
      <div v-show="isLoading" class="loader" />
      <transition name="fade-modal">
        <div v-show="!isLoading">
          <img :src="imgSrc" class="modal__img" @load="loaded" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    imgSrc: {
      type: String,
      default: '',
    },
  },
  emits: ['close'],
  data() {
    return {
      isLoading: true,
    }
  },
  methods: {
    loaded() {
      this.isLoading = !this.isLoading
    },
  },
}
</script>

<style lang="scss" scoped>
.modal__mask {
  display: block;
  position: fixed;
  z-index: 998;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(65, 65, 65, 0.8);
}

.modal__container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 1200px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  align-items: center;
}

.modal__img {
  width: 90%;
  max-height: 100vh;
  margin: 0 auto;
}
</style>
