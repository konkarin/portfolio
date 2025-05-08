<template>
  <div class="imgUploader__container">
    <div class="imgUploader__content">
      <label class="imgUploader__selectImg">
        <Photo class="imgUploader__selectBtn selectBtn selectBtn--large" />
        <input type="file" accept=".jpeg, .jpg, .png" @change="setFile" />
      </label>
    </div>
    <div class="imgUploader__content">
      <button class="btn" :disabled="file === null" @click="uploadFile()">upload</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { getStorage, ref as storageRef, uploadBytes } from 'firebase/storage'

const { $store } = useNuxtApp()

const isUploading = ref(false)
const file = ref<File | null>(null)
const user = computed(() => {
  return $store.state.user
})
const { showToast } = useToast()
const setFile = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    file.value = target.files[0]
  } else {
    showToast({
      title: 'Please select a file',
      type: 'error',
    })
  }
}
const uploadFile = async (): Promise<void> => {
  if (user.value === null || file.value === null) return

  // ローディングを表示
  isUploading.value = true

  const target = `users/${user.value.uid}/gallery/${uuidv4()}/original/${file.value.name}`

  // 保存するファイル名に現在時刻を指定
  const storage = storageRef(getStorage(), target)

  // ストレージに保存
  try {
    await uploadBytes(storage, file.value, {
      cacheControl: 'public, max-age=31536000, s-maxage=31536000',
    })

    showToast({
      title: 'Uploaded successfully',
      type: 'success',
    })
    file.value = null

    // TODO: 写真一覧を更新
    // getImages()
  } catch (e) {
    console.error(e)
    showToast({
      title: 'Failed to upload',
      type: 'error',
    })
  }
}
</script>
