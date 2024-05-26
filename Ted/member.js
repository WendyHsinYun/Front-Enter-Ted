// Import the functions you need from the SDKs you need
import { initializeApp } from '../firebase/app'
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from '../firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBNJSe8S9KmNamUmxdHItko-FYOGz76pBs',
  authDomain: 'frontend-ted.firebaseapp.com',
  projectId: 'frontend-ted',
  storageBucket: 'frontend-ted.appspot.com',
  messagingSenderId: '230889402040',
  appId: '1:230889402040:web:773292211e602657ebce4d',
  measurementId: 'G-WFF7HKCZQ2'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

document.getElementById('google-sign-in-btn').addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .then(result => {
      // 登錄成功
      console.log('User signed in: ', result.user)
    })
    .catch(error => {
      // 登錄失敗
      console.error('Error during sign in: ', error)
    })
})

// 監聽用戶狀態變化
onAuthStateChanged(auth, user => {
  if (user) {
    console.log('User is signed in: ', user)
    // 更新 UI 或執行其他操作
  } else {
    console.log('No user is signed in')
    // 更新 UI 或執行其他操作
  }
})

