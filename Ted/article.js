import { app, auth } from './firebaseConfig.js'
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js'
import {
  getDatabase,
  ref,
  onValue
} from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js'

const classType = document.querySelector('.class-type')
const cardPanel = document.querySelector('.card-panel')
const database = getDatabase(app)
const postRef = ref(database, 'posts/')

let isUserLoggedIn = false

let dataArray = []
let searchArray = []

onValue(postRef, snapshot => {
  const data = snapshot.val()
  dataArray = data ? Object.values(data) : []
  cardRender(dataArray)
  isHash()
})

onAuthStateChanged(auth, user => {
  if (user) {
    isUserLoggedIn = true
  } else {
    isUserLoggedIn = false
  }
  cardRender(dataArray)
})

function isHash() {
  let hash = decodeURIComponent(location.hash.substring(1))
  if (hash) {
    let searchArray = dataArray.filter(item => item.name.includes(hash))
    cardRender(searchArray)
  } else {
    cardRender(dataArray)
  }
}

window.onhashchange = isHash

function cardRender(data) {
  let template = ``
  if (data.length) {
    data.forEach(
      item =>
        (template += `
        <div class="card">
          <div class="favorite">${
            isUserLoggedIn
              ? `<i class="${
                  favoriteCards(item.name) ? 'fa-solid' : 'fa-regular'
                } fa-heart"></i>`
              : ''
          }</div>
          <div class="card-header">
            <a href="content.html?id=${item.createdTime}">
              <img src="images/location_icon_one.png" class="location-icon">
            </a>
            <p class="location">${item.city}</p>
          </div>
          <div class="card-content">
            <a href="content.html?id=${item.createdTime}">
              <div class="img-container">
                <img
                  src="${item.squareUrl}"
                  alt="" class="card-img">
              </div>
              <h4>${item.name}</h4>
              <p>${item.preface}</p>
              <div class="card-text">
                <span class="read-more">read more</span>
                <span class="card-arrow"></span>
              </div>
            </a>
          </div>
        </div>
        `)
    )
  } else {
    template = `
    <h3 class="wrong-msg">沒有相關的資料</h3>
    `
  }
  cardPanel.innerHTML = template
}

classType.addEventListener('click', function (e) {
  if (e.target.tagName === 'LI') {
    classType.querySelector('.active').classList.remove('active')
    e.target.classList.add('active')
    searchArray =
      e.target.innerText === '全部'
        ? [...dataArray]
        : dataArray.filter(item => item.classType === e.target.innerText)
    cardRender(searchArray)
  }
})

cardPanel.addEventListener('click', function (e) {
  if (e.target.className === 'location') {
    searchArray = searchArray.filter(
      item => item.city === e.target.innerText || item.city === '各地'
    )
    cardRender(searchArray)
  }
  if (e.target.classList.contains('fa-heart')) {
    const card = e.target.closest('.card')
    const name = card.querySelector('h4').innerText
    const img = card.querySelector('.img-container img').src
    const href = card.querySelector('.card-content a').href

    e.target.classList.toggle('fa-regular')
    e.target.classList.toggle('fa-solid')

    if (e.target.classList.contains('fa-solid')) {
      addToCollect({ name, img, href })
    } else {
      removeFromCollect(name)
    }
  }
})

function addToCollect(item) {
  let collection = JSON.parse(localStorage.getItem('collection')) || []
  collection.push(item)
  localStorage.setItem('collection', JSON.stringify(collection))
}

function removeFromCollect(name) {
  let collection = JSON.parse(localStorage.getItem('collection')) || []
  collection = collection.filter(item => item.name !== name)
  localStorage.setItem('collection', JSON.stringify(collection))
}

function favoriteCards(name) {
  let favorites = JSON.parse(localStorage.getItem('collection')) || []
  return favorites.some(item => item.name === name)
}

favoriteCards()

let slideIndex = 0
function slide() {
  const slides = document.querySelectorAll('.slide')
  slides[slideIndex].classList.remove('active')
  // slideIndex === slides.length - 1 ? (slideIndex = 0) : slideIndex + 1
  slideIndex = (slideIndex + 1) % slides.length
  slides[slideIndex].classList.add('active')
}
setInterval(slide, 5000)
