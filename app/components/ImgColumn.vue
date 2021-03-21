<template>
  <div class="imgColumn">
    <div
      v-for="img in column"
      :key="img.originalFilePath"
      class="imgBox"
      @click="openModal(img.originalUrl)"
    >
      <img :src="img.thumbUrl" class="img" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { DocumentData } from '@/types/firebase'

export default Vue.extend({
  props: {
    column: {
      type: Array as PropType<DocumentData[]>,
      required: true,
    },
  },
  methods: {
    openModal(url: string) {
      const payload = {
        url,
        show: true,
      }
      this.$store.commit('switchPhotoModal', payload)
    },
  },
})
</script>

<style lang="scss" scoped>
.imgColumn {
  // NOTE: flexだとmarginの相殺が起きない
  display: flex;
  flex-direction: column;
  max-width: 25rem;
}
.imgBox {
  margin: 0.25rem;
  overflow: hidden;
}
.img {
  // NOTE: max-width: 100%だと画像自体の大きさ以上に拡大されない
  width: 100%;
  // NOTE: 画像下の余白を除去
  vertical-align: bottom;
  cursor: pointer;
  transition-duration: 0.3s;
  &:hover {
    transform: scale(1.1);
    transition-duration: 0.3s;
    opacity: 0.6;
  }
}
</style>
