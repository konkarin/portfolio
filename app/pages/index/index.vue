<template>
  <main class="home-image" />
</template>

<script lang="ts">
import Vue from 'vue'
import { loadImgList } from '@/api/apis'

export default Vue.extend({
  computed: {
    imgList() {
      return this.$store.state.imgList
    },
  },
  async mounted() {
    if (this.imgList.length === 0) return

    // 画像のプリロード
    await loadImgList(this.imgList)
    // const loadedImgList = await loadImgList(this.imgList)

    // TODO:ロードに失敗した画像を一覧から削除
    // const failedList = loadedImgList.some(
    //   (result) => result.status === 'rejected'
    // )
  },
  head() {
    return {
      title: 'Home',
      meta: [
        { hid: 'og:type', property: 'og:type', content: 'article' },
        {
          hid: 'og:title',
          property: 'og:title',
          content: "kon_karin's photo & blog",
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${process.env.APP_URL}`,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: 'kon_karinの写真とブログです。',
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: `/HomeImg.jpg`,
        },
      ],
    }
  },
})
</script>
