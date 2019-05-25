<template>
  <transition name="modal">
    <div class="modal-mask" @click="$emit('close')">
      <div class="modal-body">
        <img :src="thumbPath" class="modal-img">
        <!-- <div class="modal-img" :style="{ backgroundImage: `url(${path})` }"></div> -->
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: ["thumbPath"]
};
</script>
