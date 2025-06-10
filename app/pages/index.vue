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
    { property: 'og:type', content: 'article' },
    {
      property: 'og:url',
      // content: `${this.$config.public.APP_URL}`,
    },
    {
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
