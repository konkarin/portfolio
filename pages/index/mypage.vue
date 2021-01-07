<template>
  <div class="wrapper">
    <div v-show="isUploading || isLoading" class="overlay">
      <div class="loader" />
    </div>
    <h1>MyPage</h1>
    <div v-if="!isLoading" class="auth-area">
      <div v-if="isAuth">
        <button class="flat-button sign-out" @click="signOut()">
          Sign out
        </button>
      </div>
      <div v-else>
        <button class="flat-button sign-in" @click="signIn()">Sign in</button>
      </div>
    </div>

    <NuxtChild v-if="isAuth" />
  </div>
</template>

<script>
import Vue from 'vue'
import firebase from '@/plugins/firebase'

export default Vue.extend({
  data() {
    return {
      isLoading: true,
      isUploading: false,
    }
  },
  computed: {
    isAuth() {
      return this.$store.state.isAuth
    },
  },
  created() {
    firebase.auth().onAuthStateChanged(async (user) => {
      this.$store.commit('updateAuth', !!user)
      this.isLoading = false

      if (this.isAuth) {
        await this.getImages()
      }
    })
  },
  methods: {
    signIn() {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithPopup(provider)
    },

    async signOut() {
      this.isLoading = true
      await firebase.auth().signOut()
      this.isLoading = false
    },
  },
  head() {
    return {
      title: 'Mypage',
    }
  },
})
</script>
