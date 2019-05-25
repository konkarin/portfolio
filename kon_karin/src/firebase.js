import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAG4zByFes5G0FAozQ9qpjrpLTLOdZTAqI",
    authDomain: "konkarin-portfolio.firebaseapp.com",
    databaseURL: "https://konkarin-portfolio.firebaseio.com",
    projectId: "konkarin-portfolio",
    storageBucket: "konkarin-portfolio.appspot.com",
    messagingSenderId: "479537245330",
    appId: "1:479537245330:web:0bc8bd2dffad3b63"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// firebase.firestore().settings({ timestampsInSnapshots: true })

export default firebase