<template>
  <div v-if="isAuth">
    <h3>ImgUploader</h3>
    <div>
      <label class="input-item">
        <Photo class="btn btn--large" />
        <input type="file" accept=".jpeg, .jpg, .png" @change="setFile" />
      </label>
      <button
        class="flat-button upload-button"
        :disabled="file === null"
        @click="uploadFile()"
      >
        upload
      </button>
    </div>
    <!-- <div><canvas></canvas></div> -->
    <h3>Gallery Editor</h3>
    <button class="flat-button edit-button" @click="deleteImgs()">
      Delete
    </button>
    <div class="gallery">
      <div
        v-for="(photo, index) in photoList"
        :key="photo.fileName"
        class="photo-box"
      >
        <label>
          <input
            :id="index"
            v-model="selectValueList"
            type="checkbox"
            class="img-checkbox"
            :value="photo.fileName"
          />
          <div class="thumb-box">
            <img class="select-img" :src="photo.thumburl" />
          </div>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import firebase from '@/plugins/firebase'

export default Vue.extend({
  data() {
    return {
      isUploading: false,
      file: null,
      imageFile: null,
      exifInfo: null,
      photoList: [],
      selectValueList: [],
    }
  },
  async created() {
    await this.getImages()
  },
  methods: {
    async getImages() {
      const snapshot = await firebase.firestore().collection('images').get()

      this.photoList = snapshot.docs.map((doc) => doc.data())
    },
    setFile(e) {
      this.file = e.target.files[0]

      if (this.file === null) {
        alert('Please select a file')
      }
    },
    // 画像をアップロード
    async uploadFile() {
      // ローディングを表示
      this.isUploading = true
      // 現在時刻を取得
      const currentDate = new Date().getTime()

      // 保存するファイル名に現在時刻を指定
      const storageRef = firebase
        .storage()
        .ref()
        .child(`${currentDate}_${this.imageFile.name}`)

      // ストレージに保存
      try {
        await storageRef.put(this.imageFile)

        alert('Uploaded successfully')
        // TODO: 写真一覧を更新
        this.getImages()
      } catch (e) {
        alert('Error', e)
        this.$router.go({ name: 'MyPage' })
      }
    },
    // 選択した画像のFirestoreドキュメントを削除する
    deleteImgs() {
      // 画像が選択されてない場合アラートを表示
      if (this.selectValueList.length === 0) {
        alert('Please select images')
        return
      }

      // 確認ダイアログを表示
      if (confirm('Remove your images?')) {
        // 参照先を指定
        const db = firebase.firestore().collection('images')

        for (const item of this.selectValueList) {
          // 選択した画像名と一致するドキュメントを取得
          db.where('fileName', '==', item)
            .get()
            .then((snapshot) => {
              snapshot.forEach((document) => {
                // ドキュメントを削除
                // TODO: クライアントで消すべきじゃないかも
                db.doc(document.id)
                  .delete()
                  .catch((e) => {
                    alert('Error', e)
                  })
              })
            })
        }

        alert('Remove successfully')
        this.$router.go({ name: 'MyPage' })
      }
    },
  },
  head() {
    return {
      title: 'Mypage',
    }
  },
})
</script>
