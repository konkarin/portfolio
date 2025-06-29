<template>
  <ToastProvider>
    <div v-show="isUploading || isLoading" class="overlay">
      <Loader />
    </div>
    <template v-if="isAuth">
      <header>
        <DashboardHeaderNav v-if="!$route.params.article" />
      </header>
      <main class="dashboard">
        <NuxtPage />
      </main>
    </template>
    <header v-else class="auth-area">
      <button class="btn sign-in" @click="signIn()">Sign in</button>
    </header>
  </ToastProvider>
</template>

<script setup lang="ts">
import { getAuth, GoogleAuthProvider, signInWithPopup } from '@firebase/auth'
import { useAuth, AUTH_KEY } from '@/composables/useAuth'

const isLoading = ref(true)
const isUploading = ref(false)

const auth = useAuth()
provide(AUTH_KEY, auth)

const { isAuth, updateAuth, updateUser } = auth

onMounted((): void => {
  getAuth().onAuthStateChanged((user) => {
    updateAuth(Boolean(user))
    if (user) {
      updateUser(user)
    }

    isLoading.value = false
  })
})

const signIn = (): void => {
  const provider = new GoogleAuthProvider()
  signInWithPopup(getAuth(), provider)
}

useRouterCommand('home')
</script>

<style lang="scss" scoped>
.sign-in {
  margin: 0 0 0 auto;
}

.dashboardTab {
  width: 150px;
  position: sticky;
}

.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 4rem;
}

@media screen and (max-width: $sm) {
  .dashboard {
    margin: 0;
    padding: 2rem 1rem;
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
