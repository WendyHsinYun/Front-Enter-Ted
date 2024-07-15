// 預計步驟
// 1. 解析網址的 query string
// 2. 取得資料
// 3. 比對 query string 與資料中的 creatTime
// 4. 取出符合的資料，放入 template 中

// 解析網址的 query string
const urlParams = new URLSearchParams(window.location.search).get('id')

import { app } from './firebaseConfig.js'
import {
  getDatabase,
  ref,
  onValue
} from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js'

let dataArray = []
let urlData = ''

const database = getDatabase(app)
const postRef = ref(database, 'posts/')
onValue(postRef, snapshot => {
  const data = snapshot.val()
  dataArray = data ? Object.values(data) : []
  urlData = dataArray.find(function (item) {
    return item.createdTime.toString() === urlParams
  })
  contentRender(urlData)
})

// 取得資料
// let articleList = []

// axios
//   .get('./front-enter-export.json')
//   .then(
//     res => (
//       (articleList = Object.values(res.data.article)),
//       // 比對 query string 與資料中的 creatTime
//       (urlData = articleList.find(function (item) {
//         return item.creatTime.toString() === urlParams
//       })),
//       contentRender(urlData)
//     )
//   )
//   .catch(error => console.error('加載 JSON 檔案時出錯:', error))

// 取出符合的資料，放入 template 中渲染出來

const contentPanel = document.querySelector('.content-panel')

function contentRender(data) {
  let template = ``
  template = `<div class="banner">
        <img src="${data.rectangleUrl}" alt="" class="banner-img">
        <h3 class="banner-text">${data.name}</h3>
      </div>
      <div class="content-box">
        <div class="content-img">
          <img src="images/2.jpg" alt="">
          <img src="images/3.jpg" alt="" class="hide-img">
          <img src="images/15.jpg" alt="" class="hide-img">
          <img src="images/5.jpg" alt="" class="hide-img">
          <img src="images/6.jpg" alt="" class="hide-img">
        </div>
        <div class="image-modal">
        <div class="left-arrow"></div>
        <div class="photo"><img src="images/2.jpg"></div>
        <div class="right-arrow"></div>
        </div>
        <div class="content-intro">
          <h3 class="intro-title">${data.topic}</h3>
          <p class="intro-text">${data.content}
          </p>
          <div class="table">
            <h3 class="table-title">整理</h3>
            <table class="table-content">
              <tbody>
                <tr>
                  <th>城市</th>
                  <td>${data.city}</td>
                </tr>
                <tr>
                  <th>班制</th>
                  <td>${data.classType}</td>
                </tr>
                <tr>
                  <th>教法</th>
                  <td>${data.teachWay}</td>
                </tr>
                <tr>
                  <th>天數</th>
                  <td>${data.totalDay}</td>
                </tr>
                <tr>
                  <th>週時</th>
                  <td>${data.weekHour}小時</td>
                </tr>
                <tr>
                  <th>技術</th>
                  <td>${data.technology}</td>
                </tr>
                <tr>
                  <th>信箱</th>
                  <td>${data.mail}</td>
                </tr>
                <tr>
                  <th>電話</th>
                  <td>${data.phone}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>`
  contentPanel.innerHTML = template
}

// 圖片 modal 實作
// 目標：
// 一、 呈現圖片
// 1. 為每張圖片設置監聽器，使被點擊後 modal 會顯示
// 2. 被點擊圖片的 src 屬性內容取代 modal 內圖片的 src 屬性內容

// 二、 切換圖片
// 將所有圖片路徑存成陣列，點擊箭頭時改變 index 數字，取得不同圖片的路徑

// 大問題：這些圖片的節點都要等到非同步資料處理完才抓得到，不然就是抓了個寂寞
// 想法一：非同步的部分分開渲染，圖片相關的 html 一開始就先寫在 html
// 想法二：重改 HTML 結構，但 CSS 也要重改
// 但這兩個想法用看的就想放棄了

// 最後運用事件委派的方法，在父元素上掛監聽器，再去確認點擊到的是什麼按鍵，該做什麼動作
let imageIndex = 0
contentPanel.addEventListener('click', function (e) {
  const imageArray = [...document.querySelectorAll('.content-img img')]
  const imageModal = document.querySelector('.image-modal')
  const image = document.querySelector('.image-modal img')

  if (e.target.matches('.content-img img')) {
    imageIndex = imageArray.findIndex(function (item) {
      return item.src === e.target.src
    })
    image.src = e.target.src
    imageModal.style.display = 'flex'
  }

  if (e.target.className === 'left-arrow') {
    imageIndex = (imageIndex + imageArray.length - 1) % imageArray.length
    image.src = imageArray[imageIndex].src
  } else if (e.target.className === 'right-arrow') {
    imageIndex = (imageIndex + 1) % imageArray.length
    image.src = imageArray[imageIndex].src
  }

  if (e.target.className === 'image-modal') {
    imageModal.style.display = 'none'
  }
})
