<template>
  <div>
    <div v-show="isUploading || isLoading" class="overlay">
      <div class="loader" />
    </div>
    <div v-if="!isLoading" class="auth-area">
      <template v-if="isAuth">
        <button class="btn sign-out" @click="signOut()">Sign out</button>
      </template>
      <template v-else>
        <button class="btn sign-in" @click="signIn()">Sign in</button>
      </template>
    </div>
    <main v-if="isAuth" class="wrapper dashboard">
      <div class="dashboard__nav">
        <NuxtLink
          to="/settings/profile"
          class="dashboard__navItem"
          :class="{
            'dashboard__navItem--active': $route.path === '/settings/profile',
          }"
        >
          Profile
        </NuxtLink>
        <NuxtLink
          to="/settings/gallery"
          class="dashboard__navItem"
          :class="{
            'dashboard__navItem--active': $route.path === '/settings/gallery',
          }"
        >
          Gallery
        </NuxtLink>
        <NuxtLink
          to="/settings/articles"
          class="dashboard__navItem"
          :class="{
            'dashboard__navItem--active': $route.path === '/settings/articles',
          }"
        >
          Articles
        </NuxtLink>
      </div>
      <NuxtChild />
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
