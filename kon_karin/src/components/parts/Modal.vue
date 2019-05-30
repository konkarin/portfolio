<template>
  <div class="modal-mask" @click="$emit('close')">
    <div class="modal-container">
      <img :src="thumbPath" class="modal-img">
      <!-- <div class="modal-img" :style="{ backgroundImage: `url(${path})` }"></div> -->
    </div>
  </div>
</template>

<script>
export default {
  props: ["thumbPath"]
};
</script>
