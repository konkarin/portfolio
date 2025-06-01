<template>
  <div class="imgUploader__container">
    <div class="imgUploader__content">
      <label class="imgUploader__selectImg">
        <Photo class="imgUploader__selectBtn selectBtn selectBtn--large" />
        <input type="file" accept=".jpeg, .jpg, .png" @change="setFile" />
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { getStorage, ref as storageRef, uploadBytes } from 'firebase/storage'

const { $store } = useNuxtApp()

const isUploading = ref(false)
const fileRef = ref<File | null>(null)
const user = computed(() => {
  return $store.state.user
})
const setFile = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    fileRef.value = target.files[0]
    uploadFile(fileRef.value)
  }
}

const { showToast } = useToast()
const uploadFile = async (file: File): Promise<void> => {
  if (user.value === null) return

  // ローディングを表示
  isUploading.value = true

  const target = `users/${user.value.uid}/gallery/${uuidv4()}/original/${file.name}`

  // 保存するファイル名に現在時刻を指定
  const storage = storageRef(getStorage(), target)

  // ストレージに保存
  try {
    await uploadBytes(storage, file, {
      cacheControl: 'public, max-age=31536000, s-maxage=31536000',
    })

    showToast({
      title: 'Uploaded successfully',
      type: 'success',
    })
    fileRef.value = null

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
