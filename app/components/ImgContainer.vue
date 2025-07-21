<template>
  <section class="imgContainer">
    <div v-for="img in imgList" :key="img.originalUrl" class="photoBox">
      <div class="photoBox__thumbnail" @click="openModal(img.originalUrl)">
        <img class="photoBox__photo" :src="img.thumbUrl" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { DocumentData } from '@firebase/firestore'
import { useModalInject } from '@/composables/useModal'

defineProps<{
  imgList: DocumentData[]
}>()

const { switchPhotoModal } = useModalInject()

const openModal = (url: string) => {
  switchPhotoModal({
    url,
    show: true,
    exif: {},
  })
}
</script>

<style lang="scss" scoped>
.imgContainer {
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr;
  width: 100%;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.photoBox {
  box-sizing: border-box;
  aspect-ratio: 1 / 1;
  width: 100%;
}

.photoBox__thumbnail {
  overflow: hidden;
  width: 100%;
  height: 100%;
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
  object-fit: cover;
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
