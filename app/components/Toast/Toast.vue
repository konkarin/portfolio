<script setup lang="ts">
import Check from '@/components/svg/Check.vue'
import Info from '@/components/svg/Info.vue'
import Warning from '@/components/svg/Warning.vue'
import { type ToastType } from '@/composables/useToast'

interface Props {
  id: string
  title: string
  description?: string
  duration?: number
  type?: ToastType
}

const { id, title, description, duration, type } = defineProps<Props>()
const emit = defineEmits<{ close: [id: string] }>()

const toastVisible = ref(true)
const isLeaving = ref(false)
let timeoutId: number | null = null

const closeToast = () => {
  isLeaving.value = true
  // トーストが消えるアニメーションを待つ
  setTimeout(() => {
    toastVisible.value = false
    emit('close', id)
  }, 300) // CSSのトランジション時間と合わせる
}

const setupTimeout = () => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  if (toastVisible.value) {
    timeoutId = window.setTimeout(() => {
      closeToast()
    }, duration)
  }
}

onMounted(() => {
  setupTimeout()
})

onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})

const toastClass = computed(() => {
  return ['toast', `toast--${type}`, { 'toast--leaving': isLeaving.value }]
})
const toastIconClass = computed(() => {
  return [`toast-icon--${type}`]
})

const getIconByType = () => {
  switch (type) {
    case 'success':
      return Check
    case 'error':
      return Warning
    default:
      return Info
  }
}
</script>

<template>
  <div v-if="toastVisible" :class="toastClass">
    <span class="toast-icon" :class="toastIconClass">
      <component :is="getIconByType()" />
    </span>
    <div class="toast-content">
      <h3 class="toast-title">{{ title }}</h3>
      <div v-if="description" class="toast-description">
        {{ description }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.toast {
  position: relative;
  display: flex;
  flex-direction: row;
  gap: 8px;
  width: 350px;
  background-color: var(--white);
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slide-in 0.3s ease-out;
  opacity: 1;
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.toast--leaving {
  opacity: 0;
  transform: translateX(30px);
}

.toast--success {
  background-color: #10b981;
  color: var(--white);
}

.toast--error {
  background-color: #ef4444;
  color: var(--white);
}

.toast-content {
  display: flex;
  flex-direction: column;
}

.toast-icon {
  font-size: 1rem;
  font-weight: bold;
  color: inherit;
  display: flex;
}

.toast-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.toast-description {
  font-size: 0.875rem;
  opacity: 0.9;
}

@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
