<template>
  <section class="dashboard__content dashboardEdit">
    <h1>Profile</h1>
    <div class="dashboardEdit__head">
      <div />
      <div class="dashboardEdit__btn">
        <button class="btn" @click="saveProfile">保存</button>
      </div>
    </div>
    <MarkdownEditor :plain-text="plainText" @input="setPlainText" @save="saveProfile" />
  </section>
</template>

<script setup lang="ts">
import { db } from '@/api/apis'

const { $store } = useNuxtApp()

const plainText = ref('')
const user = computed(() => {
  return $store.state.user
})
const setPlainText = (val: string) => {
  plainText.value = val
}
const getProfile = async () => {
  const data = await db.getDocById('users', user.value?.uid || '')
  if (data === undefined) return ''
  return data.profile as string
}
const { showToast } = useToast()
const saveProfile = async () => {
  const data = {
    profile: plainText.value as string,
  }

  await db
    .addData('users', user.value?.uid || '', data)
    .then(() => {
      showToast({
        title: 'Saved',
        type: 'success',
      })
    })
    .catch((e) => {
      showToast({
        title: 'Failed to update profiles.\nPlease retry.',
        type: 'error',
      })
      console.error(e)
    })
}
onMounted(async () => {
  plainText.value = await getProfile().catch((e) => {
    showToast({
      title: 'Failed to update profiles.\nPlease retry.',
      type: 'error',
    })
    console.error(e)
    return ''
  })
})
</script>
