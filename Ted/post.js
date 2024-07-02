// 取得 input 資料
const form = document.querySelector('#post-form')
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

import { app } from './firebaseConfig.js'

// 存入 realtime database
import {
  getDatabase,
  ref,
  set
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
  set(ref(db, 'posts/' + postId), {
    name,
    location,
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
  writePost(
    postName.value,
    postLocation.value,
    postBackground.value,
    postSquareUrl.value,
    postTopic.value,
    postPreface.value,
    postContent.value,
    postTechnology.value,
    postTotalDay.value,
    postWeekHour.value,
    postClassType.value,
    postTeachWay.value,
    postFee.value,
    postPhone.value,
    postMail.value
  )
  form.reset()
})

publishBtn.addEventListener('click', () => {
  postList.style.display = 'none'
  form.style.display = 'grid'
})

editBtn.addEventListener('click', () => {
  form.style.display = 'none'
  postList.style.display = 'block'
})
