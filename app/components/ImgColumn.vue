<template>
  <div class="imgColumn">
    <div v-for="img in column" :key="img.originalFilePath" class="imgBox">
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
})
</script>

<style lang="scss" scoped>
.imgColumn {
  // NOTE: flexだとmarginの相殺が起きない
  display: flex;
  flex-direction: column;
  max-width: 20rem;
}
.imgBox {
  margin: 0.25rem;
}
.img {
  // NOTE: max-widthを親要素の100%にして画像のはみ出しを抑制
  max-width: 100%;
  // NOTE: 画像下の余白を除去
  vertical-align: bottom;
}
</style>
