import { getApp, getApps, initializeApp } from 'firebase/app'
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'
import { runtimePublicConfig } from '../../config'

const firebaseConfig = {
  apiKey: runtimePublicConfig.API_KEY,
  authDomain: runtimePublicConfig.AUTH_DOMAIN,
  projectId: runtimePublicConfig.PROJECT_ID,
  storageBucket: runtimePublicConfig.STORAGE_BUCKET,
  messagingSenderId: runtimePublicConfig.MESSAGING_SENDER_ID,
  appId: runtimePublicConfig.APP_ID,
  measurementId: runtimePublicConfig.MEASUREMENT_ID,
}

export const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// DEBUG:
if (process.env.NODE_ENV === 'development') {
  connectFunctionsEmulator(getFunctions(firebaseApp), 'localhost', 5001)
}
