<template>
  <div>
    <div v-show="isUploading || isLoading" class="overlay">
      <div class="loader" />
    </div>
    <div v-if="!isLoading" class="auth-area">
      <template v-if="isAuth">
        <button class="flat-button sign-out" @click="signOut()">
          Sign out
        </button>
      </template>
      <template v-else>
        <button class="flat-button sign-in" @click="signIn()">Sign in</button>
      </template>
    </div>
    <main class="wrapper">
      <div class="dashboardTab">
        <NuxtLink to="/settings/gallery" class="dashboardTab__item">
          Gallery
        </NuxtLink>
        <NuxtLink to="/settings/articles" class="dashboardTab__item">
          Articles
        </NuxtLink>
        <NuxtLink to="/settings/post" class="dashboardTab__item">Post</NuxtLink>
        <NuxtLink to="/settings/profile" class="dashboardTab__item">
          Profile
        </NuxtLink>
      </div>
      <NuxtChild v-if="isAuth" />
    </main>
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
  name: 'Settings',
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
  mounted(): void {
    firebase.auth().onAuthStateChanged((user) => {
      this.$store.commit('updateAuth', !!user)
      if (user) {
        this.$store.commit('updateUser', { uid: user.uid })
      }

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

<style lang="scss" scoped>
.dashboardTab {
  width: 150px;
  position: sticky;
}
</style>
