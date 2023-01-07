<template>
  <main class="home-image" />
</template>

<script lang="ts">
import Vue from 'vue'
import { loadImgList } from '@/utils/image'

export default Vue.extend({
  name: 'PagesIndex',
  head() {
    return {
      title: 'Home',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: "konkarin's photos & blog.",
        },
        { hid: 'og:type', property: 'og:type', content: 'article' },
        {
          hid: 'og:title',
          property: 'og:title',
          content: "konkarin's photos & blog",
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${process.env.APP_URL}`,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: "konkarin's photos & blog.",
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: 'https://konkarin.photo/HomeImg.jpg',
        },
      ],
    }
  },
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
})
</script>
