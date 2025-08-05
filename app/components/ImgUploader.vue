<template>
  <div class="imgUploader__container">
    <BaseButton @click="openFileDialog"> Add </BaseButton>
    <input
      ref="fileInput"
      type="file"
      accept=".jpeg, .jpg, .png"
      style="display: none"
      @change="setFile"
    />
  </div>
</template>

<script setup lang="ts">
import { getStorage, ref as storageRef, uploadBytes } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'

import { useAuthInject } from '@/composables/useAuth'

const emit = defineEmits<{
  uploaded: []
}>()

const { user } = useAuthInject()

const isUploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const openFileDialog = () => {
  fileInput.value?.click()
}

const setFile = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    uploadFile(target.files[0])
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

    setTimeout(() => {
      emit('uploaded')
    }, 3000)
  } catch (e) {
    console.error(e)
    showToast({
      title: 'Failed to upload',
      type: 'error',
    })
  }
}

useKeyCombination(openFileDialog, { key: 'u', ctrlKey: true })
useKeyCombination(openFileDialog, { key: 'u', metaKey: true })
</script>

<style lang="scss" scoped>
.imgUploader__container {
  display: flex;
  align-items: center;
}
.imgUploader__selectImg {
  input {
    display: none;
  }
}

.selectBtn {
  color: var(--yellow);
  font-size: 2rem;
  &:hover {
    background-color: var(--lightGray);
    border-radius: 50%;
  }
}
</style>
