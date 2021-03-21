import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/storage'

// Initialize Firebase
// NOTE: SSGだとこれいれないと複数回初期化されるっぽい
if (firebase.apps.length === 0) {
  firebase.initializeApp(process.env.firebaseConfig)
}
// DEBUG:
if (process.env.NODE_ENV === 'development') {
  firebase.functions().useEmulator('localhost', 5001)
}

export default firebase
