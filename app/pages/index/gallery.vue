<template>
  <GalleryView />
</template>

<script lang="ts">
export default defineNuxtComponent({
  name: 'PagesGallery',
  head() {
    return {
      title: 'Gallery',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Photos by konkarin',
        },
        { hid: 'og:type', property: 'og:type', content: 'article' },
        {
          hid: 'og:title',
          property: 'og:title',
          content: "Gallery - konkarin's photos & blog",
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${this.$config.public.APP_URL}gallery`,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: 'Photos by konkarin',
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: 'https://konkarin.photo/HomeImg.jpg',
        },
      ],
    }
  },
})
</script>
