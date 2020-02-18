import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './assets/style/style.scss'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faTwitterSquare, faInstagram, faGithubSquare } from '@fortawesome/free-brands-svg-icons/'
import { faImage, faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faTwitterSquare, faInstagram, faGithubSquare, faImage, faUpload)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
