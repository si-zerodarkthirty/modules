import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';

import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faUser, 
  faPlus, 
  faTimes,
  faEye
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(
  faUser,
  faPlus,
  faTimes,
  faEye
)
Vue.component('fa', FontAwesomeIcon)

import { firestorePlugin } from 'vuefire'          
import firebase from 'firebase'     
import 'firebase/firestore'
Vue.use(firestorePlugin)
firebase.initializeApp({                
  apiKey: "AIzaSyCmPbWZH6dcy5LN_Kl23Bye2qG7b25cypg",
  authDomain: "skil-hunt.firebaseapp.com",
  databaseURL: "https://skil-hunt.firebaseio.com",
  projectId: "skil-hunt",
  storageBucket: "skil-hunt.appspot.com",
  messagingSenderId: "187345559835",
  appId: "1:187345559835:web:cc5239f46aef4f87"
})
export const db = firebase.firestore()
export const auth = firebase.auth()

import VueDateFns from "vue-date-fns"
Vue.use(VueDateFns)

import Toasted from 'vue-toasted'
Vue.use(Toasted)

Vue.config.productionTip = false;
new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
