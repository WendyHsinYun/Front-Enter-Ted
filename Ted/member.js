import {
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js'

import {
  getDatabase,
  ref,
  set,
  get
} from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js'

import { app, auth } from './firebaseConfig.js'

const personalBtn = document.querySelector('.personal-btn')
const favoriteBtn = document.querySelector('.favorite-btn')
const logOut = document.querySelector('.sign-out')
const memberContainer = document.querySelector('.member-container')
const favoriteContainer = document.querySelector('.favorite-container')
const memberName = document.querySelector('.member-name')
const memberPhone = document.querySelector('.member-phone')
const memberEmail = document.querySelector('.member-email')
const memberAvatar = document.querySelector('.member-avatar img')
const correctBtns = document.querySelector('.correct-btn-group')
const correctBtn = document.querySelector('.correct-btn')
const enterBtn = document.querySelector('.enter-correct')
const cancelBtn = document.querySelector('.cancel-correct')

personalBtn.addEventListener('click', () => {
  memberContainer.style.display = 'flex'
  favoriteContainer.style.display = 'none'
})

favoriteBtn.addEventListener('click', () => {
  memberContainer.style.display = 'none'
  favoriteContainer.style.display = 'flex'
})

logOut.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      console.log('登出成功')
      const origin = window.location.origin
      const pathname = window.location.pathname
      const bathPath = pathname.split('/Ted')[0]
      const targetUrl = `${origin}${bathPath}/Ted/index.html`
      window.location.href = targetUrl
    })
    .catch(error => {
      console.log('登出失敗')
    })
})

// realtime database
// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app)
let uid = null
onAuthStateChanged(auth, user => {
  uid = user.uid
  const name = user.displayName
  const phone = user.phoneNumber
  const email = user.email
  const avatar = user.photoURL
  const userRef = ref(database, 'users/' + uid)
  get(userRef).then(snapshot => {
    if (!snapshot.exists()) {
      writeUserData(uid, name, email, phone, avatar)
    }
    const userData = snapshot.val()
    memberName.value = userData.username
    memberPhone.value = userData.phone || ''
    memberEmail.value = userData.email
    memberAvatar.src = userData.avatar
  })
})
// 寫入數據
function writeUserData(userId, name, email, phone, avatar) {
  set(ref(database, 'users/' + userId), {
    username: name,
    email: email,
    phone: phone,
    avatar: avatar
  })
}

correctBtns.addEventListener('click', e => {
  if (e.target.matches('.correct-btn')) {
    toggleInput(true)
  } else if (e.target.matches('.enter-correct')) {
    toggleInput(false)
    writeUserData(
      uid,
      memberName.value,
      memberEmail.value,
      memberPhone.value,
      memberAvatar.src
    )
  } else if (e.target.matches('.cancel-correct')) {
    toggleInput(false)
  }
})

function toggleInput(canEdit) {
  memberName.disabled = !canEdit
  memberPhone.disabled = !canEdit
  memberEmail.disabled = !canEdit

  correctBtn.style.display = canEdit ? 'none' : 'block'
  enterBtn.style.display = canEdit ? 'block' : 'none'
  cancelBtn.style.display = canEdit ? 'block' : 'none'
}

// 取得資料
let collection = JSON.parse(localStorage.getItem('collection'))
console.log(collection)

// 渲染
function renderFavorite() {
  favoriteContainer.innerHTML = ``
  collection.forEach(items => {
    let template = ``
    template = `<div class="favorite-card">
            <a href="${items.href}"><img src="${items.img}" alt="" class="favorite-card-image"></a>
            <h4 class="favorite-card-title">${items.name}</h4>
            <i class="fa-solid fa-trash-can"></i>
          </div>`
    favoriteContainer.innerHTML += template
  })
}
// 刪除功能
favoriteContainer.addEventListener('click', e => {
  if (e.target.classList.contains('fa-trash-can')) {
    const card = e.target.closest('.favorite-card')
    const name = card.querySelector('.favorite-card-title').innerText
    collection = collection.filter(item => item.name !== name)
    localStorage.setItem('collection', JSON.stringify(collection))
    renderFavorite()
  }
})

renderFavorite()
