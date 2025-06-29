<script setup lang="ts">
import type { Toast } from '@/composables/useToast'
import { ToastKey } from '@/composables/useToast'

const toasts = ref<Toast[]>([])
const addToast = (toast: Toast) => {
  toasts.value.push(toast)
}
provide(ToastKey, addToast)

const closeToast = (id: string) => {
  const index = toasts.value.findIndex((toast) => toast.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}
</script>

<template>
  <div>
    <slot></slot>

    <div class="toast-container">
      <Toast
        v-for="toast in toasts"
        :key="toast.id"
        :id="toast.id"
        :title="toast.title"
        :description="toast.description"
        :duration="toast.duration"
        :type="toast.type"
        @close="closeToast"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-end;
  z-index: 9999;
  max-height: 100vh;
  overflow-y: auto;
  padding: 10px;
  overflow: hidden;
  gap: 10px;
}
</style>
