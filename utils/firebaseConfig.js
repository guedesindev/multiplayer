import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js'
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js'
import {
  getAuth,
  signInAnonymously
} from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js'
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  limitToFirst,
  get,
  set,
  push,
  child,
  update,
  onValue
} from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-database.js'

const firebaseConfig = {
  apiKey: 'AIzaSyDWhXt_MzTDCocmAK7dzKQ9eVQEkhe5byA',
  authDomain: 'jogosmultiplayer-e1a31.firebaseapp.com',
  projectId: 'jogosmultiplayer-e1a31',
  storageBucket: 'jogosmultiplayer-e1a31.firebasestorage.app',
  messagingSenderId: '949154802628',
  appId: '1:949154802628:web:2af70b1ff6aeb519d11291',
  measurementId: 'G-PQ35TNDWQD'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

export {
  getAuth,
  signInAnonymously,
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  limitToFirst,
  get,
  set,
  push,
  child,
  update,
  onValue
}
