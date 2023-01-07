<template>
  <div>
    <div v-show="isUploading || isLoading" class="overlay">
      <div class="loader" />
    </div>
    <header v-if="!isLoading" class="auth-area">
      <template v-if="isAuth">
        <button class="btn sign-out" @click="signOut()">Sign out</button>
      </template>
      <template v-else>
        <button class="btn sign-in" @click="signIn()">Sign in</button>
      </template>
    </header>
    <main v-if="isAuth" class="dashboard">
      <nav v-if="!$route.params.article" class="dashboard__nav">
        <NuxtLink
          to="/dashboard/profile"
          class="dashboard__navItem"
          :class="{
            'dashboard__navItem--active': $route.path === '/dashboard/profile',
          }"
        >
          Profile
        </NuxtLink>
        <NuxtLink
          to="/dashboard/gallery"
          class="dashboard__navItem"
          :class="{
            'dashboard__navItem--active': $route.path === '/dashboard/gallery',
          }"
        >
          Gallery
        </NuxtLink>
        <NuxtLink
          to="/dashboard/articles"
          class="dashboard__navItem"
          :class="{
            'dashboard__navItem--active': $route.path === '/dashboard/articles',
          }"
        >
          Articles
        </NuxtLink>
      </nav>
      <NuxtChild />
    </main>
  </div>
</template>

<script lang="ts">
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from '@firebase/auth'
import Vue from 'vue'

interface Data {
  isLoading: boolean
  isUploading: boolean
}

export default Vue.extend({
  name: 'PagesDashboard',
  data(): Data {
    return {
      isLoading: true,
      isUploading: false,
    }
  },
  head(): any {
    return {
      title: 'Dashboard',
      meta: [
        { hid: 'og:type', property: 'og:type', content: 'article' },
        {
          hid: 'og:title',
          property: 'og:title',
          content: `Dashboard - konkarin's photos & blog`,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${process.env.APP_URL}Dashboard`,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: 'https://konkarin.photo/HomeImg.jpg',
        },
      ],
    }
  },
  computed: {
    isAuth(): boolean {
      return this.$store.state.isAuth
    },
  },
  mounted(): void {
    getAuth().onAuthStateChanged((user) => {
      this.$store.commit('updateAuth', !!user)
      if (user) {
        this.$store.commit('updateUser', { uid: user.uid })
      }

      this.isLoading = false
    })
  },
  methods: {
    signIn(): void {
      const provider = new GoogleAuthProvider()
      signInWithPopup(getAuth(), provider)
    },

    async signOut(): Promise<void> {
      this.isLoading = true
      await signOut(getAuth())
      this.isLoading = false
    },
  },
})
</script>

<style lang="scss" scoped>
.dashboardTab {
  width: 150px;
  position: sticky;
}
</style>
