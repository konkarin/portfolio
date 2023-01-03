<template>
  <div class="imgUploader__container">
    <div class="imgUploader__content">
      <label class="imgUploader__selectImg">
        <Photo class="imgUploader__selectBtn selectBtn selectBtn--large" />
        <input type="file" accept=".jpeg, .jpg, .png" @change="setFile" />
      </label>
    </div>
    <div class="imgUploader__content">
      <button class="btn" :disabled="file === null" @click="uploadFile()">
        upload
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { getStorage, ref, uploadBytes } from 'firebase/storage'
import { User } from '@firebase/auth'

type Data = {
  isUploading: boolean
  file: File | null
}

export default Vue.extend({
  data(): Data {
    return {
      isUploading: false,
      file: null,
    }
  },
  computed: {
    user(): User {
      return this.$store.state.user
    },
  },
  methods: {
    setFile(e: HTMLInputEvent<HTMLInputElement>) {
      if (e.target.files && e.target.files[0]) {
        this.file = e.target.files[0]
      } else {
        alert('Please select a file')
      }
    },

    // 画像をアップロード
    async uploadFile(): Promise<void> {
      if (this.file === null) return

      // ローディングを表示
      this.isUploading = true

      const target = `users/${this.user.uid}/${uuidv4()}/original/${
        this.file.name
      }`

      // 保存するファイル名に現在時刻を指定
      const storageRef = ref(getStorage(), target)

      // ストレージに保存
      try {
        await uploadBytes(storageRef, this.file, {
          cacheControl: 'public, max-age=31536000, s-maxage=31536000',
        })

        alert('Uploaded successfully')
        this.file = null

        // TODO: 写真一覧を更新
        // this.getImages()
      } catch (e) {
        alert(e)
        this.$router.go({ name: 'Settings' } as any)
      }
    },
  },
})
</script>
