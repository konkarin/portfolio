<template>
  <main class="gallery">
    <div v-if="isLoadingImg" class="overlay">
      <Loader />
    </div>
    <ImgContainer :img-list="imgList" />
    <transition name="fade-modal">
      <PhotoModal v-if="photoModal.show" :img-src="photoModal.url" @close="closeModal" />
    </transition>
  </main>
</template>

<script setup lang="ts">
import { db } from '@/api/apis'

const { $store } = useNuxtApp()
const photoModal = computed(() => {
  return $store.state.photoModal
})
const imgList = computed(() => {
  return $store.state.imgList
})
const isLoadingImg = computed(() => {
  return $store.state.isLoadingImg
})
const closeModal = (): void => {
  const payload = {
    url: '',
    show: false,
  }

  $store.commit('switchPhotoModal', payload)
}

const route = useRoute()
onMounted(async () => {
  if (imgList.value.length === 0) {
    const collectionPath = `/users/${useRuntimeConfig().public.AUTHOR_ID}/images`

    const imgList = await db.getOrderDocs(collectionPath, 'order')
    $store.commit('updateImgList', imgList)
  }

  if (typeof route.query.path === 'string') {
    const imageDoc = imgList.value.find((img) => {
      return img.originalFilePath.includes(route.query.path)
    })

    if (imageDoc === undefined) return

    $store.commit('switchPhotoModal', {
      url: imageDoc.originalUrl,
      show: true,
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
