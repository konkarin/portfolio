import { getApp, getApps, initializeApp } from 'firebase/app'

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

export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// DEBUG: dev環境でのみFunctionsエミュレータへ接続する。
// firebase/functions を静的importすると、このモジュール（firestore経由で公開側でも読み込まれる）に
// firebase/functions が含まれてしまうため、開発時のみ動的importして公開バンドルから分離する。
if (process.env.NODE_ENV === 'development') {
  import('firebase/functions').then(({ connectFunctionsEmulator, getFunctions }) => {
    connectFunctionsEmulator(getFunctions(firebaseApp), 'localhost', 5001)
  })
}
