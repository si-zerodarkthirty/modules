import Vue from 'vue';
import './registerServiceWorker';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faUser,
  faPlus,
  faTimes,
  faEye,
  faEllipsisV,
  faUpload,
  faCode,
  faCopy,
  faHeart,
  faYenSign,
  faClock,
  faArrowUp,
  faArrowDown,
  faLink
} from '@fortawesome/free-solid-svg-icons';
import {
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { firestorePlugin } from 'vuefire';
import firebase from 'firebase';
import 'firebase/firestore';

import VueDateFns from 'vue-date-fns';

import Toasted from 'vue-toasted';

import Clipboard from 'v-clipboard';

import VueDisqus from 'vue-disqus';

import PayjpCheckout from 'vue-payjp-checkout';
import App from './App.vue';
import router from './router';

library.add(
  faUser,
  faPlus,
  faTimes,
  faEye,
  faEllipsisV,
  faUpload,
  faCode,
  faCopy,
  faTwitter,
  faHeart,
  faYenSign,
  faClock,
  faArrowUp,
  faArrowDown,
  faLink
);
Vue.component('fa', FontAwesomeIcon);
Vue.use(firestorePlugin);
firebase.initializeApp({
  apiKey: 'AIzaSyCmPbWZH6dcy5LN_Kl23Bye2qG7b25cypg',
  authDomain: 'skil-hunt.firebaseapp.com',
  databaseURL: 'https://skil-hunt.firebaseio.com',
  projectId: 'skil-hunt',
  storageBucket: 'skil-hunt.appspot.com',
  messagingSenderId: '187345559835',
  appId: '1:187345559835:web:cc5239f46aef4f87',
});
export const db = firebase.firestore();
export const auth = firebase.auth();
Vue.use(VueDateFns);
Vue.use(Toasted);
Vue.use(Clipboard);
Vue.use(VueDisqus);
Vue.use(PayjpCheckout);

Vue.config.productionTip = false;
new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
