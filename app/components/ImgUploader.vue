<template>
  <div>
    <h3>ImgUploader</h3>
    <div>
      <label class="input-item">
        <Photo class="selectBtn selectBtn--large" />
        <input type="file" accept=".jpeg, .jpg, .png" @change="setFile" />
      </label>
      <button class="btn" :disabled="file === null" @click="uploadFile()">
        upload
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import firebase from '@/plugins/firebase'
import { v4 as uuidv4 } from 'uuid'

type User = firebase.User

type Data = {
  isUploading: boolean
  file: any
}

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget
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
    // TODO: 後で調べる
    setFile(e: HTMLInputEvent) {
      this.file = e.target.files[0]

      if (this.file === null) {
        alert('Please select a file')
      }
    },

    // 画像をアップロード
    async uploadFile(): Promise<void> {
      // ローディングを表示
      this.isUploading = true

      const target = `users/${this.user.uid}/${uuidv4()}/original/${
        this.file.name
      }`

      // 保存するファイル名に現在時刻を指定
      const storageRef = firebase.storage().ref().child(target)

      // ストレージに保存
      try {
        await storageRef.put(this.file)

        alert('Uploaded successfully')
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
