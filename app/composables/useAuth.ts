import type { User } from 'firebase/auth'
import { ref, inject, type Ref } from 'vue'

export interface AuthState {
  isAuth: Ref<boolean>
  user: Ref<User | null>
  updateAuth: (value: boolean) => void
  updateUser: (userData: User) => void
  getUser: () => User | null
}

export const useAuth = (): AuthState => {
  const isAuth = ref<boolean>(false)
  const user = ref<User | null>(null)

  const updateAuth = (value: boolean): void => {
    isAuth.value = value
  }

  const updateUser = (userData: User): void => {
    user.value = userData
  }

  const getUser = (): User | null => {
    return user.value
  }

  return {
    isAuth,
    user,
    updateAuth,
    updateUser,
    getUser,
  }
}

export const AUTH_KEY = Symbol('auth')

export const useAuthInject = (): AuthState => {
  const auth = inject<AuthState>(AUTH_KEY)
  if (!auth) {
    throw new Error('useAuthInject must be used within an AuthProvider')
  }
  return auth
}
