<template>
  <main class="photos">
    <ImgContainer :img-list="imgList || []" />
    <transition name="fade-modal">
      <PhotoModal
        v-if="photoModal.show"
        :key="photoModal.url"
        :img-src="photoModal.url"
        @close="closeModal"
      />
    </transition>
  </main>
</template>

<script setup lang="ts">
import type { DocumentData } from 'firebase/firestore'
import { provide, watch } from 'vue'

import {
  useRuntimeConfig,
  useRoute,
  useRouter,
  useAsyncData,
} from '#app'
import { db } from '@/api/apis'
import ImgContainer from '@/components/ImgContainer.vue'
import PhotoModal from '@/components/PhotoModal.vue'
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

const route = useRoute()
const router = useRouter()

const closeModal = (): void => {
  if (route.params.id) {
    router.push('/photos')
  } else {
    switchPhotoModal({
      url: '',
      show: false,
      exif: {},
    })
  }
}

const { data: imgList } = await useAsyncData('photos-images', () =>
  loadImgList(),
)

watch(
  [() => route.params.id, imgList],
  ([id, list]) => {
    if (id && list) {
      const imageDoc = list.find((img) => img.id === id)
      if (imageDoc) {
        switchPhotoModal({
          url: imageDoc.originalUrl,
          show: true,
          exif: {},
        })
      }
    } else if (!id) {
      switchPhotoModal({
        url: '',
        show: false,
        exif: {},
      })
    }
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped>
.photos {
  padding: 0 4rem 2rem;
  display: flex;
  padding-top: 1em;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
}
.photos-enter-active {
  transition: opacity 0.5s ease-in;
}
.photos-enter {
  opacity: 0;
}
</style>
