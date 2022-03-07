import { getApp, getApps, initializeApp } from 'firebase/app'
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'

const envPath = `app/.env.${process.env.NODE_ENV}`
require('dotenv').config({ path: envPath })

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
}

export const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// DEBUG:
if (process.env.NODE_ENV === 'development') {
  connectFunctionsEmulator(getFunctions(firebaseApp), 'localhost', 5001)
}
