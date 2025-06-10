<template>
  <div>
    <div v-show="isUploading || isLoading" class="overlay">
      <Loader />
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
          to="/dashboard/articles"
          class="dashboard__navItem"
          :class="{
            'dashboard__navItem--active': $route.path === '/dashboard/articles',
          }"
        >
          Blog
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
.sign-in,
.sign-out {
  margin: 0 0 0 auto;
}

.dashboardTab {
  width: 150px;
  position: sticky;
}

.dashboard {
  max-width: 1200px;
  margin: 3rem auto 0;

  @media screen and (max-width: $sm) {
    .dashboard {
      margin: 0;
      padding: 2rem 1rem;
    }
  }
}

.dashboard__nav {
  position: fixed;
}

.dashboard__navItem {
  display: flex;
  padding: 0.5rem 1.5rem;
  font-size: 1.1em;
  color: var(--gray);
  &:hover {
    text-decoration: none;
    color: var(--black);
  }
}

.dashboard__navItem--active {
  color: var(--black);
}

.auth-area {
  display: flex;
  // margin-top: 1rem;
  // margin-right: 1rem;
  max-width: 1200px;
  margin: 1rem auto 0;
}
</style>
