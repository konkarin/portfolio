<template>
  <div
    class="modal-mask"
    @click="$emit('close')"
  >
    <div class="modal-container">
      <div
        v-show="isLoading"
        class="loader"
      />
      <transition name="fade-modal">
        <div v-show="!isLoading">
          <img
            :src="thumbPath"
            class="modal-img"
            @load="loaded"
          >
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    thumbPath: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isLoading: true
    }
  },
  methods: {
    loaded () {
      this.isLoading = !this.isLoading
    }
  }
}
</script>
