<template>
  <label class="toggleBtn">
    <input type="checkbox" :checked="value" class="toggleBtn__input" @change="toggle" />
    <span class="toggleBtn__slider" />
    <b>
      <slot />
    </b>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  value: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()

function toggle() {
  emit('toggle')
}
</script>

<style lang="scss" scoped>
// https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_switch

.toggleBtn {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
}

.toggleBtn__input {
  display: none;
  &:checked + .toggleBtn__slider {
    background-color: #4bd865;
    &::before {
      transform: translateX(18px);
    }
  }
}

.toggleBtn__slider {
  width: 46px;
  height: 27px;
  position: relative;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 27px;
  background-color: #ccc;
  transition: 0.3s;
  &::before {
    position: absolute;
    content: '';
    height: 21px;
    width: 21px;
    left: 3px;
    bottom: 3px;
    border-radius: 50%;
    background-color: white;
    transition: 0.3s;
  }
}
</style>
