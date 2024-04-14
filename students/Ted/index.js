const topBtn = document.querySelector('.top-btn')
const loading = document.querySelector('.loading')
const testLoad = document.querySelector('.test-img')
const checkBox = document.querySelector('#checkbox')
const keyword = document.querySelector('.keyword')
const voiceBtn = document.querySelector('.voice-btn')
const searchBtn = document.querySelector('.search-btn')
const classType = document.querySelector('.class-type')
const cardPanel = document.querySelector('.card-panel')

let articleList = []
let searchData = []

axios
  .get('./front-enter-export.json')
  .then(
    res => (
      (articleList = Object.values(res.data.article)),
      (searchData = [...articleList]),
      cardRender(articleList)
    )
  )
  .catch(error => console.error('加載 JSON 檔案時出錯:', error))

function cardRender(data) {
  let template = ``
  if (data.length) {
    data.forEach(
      item =>
        (template += `
        <div class="card">
          <div class="favorite"></div>
          <div class="card-header">
            <img src="images/location_icon_one.png" class="location-icon">
            <p class="location">${item.city}</p>
          </div>
          <div class="card-content">
            <a href="#">
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

window.addEventListener('load', function () {
  loading.classList.add('loaded')
  testLoad.classList.add('loaded')
})

topBtn.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

classType.addEventListener('click', function (e) {
  if (e.target.tagName === 'LI') {
    classType.querySelector('.active').classList.remove('active')
    e.target.classList.add('active')
    searchData =
      e.target.innerText === '全部'
        ? [...articleList]
        : articleList.filter(item => item.classType === e.target.innerText)
    cardRender(searchData)
  }
})

cardPanel.addEventListener('click', function (e) {
  if (e.target.className === 'location') {
    searchData = searchData.filter(
      item => item.city === e.target.innerText || item.city === '各地'
    )
    cardRender(searchData)
  }
})

let slideIndex = 0
function slide() {
  const slides = document.querySelectorAll('.slide')
  slides[slideIndex].classList.remove('active')
  // slideIndex === slides.length - 1 ? (slideIndex = 0) : slideIndex + 1
  slideIndex = (slideIndex + 1) % slides.length
  slides[slideIndex].classList.add('active')
}
setInterval(slide, 5000)

function search() {
  let filterData = articleList.filter(item => item.name.includes(keyword.value))
  cardRender(filterData)
}

searchBtn.addEventListener('click', function () {
  search()
  checkBox.checked = false
  keyword.value = ''
})

// 語音輸入
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
const recognition = new SpeechRecognition()

recognition.lang = 'zh-TW'
recognition.interimResults = false
recognition.maxAlternatives = 1

function startDictation() {
  recognition.start()
  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript
    console.log(transcript)
    keyword.value = transcript
  }
  recognition.onerror = function (event) {
    console.error('語音識別錯誤', event.error)
  }
}

voiceBtn.addEventListener('click', startDictation)
