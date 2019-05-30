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
        <font-awesome-icon :icon="['fas', 'image']" class="fa-3x fa-fw fa-color fa-button"/>
        <input @change="setUploadFIle" type="file" name="name">
      </label>
      <button class="upload-button" @click="uploadFile">
        <font-awesome-icon :icon="['fas', 'upload']" class="fa-3x fa-fw fa-color fa-button"/>
      </button>
    </div>
  </div>
</template>
    
<script>
import firebase from "firebase";

export default {
  data() {
    return {
      isAuth: false,
      file: null
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
    setUploadFIle(e) {
      this.file = e.target.files[0]
    },
    uploadFile() {
      let storageRef = firebase.storage().ref()
      let uploadRef = storageRef.child(this.file.name)
      uploadRef.put(this.file).then(snapshot => {
        alert('Uploaded Successfully')
      }).catch(error => {
        alert('Error')
      })
    // clear file

    }
  },
  mounted: function() {
    firebase.auth().onAuthStateChanged(user => (this.isAuth = !!user));
  }
};
</script>
