<template>
  <div>
    <HeaderNav />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: `konkarin's photos & blog`,
  meta: [
    { hid: 'og:type', property: 'og:type', content: 'article' },
    {
      hid: 'og:url',
      property: 'og:url',
      // content: `${this.$config.public.APP_URL}`,
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: 'https://konkarin.photo/HomeImg.jpg',
    },
  ],
})

const keyList = ref<string>('')
function handleKeydown(event: KeyboardEvent) {
  console.log(event.key)
  keyList.value += event.key

  if (keyList.value.includes('/dashboard')) {
    useRouter().push('/dashboard/articles')
  }
}
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>
