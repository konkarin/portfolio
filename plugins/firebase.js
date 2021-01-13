import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyAG4zByFes5G0FAozQ9qpjrpLTLOdZTAqI',
  authDomain: 'konkarin-portfolio.firebaseapp.com',
  databaseURL: 'https://konkarin-portfolio.firebaseio.com',
  projectId: 'konkarin-portfolio',
  storageBucket: 'konkarin-portfolio.appspot.com',
  messagingSenderId: '479537245330',
  appId: '1:479537245330:web:0bc8bd2dffad3b63',
}
// Initialize Firebase

// Initialize Firebase
// NOTE: SSGだとこれいれないと複数回初期化されるっぽい
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

// firebase.firestore().settings({ timestampsInSnapshots: true })

export default firebase