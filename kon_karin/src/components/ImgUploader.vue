<template>
  <div class="wrapper">
    <h1>ImgUploader</h1>
    <div class="auth-area">
      <div v-if="isAuth">
        <button class="sign-out flat-button" @click="signOut">Sign out</button>
      </div>
      <div v-else>
        <button class="sign-in flat-button" @click="signIn">Sign in</button>
      </div>
    </div>
    <div v-show="isAuth">
      <label class="input-item">
        <font-awesome-icon :icon="['fas', 'image']" class="fa-3x fa-fw fa-color fa-button" />
        <input type="file" accept=".jpeg, .jpg, .png" @change="resizeImg" />
      </label>
      <button class="upload-button" @click="uploadFile">
        <font-awesome-icon :icon="['fas', 'upload']" class="fa-3x fa-fw fa-color fa-button" />
      </button>
    </div>
  </div>
</template>
    
<script>
import firebase from "firebase";
import loadImage from "blueimp-load-image";

export default {
  data() {
    return {
      isAuth: false,
      imageFile: null,
      exifInfo: null,
    };
  },
  methods: {
    signIn() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithRedirect(provider);
    },
    signOut() {
      firebase.auth().signOut();
    },
    resizeImg(e) {
      const file = e.target.files[0];

      loadImage.parseMetaData(file, data => {
        const options = {
          maxWidth: 3840,
          maxHeight: 3840,
          canvas: true
        };
        this.exifInfo = data.exif.getAll();
        console.log(this.exifInfo)

        loadImage(
          file,
          async canvas => {
            const data = canvas.toDataURL(file.type);
            const blob = this.base64ToBlob(data, file.type);
            this.imageFile = new File([blob], file.name, {
              type: file.type
            });
          },
          options
        );
      });
    },
    base64ToBlob(base64, fileType) {
      const bin = atob(base64.replace(/^.*,/, ""));
      const buffer = new Uint8Array(bin.length);

      for (let i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
      }

      return new Blob([buffer.buffer], {
        type: fileType ? fileType : "image/jpg"
      });
    },
    uploadFile() {
      let storageRef = firebase.storage().ref();
      let uploadRef = storageRef.child(this.imageFile.name);
      
      uploadRef
        .put(this.imageFile)
        .then(snapshot => {
          alert("Uploaded Successfully");
        })
        .catch(error => {
          alert("Error");
        });
    }
  },
  mounted: function() {
    firebase.auth().onAuthStateChanged(user => (this.isAuth = !!user));
  }
};
</script>
