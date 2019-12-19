<template>
  <div class="wrapper">
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
          @click="uploadFile"
        >
          <font-awesome-icon
            :icon="['fas', 'upload']"
            class="fa-3x fa-fw fa-color fa-button"
          />
        </button>
      </div>
      <!-- <div><canvas></canvas></div> -->
      <h3>Gallery Editor</h3>
      <button
        class="flat-button edit-button"
        @click="deleteImg(selectValueList)"
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
      const file = e.target.files[0]

      loadImage.parseMetaData(file, data => {
        const options = {
          maxWidth: 3840,
          maxHeight: 3840,
          canvas: true
        }
        this.exifInfo = data.exif.getAll()
        console.log(this.exifInfo) // eslint-disable-line no-console

        loadImage(
          file,
          async canvas => {
            const data = canvas.toDataURL(file.type)
            const blob = this.base64ToBlob(data, file.type)
            this.imageFile = new File([blob], file.name, {
              type: file.type
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
    uploadFile () {
      const storageRef = firebase.storage().ref()
      const uploadRef = storageRef.child(this.imageFile.name)

      uploadRef
        .put(this.imageFile)
        .then(snapshot => {
          alert('Uploaded successfully')
          this.imageFile = null
          this.$router.go({ name: 'MyPage' })
        })
        .catch(e => {
          alert('Error', e)
        })
    },
    deleteImg (selectValues) {
      if (this.selectValues.length === 0) {
        alert('Please select images')
        return
      }
      if (confirm('Remove your images?')) {
        const db = firebase.firestore().collection('images')
        selectValues.forEach(value => {
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
              this.selectValues = []
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
