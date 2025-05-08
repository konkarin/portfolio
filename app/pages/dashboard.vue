<template>
  <div>
    <div v-show="isUploading || isLoading" class="overlay">
      <div class="loader" />
    </div>
    <header v-if="!isLoading" class="auth-area">
      <template v-if="isAuth">
        <button class="btn sign-out" @click="_signOut()">Sign out</button>
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
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from '@firebase/auth'

const isLoading = ref(true)
const isUploading = ref(false)

const { $store } = useNuxtApp()
const isAuth = computed((): boolean => {
  return $store.state.isAuth
})
onMounted((): void => {
  getAuth().onAuthStateChanged((user) => {
    $store.commit('updateAuth', Boolean(user))
    if (user) {
      $store.commit('updateUser', { uid: user.uid })
    }

    isLoading.value = false
  })
})

const signIn = (): void => {
  const provider = new GoogleAuthProvider()
  signInWithPopup(getAuth(), provider)
}
const _signOut = async (): Promise<void> => {
  isLoading.value = true
  await signOut(getAuth())
  isLoading.value = false
}

const { APP_URL } = useRuntimeConfig().public
useHead({
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
      content: `${APP_URL}/Dashboard`,
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: 'https://konkarin.photo/HomeImg.jpg',
    },
  ],
})
</script>

<style lang="scss" scoped>
.dashboardTab {
  width: 150px;
  position: sticky;
}
</style>
