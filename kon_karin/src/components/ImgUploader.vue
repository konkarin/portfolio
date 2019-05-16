<template>
  <div class="wrapper">
    <h1>ImgUploader</h1>
    <div v-if="isAuth">
      <label class="input-item">
        Select File
        <input @change="setUploadFIle" type="file" name="name">
      </label>
      <button class="upload-file" @click="uploadFile">Upload</button>
      <button class="sign-out" @click="signOut">Sign out</button>
    </div>
    <div v-else>
      <button class="sign-in" @click="signIn">Sign in</button>
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
    async uploadFile() {
      let storageRef = firebase.storage().ref()
      let uploadRef = storageRef.child(this.file.name)
      await uploadRef.put(this.file).then(snapshot => {
        alert('Uploaded Successfully')
      }).catch(error => {
        alert('Error')
      })
    }
  },
  mounted: function() {
    firebase.auth().onAuthStateChanged(user => (this.isAuth = !!user));
  }
};
</script>
