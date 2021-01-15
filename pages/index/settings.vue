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

<script lang="ts">
import Vue from 'vue'
import firebase from '@/plugins/firebase'

type Data = {
  isLoading: boolean
  isUploading: boolean
}

export default Vue.extend({
  data(): Data {
    return {
      isLoading: true,
      isUploading: false,
    }
  },
  computed: {
    isAuth(): boolean {
      return this.$store.state.isAuth
    },
  },
  created(): void {
    firebase.auth().onAuthStateChanged((user) => {
      this.$store.commit('updateAuth', !!user)
      this.isLoading = false
    })
  },
  methods: {
    signIn(): void {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithPopup(provider)
    },

    async signOut(): Promise<void> {
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
