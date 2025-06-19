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
  apiKey: '**********',
  authDomain: '*******',
  projectId: 'jogosmultiplayer-e1a31',
  storageBucket: 'jogosmultiplayer-e1a31.firebasestorage.app',
  messagingSenderId: '*******',
  appId: '*********',
  measurementId: '*******'
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
