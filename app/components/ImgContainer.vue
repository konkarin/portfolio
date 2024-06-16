<template>
  <section class="imgContainer">
    <div
      v-for="img in imgList"
      :key="img.originalUrl"
      class="photoBox"
      :style="{
        width: `${(img.width * 200) / img.height}px`,
        'flex-grow': `${(img.width * 200) / img.height}`,
      }"
    >
      <div class="photoBox__thumbnail" @click="openModal(img.originalUrl)">
        <img class="photoBox__photo" :src="img.thumbUrl" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { DocumentData } from '@firebase/firestore'

export default defineComponent({
  props: {
    imgList: {
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
.imgContainer {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  &::after {
    content: '';
    flex-grow: 9999;
  }
}

.photoBox {
  box-sizing: border-box;
  width: 25%;
  height: 100%;
}

.photoBox__thumbnail {
  overflow: hidden;
}

.photoBox__checkbox {
  display: none;
  &:checked + div {
    outline: 5px solid var(--yellow);
    outline-offset: -5px;
  }
}

.photoBox__photo {
  cursor: pointer;
  height: 100%;
  display: block;
  // NOTE: max-width: 100%だと画像自体の大きさ以上に拡大されない
  width: 100%;
  transition-duration: 0.3s;
  @media (hover: hover) {
    &:hover {
      transform: scale(1.05);
      opacity: 0.8;
    }
  }
}
</style>
