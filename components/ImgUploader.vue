<template>
  <div>
    <h3>ImgUploader</h3>
    <div>
      <label class="input-item">
        <Photo class="btn btn--large" />
        <input type="file" accept=".jpeg, .jpg, .png" @change="setFile(e)" />
      </label>
      <button
        class="flat-button upload-button"
        :disabled="file === null"
        @click="uploadFile()"
      >
        upload
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import firebase from '@/plugins/firebase'
import { getUnixMS } from '@/utils/day'

type Data = {
  isUploading: Boolean
  file: any
}

export default Vue.extend({
  data(): Data {
    return {
      isUploading: false,
      file: null,
    }
  },
  methods: {
    setFile(e: any) {
      this.file = e.target.files[0]

      if (this.file === null) {
        alert('Please select a file')
      }
    },
    // 画像をアップロード
    async uploadFile(): Promise<void> {
      // ローディングを表示
      this.isUploading = true
      // 現在時刻を取得
      const currentDate: number = getUnixMS()

      // 保存するファイル名に現在時刻を指定
      const storageRef = firebase
        .storage()
        .ref()
        .child(`${currentDate}_${this.file.name}`)

      // ストレージに保存
      try {
        await storageRef.put(this.file)

        alert('Uploaded successfully')
        // TODO: 写真一覧を更新
        // this.getImages()
      } catch (e) {
        alert(e)
        this.$router.go({ name: 'MyPage' } as any)
      }
    },
  },
})
</script>
