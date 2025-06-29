<template>
  <main class="gallery">
    <ImgContainer :img-list="imgList || []" />
    <transition name="fade-modal">
      <PhotoModal v-if="photoModal.show" :img-src="photoModal.url" @close="closeModal" />
    </transition>
  </main>
</template>

<script setup lang="ts">
import type { DocumentData } from 'firebase/firestore'
import { db } from '@/api/apis'
import { useModal, MODAL_KEY } from '@/composables/useModal'

const loadImgList = async (): Promise<DocumentData[]> => {
  const authorId = useRuntimeConfig().public.AUTHOR_ID
  const collectionPath = `/users/${authorId}/images`
  const result = await db.getOrderDocs(collectionPath, 'order')

  const processedResult = result.map((img) => {
    // @ts-expect-error FIXME: firestoreのtimestamp型をdevalueで解釈できないので一旦消す
    delete img.exif
    return img
  })

  return processedResult
}

const modal = useModal()
provide(MODAL_KEY, modal)
const { photoModal, switchPhotoModal } = modal

const closeModal = (): void => {
  switchPhotoModal({
    url: '',
    show: false,
    exif: {},
  })
}

const route = useRoute()

const { data: imgList } = await useAsyncData('gallery-images', () => loadImgList())

onMounted(async () => {
  if (typeof route.query.path === 'string') {
    const imageDoc = imgList.value?.find((img) => {
      return img.originalFilePath.includes(route.query.path)
    })

    if (imageDoc === undefined) return

    switchPhotoModal({
      url: imageDoc.originalUrl,
      show: true,
      exif: {},
    })
  }
})

useHead({
  title: 'Gallery',
})
</script>

<style lang="scss" scoped>
.gallery {
  padding: 0 4rem 2rem;
  display: flex;
  padding-top: 1em;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
}
.gallery-enter-active {
  transition: opacity 0.5s ease-in;
}
.gallery-enter {
  opacity: 0;
}
</style>
