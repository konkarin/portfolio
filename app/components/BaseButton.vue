<template>
  <button
    :type="type"
    class="button"
    :class="`button--${variant}`"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
}

const { type = 'button', disabled = false, variant = 'primary' } = defineProps<Props>()

const emit = defineEmits<{
  click: [MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (disabled) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>

<style scoped lang="scss">
.button {
  display: inline-flex;
  font-size: 1em;
  font-weight: bold;
  height: 38px;
  line-height: 1.8;
  padding: 0.3em 1em;
  text-decoration: none;
  background-color: var(--yellow);
  color: var(--black);
  border: 0;
  border-radius: 0.5em;
  transition: 0.4s;
  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }
  &:disabled {
    cursor: default;
    opacity: 0.5;
    background: var(--gray);
  }
}

.button--primary {
  background-color: var(--yellow);
  color: var(--black);
}

.button--secondary {
  background-color: var(--gray);
  color: var(--black);
}

.button--danger {
  color: var(--white);
  background-color: var(--danger);
  &:hover {
    opacity: 0.8;
    background-color: var(--danger);
  }
  &:disabled {
    opacity: 0.5;
    background-color: var(--gray);
  }
}
</style>
