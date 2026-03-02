<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

import Loader from './Loader.vue'
import Warning from './svg/Warning.vue'

const { imgSrc = '' } = defineProps<{
  imgSrc?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const isLoading = ref(true)
const isError = ref(false)
const imgRef = ref<HTMLImageElement | null>(null)

const handleLoad = () => {
  isLoading.value = false
  isError.value = false
}

const handleError = () => {
  isLoading.value = false
  isError.value = true
}

onMounted(() => {
  if (imgRef.value?.complete) {
    if (imgRef.value.naturalWidth === 0) {
      handleError()
    } else {
      handleLoad()
    }
  }
})

watch(
  () => imgSrc,
  () => {
    isLoading.value = true
    isError.value = false
  },
)
</script>

<template>
  <div class="modal__mask" @click="emit('close')">
    <div class="modal__container">
      <Loader v-if="isLoading" />
      <div v-if="isError" class="modal__error">
        <Warning class="modal__error-icon" />
        <p class="modal__error-text">Failed to load image.</p>
      </div>
      <div
        :class="{
          'modal__img-wrapper--hidden': isLoading || isError,
        }"
      >
        <img
          ref="imgRef"
          :src="imgSrc"
          class="modal__img"
          @load="handleLoad"
          @error="handleError"
        />
      </div>
    </div>
  </div>
</template>

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

.modal__img-wrapper--hidden {
  visibility: hidden;
  height: 0;
  overflow: hidden;
}

.modal__img {
  width: 90%;
  max-height: 100vh;
  margin: 0 auto;
}

.modal__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
}

.modal__error-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
}

.modal__error-text {
  font-size: 1.2rem;
}
</style>
