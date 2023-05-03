<template>
  <div class="toggleBtn">
    <label class="toggleBtn__label">
      <input
        type="checkbox"
        :checked="toggleBtn"
        class="toggleBtn__input"
        @change="toggle"
      />
      <span class="toggleBtn__slider" />
    </label>
    <slot />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  props: {
    toggleBtn: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
  },
  methods: {
    toggle() {
      this.$emit('toggle')
    },
  },
})
</script>

<style lang="scss" scoped>
// https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_switch
.toggleBtn {
  display: flex;
  align-items: center;

  &__label {
    position: relative;
    display: inline-block;
    width: 46px;
    height: 27px;
    margin: 0 0.5em;
  }

  &__slider {
    position: absolute;
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

  &__input {
    display: none;
    &:checked + .toggleBtn__slider {
      background-color: #4bd865;
      &::before {
        transform: translateX(18px);
      }
    }
  }
}
</style>
