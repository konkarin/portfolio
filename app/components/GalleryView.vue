<template>
  <main class="wrapper">
    <PageTitle>Gallery</PageTitle>
    <div v-if="isLoadingImg" class="overlay">
      <div class="loader" />
    </div>
    <ImgContainer :img-list="imgList" />
    <transition name="fade-modal">
      <PhotoModal
        v-if="photoModal.show"
        :img-src="photoModal.url"
        @close="closeModal"
      />
    </transition>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import Apis from '@/api/apis'
import { DocumentData } from '@/types/firebase'

export default Vue.extend({
  head() {
    return {
      title: 'Gallery',
    }
  },
  computed: {
    photoModal() {
      return this.$store.state.photoModal
    },
    imgList() {
      return this.$store.state.imgList as DocumentData[]
    },
    isLoadingImg() {
      return this.$store.state.isLoadingImg as boolean
    },
  },
  async mounted() {
    if (this.imgList.length === 0) {
      const collectionPath = `/users/${process.env.AUTHOR_ID}/images`

      const imgList = await Apis.db.getDocs(collectionPath)
      this.$store.commit('updateImgList', imgList)
    }

    if (typeof this.$route.query.path === 'string') {
      const imageDoc = this.imgList.find((img) => {
        return img.originalFilePath.includes(this.$route.query.path)
      })

      if (imageDoc === undefined) return

      this.$store.commit('switchPhotoModal', {
        url: imageDoc.originalUrl,
        show: true,
      })
    }
  },
  methods: {
    closeModal(): void {
      const payload = {
        url: '',
        show: false,
      }

      this.$store.commit('switchPhotoModal', payload)
    },

    // ims.srcが404の時、Modalを非表示にしたい
    // substituteSrc (index) {
    //   this.imgList[index].thumburl = 'https://pbs.twimg.com/profile_images/1211962587442642944/iOxDr-Ba_400x400.jpg'
    // }
  },
})
</script>
