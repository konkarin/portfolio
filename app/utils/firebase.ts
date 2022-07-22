import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/storage'

const envPath = `app/.env.${process.env.NODE_ENV}`
require('dotenv').config({ path: envPath })

export const FIREBASE_OPTIONS = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
}

// Initialize Firebase
// NOTE: SSGだとこれいれないと複数回初期化される
if (firebase.apps.length === 0) {
  firebase.initializeApp(FIREBASE_OPTIONS)
}

// DEBUG:
if (process.env.NODE_ENV === 'development') {
  firebase.functions().useEmulator('localhost', 5001)
}

export default firebase
