<template>
  <div class="toggleBtn">
    <label>
      <input type="checkbox" :value="toggleBtn" @change="toggle" />
      <span>
        <slot />
      </span>
    </label>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget
}

export default Vue.extend({
  props: {
    toggleBtn: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
  },
  methods: {
    toggle(e: HTMLInputEvent) {
      this.$emit('toggle', e.target.value)
    },
  },
})
</script>
