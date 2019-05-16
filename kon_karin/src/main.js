import Vue from 'vue'
import App from './App.vue'
import router from './router'

import firebase from 'firebase'

import './assets/style/style.scss'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(fab)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

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

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
