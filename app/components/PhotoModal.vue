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

<script>
export default {
  props: {
    imgSrc: {
      type: String,
      default: '',
    },
  },
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
