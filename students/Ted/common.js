const topBtn = document.querySelector('.top-btn')
const loading = document.querySelector('.loading')
const testLoad = document.querySelector('.test-img')
const checkBox = document.querySelector('#checkbox')
const keyword = document.querySelector('.keyword')
const voiceBtn = document.querySelector('.voice-btn')
const searchBtn = document.querySelector('.search-btn')

window.addEventListener('load', function () {
  loading.classList.add('loaded')
  testLoad.classList.add('loaded')
})

topBtn.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

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
