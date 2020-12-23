<template>
  <div class="wrapper">
    <div v-show="isUploading || isLoading" class="overlay">
      <div class="loader" />
    </div>
    <h1>MyPage</h1>
    <div v-if="!isLoading" class="auth-area">
      <div v-if="isAuth">
        <button class="flat-button sign-out" @click="signOut">Sign out</button>
      </div>
      <div v-else>
        <button class="flat-button sign-in" @click="signIn">Sign in</button>
      </div>
    </div>

    <div v-if="isAuth">
      <h3>ImgUploader</h3>
      <div>
        <label class="input-item">
          <font-awesome-icon
            :icon="['fas', 'image']"
            class="fa-3x fa-fw fa-color fa-button"
          />
          <input type="file" accept=".jpeg, .jpg, .png" @change="resizeImg" />
        </label>
        <button
          class="upload-button"
          :disabled="file === null"
          @click="uploadFile()"
        >
          <font-awesome-icon
            :icon="['fas', 'upload']"
            class="fa-3x fa-fw fa-button"
            :class="{ 'fa-color': file !== null }"
          />
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
  </div>
</template>

<script>
import Vue from 'vue'
import firebase from '@/plugins/firebase'
import loadImage from 'blueimp-load-image'

export default Vue.extend({
  data() {
    return {
      isAuth: false,
      isLoading: true,
      isUploading: false,
      file: null,
      imageFile: null,
      exifInfo: null,
      photoList: [],
      selectValueList: [],
    }
  },
  watch: {
    isAuth(val) {
      if (val) {
        firebase
          .firestore()
          .collection('images')
          .get()
          .then((snapshot) => {
            const array = []
            snapshot.forEach((doc) => {
              array.push(doc.data())
            })
            this.photoList = array
          })
      }
    },
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      console.log('user', user) // eslint-disable-line no-console
      this.isAuth = !!user
      this.isLoading = false
    })
  },
  methods: {
    signIn() {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(provider)
    },
    signOut() {
      this.isLoading = true
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.isLoading = false
        })
    },
    resizeImg(e) {
      this.file = e.target.files[0]
      if (this.file === null) {
        alert('Please select a file')
        return
      }

      loadImage.parseMetaData(this.file, (data) => {
        const options = {
          maxWidth: 3840,
          maxHeight: 3840,
          canvas: true,
        }
        this.exifInfo = data.exif.getAll()
        // console.log(this.exifInfo) // eslint-disable-line no-console

        loadImage(
          this.file,
          (canvas) => {
            const data = canvas.toDataURL(this.file.type)
            const blob = this.base64ToBlob(data, this.file.type)
            this.imageFile = new File([blob], this.file.name, {
              type: this.file.type,
            })
          },
          options
        )
      })
    },
    base64ToBlob(base64, fileType) {
      const bin = atob(base64.replace(/^.*,/, ''))
      const buffer = new Uint8Array(bin.length)

      for (let i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i)
      }
      return new Blob([buffer.buffer], {
        type: fileType || 'image/jpg',
      })
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
      await storageRef.put(this.imageFile).catch((e) => {
        alert('Error', e)
      })
      alert('Uploaded successfully')
      this.$router.go({ name: 'MyPage' })
    },
    // 選択した画像のFirestoreドキュメントを削除する
    async deleteImgs() {
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
          await db
            .where('fileName', '==', item)
            .get()
            .then((snapshot) => {
              snapshot.forEach((document) => {
                // ドキュメントを削除
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
})
</script>
