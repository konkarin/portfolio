import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyAt8ffI7KUuvEaRE1QW9KusqxyX7aTIqoo',
  authDomain: 'portfolio-4edf5.firebaseapp.com',
  projectId: 'portfolio-4edf5',
  storageBucket: 'portfolio-4edf5.appspot.com',
  messagingSenderId: '650799587992',
  appId: '1:650799587992:web:6d9782f875a691b924a6ed',
  measurementId: 'G-T5WYPMSG80',
}

// Initialize Firebase
// NOTE: SSGだとこれいれないと複数回初期化されるっぽい
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

// firebase.firestore().settings({ timestampsInSnapshots: true })

export default firebase
