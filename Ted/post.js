// 取得 input 資料
const form = document.querySelector('#post-form')
const formContainer = document.querySelector('.form-container')
const postList = document.querySelector('.post-list')
const postName = document.querySelector('.post-name')
const postLocation = document.querySelector('.post-location')
const postBackground = document.querySelector('.post-background')
const postSquareUrl = document.querySelector('.post-squareurl')
const postTopic = document.querySelector('.post-topic')
const postPreface = document.querySelector('.post-preface')
const postContent = document.querySelector('.post-content')
const postTechnology = document.querySelector('.post-technology')
const postTotalDay = document.querySelector('.post-totalday')
const postWeekHour = document.querySelector('.post-weekhour')
const postClassType = document.querySelector('.post-classtype')
const postTeachWay = document.querySelector('.post-teachway')
const postFee = document.querySelector('.post-fee')
const postPhone = document.querySelector('.post-phone')
const postMail = document.querySelector('.post-mail')
const publishBtn = document.querySelector('.publish-btn')
const editBtn = document.querySelector('.edit-btn')
const modalOverlay = document.querySelector('.modal-overlay')

import { app } from './firebaseConfig.js'

// 存入 realtime database
import {
  getDatabase,
  ref,
  set,
  onValue,
  remove,
  get,
  update
} from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js'

// 預期儲存的節點
// "posts/" + id
function writePost(
  name,
  location,
  background,
  squareUrl,
  topic,
  preface,
  content,
  technology,
  totalDay,
  weekHour,
  classType,
  teachWay,
  fee,
  phone,
  mail
) {
  const postId = generateRandomId()
  const db = getDatabase(app)
  const createdTime = Date.now()
  set(ref(db, 'posts/' + postId), {
    name,
    city: location,
    rectangleUrl: background,
    squareUrl,
    topic,
    preface,
    content,
    technology,
    totalDay,
    weekHour,
    classType,
    teachWay,
    fee,
    phone,
    mail,
    uid: postId,
    createdTime
  })
}

// 更新 post
function updatePost(
  postId,
  name,
  location,
  background,
  squareUrl,
  topic,
  preface,
  content,
  technology,
  totalDay,
  weekHour,
  classType,
  teachWay,
  fee,
  phone,
  mail
) {
  const db = getDatabase(app)
  const postRef = ref(db, 'posts/' + postId)
  update(postRef, {
    name,
    city: location,
    rectangleUrl: background,
    squareUrl,
    topic,
    preface,
    content,
    technology,
    totalDay,
    weekHour,
    classType,
    teachWay,
    fee,
    phone,
    mail
  })
}

// 生成隨機 id
function generateRandomId() {
  let id =
    '-' +
    Math.random().toString(36).slice(2, 7) +
    Date.now().toString(36).slice(2, 7)
  return id
}

form.addEventListener('submit', event => {
  event.preventDefault()
  const postId = form.dataset.id || null
  const postData = {
    name: postName.value,
    location: postLocation.value,
    background: postBackground.value,
    squareUrl: postSquareUrl.value,
    topic: postTopic.value,
    preface: postPreface.value,
    content: postContent.value,
    technology: postTechnology.value,
    totalDay: postTotalDay.value,
    weekHour: postWeekHour.value,
    classType: postClassType.value,
    teachWay: postTeachWay.value,
    fee: postFee.value,
    phone: postPhone.value,
    mail: postMail.value
  }
  if (postId) {
    updatePost(postId, ...Object.values(postData))
  } else {
    writePost(...Object.values(postData))
  }

  form.reset()
  formContainer.style.display = 'none'
  modalOverlay.style.display = 'none'
})

function renderPostList() {
  const db = getDatabase(app)
  const postRef = ref(db, 'posts/')
  onValue(postRef, snapshot => {
    postList.innerHTML = ''
    const classArray = Object.values(snapshot.val())
    let template = ``
    classArray.forEach(item => {
      template = `<div class="post-list-class">
              <h3 class="className">${item.name}</h3>
              <div class="post-btns">
                <button class="btn-primary post-btn-edit" data-id="${item.uid}">編輯</button>
                <button class="btn-primary post-btn-del" data-id="${item.uid}">刪除</button>
              </div>
            </div>`
      postList.innerHTML += template
    })
  })
}
renderPostList()

function deletePost(postId) {
  const db = getDatabase(app)
  const postRef = ref(db, `posts/${postId}`)
  remove(postRef)
    .then(() => {
      alert('貼文已成功刪除')
      renderPostList()
    })
    .catch(error => {
      console.error('刪除貼文失敗:', error)
    })
}

publishBtn.addEventListener('click', () => {
  formContainer.style.display = 'block'
  modalOverlay.style.display = 'block'
})

editBtn.addEventListener('click', () => {
  formContainer.style.display = 'none'
  postList.style.display = 'block'
})

modalOverlay.addEventListener('click', () => {
  formContainer.style.display = 'none'
  // 表格內文字清空
  form.reset()
  delete form.dataset.id
})

postList.addEventListener('click', e => {
  const postId = e.target.getAttribute('data-id')
  if (e.target.classList.contains('post-btn-del')) {
    deletePost(postId)
  } else if (e.target.classList.contains('post-btn-edit')) {
    const db = getDatabase(app)
    const postRef = ref(db, `posts/${postId}`)

    form.dataset.id = postId
    formContainer.style.display = 'block'
    modalOverlay.style.display = 'block'

    get(postRef).then(snapshot => {
      const post = snapshot.val()
      postName.value = post.name
      postLocation.value = post.city
      postBackground.value = post.rectangleUrl
      postSquareUrl.value = post.squareUrl
      postTopic.value = post.topic
      postPreface.value = post.preface
      postContent.value = post.content
      postTechnology.value = post.technology
      postTotalDay.value = post.totalDay
      postWeekHour.value = post.weekHour
      postClassType.value = post.classType
      postTeachWay.value = post.teachWay
      postFee.value = post.fee
      postPhone.value = post.phone
      postMail.value = post.mail
    })
  }
})
