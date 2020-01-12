<template>
  <div class="wrapper">
    <div
      v-show="isUploading"
      class="overlay"
    >
      <div class="loader" />
    </div>
    <h1>MyPage</h1>
    <div class="auth-area">
      <div v-if="isAuth">
        <button
          class="flat-button sign-out"
          @click="signOut"
        >
          Sign out
        </button>
      </div>
      <div v-else>
        <button
          class="flat-button sign-in"
          @click="signIn"
        >
          Sign in
        </button>
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
          <input
            type="file"
            accept=".jpeg, .jpg, .png"
            @change="resizeImg"
          >
        </label>
        <button
          class="upload-button"
          :disabled="file === null"
          @click="uploadFile()"
        >
          <font-awesome-icon
            :icon="['fas', 'upload']"
            class="fa-3x fa-fw  fa-button"
            :class="{'fa-color' : file !== null}"
          />
        </button>
      </div>
      <!-- <div><canvas></canvas></div> -->
      <h3>Gallery Editor</h3>
      <button
        class="flat-button edit-button"
        @click="deleteImg()"
      >
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
            >
            <div class="thumb-box">
              <img
                class="select-img"
                :src="photo.thumburl"
              >
            </div>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import loadImage from 'blueimp-load-image'

export default {
  name: 'MyPage',
  data () {
    return {
      isAuth: false,
      isUploading: false,
      file: null,
      imageFile: null,
      exifInfo: null,
      photoList: [],
      selectValueList: []
    }
  },
  watch: {
    isAuth: function (val) {
      if (val) {
        firebase
          .firestore()
          .collection('images')
          .get()
          .then(snapshot => {
            const array = []
            snapshot.forEach(doc => {
              array.push(doc.data())
            })
            this.photoList = array
          })
      }
    }
  },
  beforeCreate () {
    firebase.auth().onAuthStateChanged(user => (this.isAuth = !!user))
  },
  methods: {
    signIn () {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(provider)
    },
    signOut () {
      firebase.auth().signOut()
    },
    resizeImg (e) {
      this.file = e.target.files[0]
      if (this.file === null) {
        alert('Please select a file')
        return
      }

      loadImage.parseMetaData(this.file, data => {
        const options = {
          maxWidth: 3840,
          maxHeight: 3840,
          canvas: true
        }
        this.exifInfo = data.exif.getAll()
        console.log(this.exifInfo) // eslint-disable-line no-console

        loadImage(
          this.file,
          async canvas => {
            const data = canvas.toDataURL(this.file.type)
            const blob = this.base64ToBlob(data, this.file.type)
            this.imageFile = new File([blob], this.file.name, {
              type: this.file.type
            })
          },
          options
        )
      })
    },
    base64ToBlob (base64, fileType) {
      const bin = atob(base64.replace(/^.*,/, ''))
      const buffer = new Uint8Array(bin.length)

      for (let i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i)
      }

      return new Blob([buffer.buffer], {
        type: fileType || 'image/jpg'
      })
    },
    async uploadFile () {
      // ローディングを表示
      this.isUploading = true
      const currentDate = new Date().getTime()
      // ファイル名に現在時刻を付与
      const storageRef = firebase.storage().ref().child(`${currentDate}_${this.imageFile.name}`)

      await storageRef
        .put(this.imageFile)
        .then(() => {
          alert('Uploaded successfully')
        })
        .catch(e => {
          alert('Error', e)
        })
      this.$router.go({ name: 'MyPage' })
    },
    deleteImg () {
      if (this.selectValueList.length === 0) {
        alert('Please select images')
        return
      }
      if (confirm('Remove your images?')) {
        const db = firebase.firestore().collection('images')
        this.selectValueList.forEach(value => {
          db.where('fileName', '==', value)
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                db.doc(doc.id)
                  .delete()
                  .catch(e => {
                    alert('Error', e)
                  })
              })
              alert('Remove successfully')
              this.selectValueList = []
              this.$router.go({ name: 'MyPage' })
            })
            .catch(e => {
              alert('Error', e)
            })
        })
      }
    }
  }
}
</script>
