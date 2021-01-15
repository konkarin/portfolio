import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyAeEviiI6BRwheQrmiXpBeztb_XcUdZw8E',
  authDomain: 'konkarin-photo.firebaseapp.com',
  projectId: 'konkarin-photo',
  storageBucket: 'konkarin-photo.appspot.com',
  messagingSenderId: '631852417771',
  appId: '1:631852417771:web:46ff2edb9660c9906534ae',
  measurementId: 'G-YGDY0HJSYV',
}

// Initialize Firebase
// NOTE: SSGだとこれいれないと複数回初期化されるっぽい
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

// firebase.firestore().settings({ timestampsInSnapshots: true })

export default firebase
