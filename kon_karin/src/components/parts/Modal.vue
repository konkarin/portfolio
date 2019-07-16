<template>
  <div class="modal-mask" @click="$emit('close')">
    <div class="modal-container">
      <div v-show="isLoading" class="loader">
      </div>
      <transition name="fade-modal">
        <div v-show="!isLoading">
          <img @load="loaded" :src="thumbPath" class="modal-img" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>


export default {
  props: ["thumbPath"],
  data() {
    return {
      isLoading: true
    }
  },
  methods: {
    loaded() {
      this.isLoading = !this.isLoading
    }
  }
};
</script>
