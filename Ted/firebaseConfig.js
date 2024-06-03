import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js'

import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js'

const firebaseConfig = {
  apiKey: 'AIzaSyBNJSe8S9KmNamUmxdHItko-FYOGz76pBs',
  authDomain: 'frontend-ted.firebaseapp.com',
  projectId: 'frontend-ted',
  storageBucket: 'frontend-ted.appspot.com',
  messagingSenderId: '230889402040',
  appId: '1:230889402040:web:773292211e602657ebce4d',
  measurementId: 'G-WFF7HKCZQ2',
  databaseURL:
    'https://frontend-ted-default-rtdb.asia-southeast1.firebasedatabase.app/'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export { app, auth }
