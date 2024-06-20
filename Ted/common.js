const main = document.querySelector('main')
const topBtn = document.querySelector('.top-btn')
const loading = document.querySelector('.loading')
const testGo = document.querySelector('.test-img')
const openModal = document.querySelectorAll('.open-modal')
const checkBox = document.querySelector('#checkbox')
const keyword = document.querySelector('.keyword')
const voiceBtn = document.querySelector('.voice-btn')
const searchBtn = document.querySelector('.search-btn')

window.addEventListener('load', function () {
  loading.classList.add('loaded')
  testGo.classList.add('loaded')
  closeModal()
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

const questionData = [
  {
    number: 1,
    question: '選擇在哪座城市學習？',
    answer: ['台北', '台中', '高雄', '各地', '不重要']
  },
  {
    number: 2,
    question: '每月能撥出多少費用學習？',
    answer: ['3000元以下', '6000元內', '10000元內', '10001元以上', '不重要']
  },
  {
    number: 3,
    question: '每周能撥出多少時間學習？',
    answer: ['16小時以下', '30小時內', '45小時內', '46小時以上', '不重要']
  },
  {
    number: 4,
    question: '對班制的需求是？',
    answer: ['大班制', '小班制', '一對一', '不重要']
  },
  {
    number: 5,
    question: '喜歡什麼樣的教學方式？',
    answer: ['放養制', '手把手教制', '不重要']
  }
]

let articleList = []
let rawData = []

axios
  .get('./front-enter-export.json')
  .then(
    res => (
      (articleList = Object.values(res.data.article)),
      (rawData = [...articleList])
    )
  )
  .catch(error => console.error('加載 JSON 檔案時出錯:', error))

const testModal = document.querySelector('.test-modal')
const modalOverlay = document.querySelector('.modal-overlay')

// 打開測驗modal
function showModal() {
  testModal.style.display = 'block'
  modalOverlay.style.display = 'block'
}
function closeModal() {
  testModal.style.display = 'none'
  modalOverlay.style.display = 'none'
}

openModal.forEach(item => {
  item.addEventListener('click', showModal)
})
modalOverlay.addEventListener('click', closeModal)

const testRender = document.querySelector('.test-render')
const testStart = document.querySelector('.test-start')
let num = 0

// 顯示題目
function testCardRender(num) {
  let template = `
    <p class="test-question">${questionData[num].question}</p>
    <p class="question-number">${questionData[num].number}/5</p>`

  let answerTemplate = ``
  questionData[num].answer.forEach(function (item) {
    answerTemplate += `<button class="test-btn test-options">${item}</button>`
  })

  testRender.innerHTML = template + answerTemplate
}

// 顯示第一個題目
testStart.addEventListener('click', () => testCardRender(0))

// 記錄使用者選項
const userRecord = []
const userRecordObj = {}

// 切換題目並儲存使用者答案
testRender.addEventListener('click', e => {
  if (e.target.className.includes('test-options')) {
    userRecord.push(e.target.innerText)
    if (num < questionData.length - 1) {
      num += 1
      testCardRender(num)
    } else if ((num = questionData.length - 1)) {
      convertToUserRecordObject()

      const schoolScores = schoolScore(rawData, userRecordObj)
      const topSchool = findTopSchool(schoolScores)
      const target = rawData.filter(item => item.name === topSchool.schoolName)

      testRender.innerHTML = `
      <p class="test-question">你有多適合下列學校呢？</p>
      <div class="chart-container">
        <div class="chart-circle">
          <span class="chart-number"></span>
        </div>
      </div>
      <a class="chart-btn">? ? ?</a>`

      const chartCircle = document.querySelector('.chart-circle')
      const chartNumber = document.querySelector('.chart-number')
      const chartBtn = document.querySelector('.chart-btn')
      let value = 0
      let index = 0
      const interval = setInterval(() => {
        value = Math.floor(Math.random() * 41) + 40
        index = Math.floor(Math.random() * 9)
        chartNumber.textContent = `${value} %`
        chartBtn.textContent = `${rawData[index].name}`
        chartCircle.style.background = `conic-gradient(#00bcd4 30% ${value}%, #19D7D0 ${value}% 90%)`
      }, 300)

      setTimeout(() => {
        clearInterval(interval)
        let finalValue = topSchool.score * 20
        chartNumber.textContent = `${finalValue} %`
        chartBtn.textContent = `${topSchool.schoolName}`
        chartBtn.href = `content.html?id=${target[0].creatTime}`
        chartCircle.style.background = `conic-gradient(#00bcd4 0% ${finalValue}%, #19D7D0 ${finalValue}% 100%)`
      }, 3000)
    }
  }
})

// 整理取得的使用者數據 userRecord → userRecordObj
function convertToUserRecordObject() {
  if (userRecord[0] !== '不重要') {
    userRecordObj.city = userRecord[0]
  }
  if (userRecord[1] !== '不重要') {
    let feeData = userRecord[1].split('元')
    userRecordObj.fee = feeData[0]
  }
  if (userRecord[2] !== '不重要') {
    let hourData = userRecord[2].split('小')
    userRecordObj.weekHour = hourData[0]
  }
  if (userRecord[3] !== '不重要') {
    userRecordObj.classType = userRecord[3]
  }
  if (userRecord[4] !== '不重要') {
    userRecordObj.teachWay = userRecord[4]
  }
}

// 比對資料，符合的 +1 分
function compareObj(rawObj, recordObj) {
  let score = 0
  if (recordObj.city === rawObj.city) {
    score++
  }
  if (recordObj.fee === 10001) {
    score++
  } else if (recordObj.fee >= rawObj.fee) {
    score++
  }
  if (recordObj.weekHour === 46) {
    score++
  } else if (recordObj.weekHour >= rawObj.weekHour) {
    score++
  }
  if (recordObj.classType === rawObj.classType) {
    score++
  }
  if (recordObj.teachWay === rawObj.teachWay) {
    score++
  }
  return score
}

// 比對所有資料，取得所有學校的得分 [{ schoolName: score }]
function schoolScore(schools, recordObj) {
  let schoolScores = schools.map(school => {
    const score = compareObj(school, recordObj)
    return { schoolName: school.name, score }
  })
  return schoolScores
}

// 選出最高分的學校
function findTopSchool(schoolScores) {
  let school = schoolScores.reduce(
    (top, current) => {
      return current.score > top.score ? current : top
    },
    { school: null, score: 0 }
  )
  return school
}

// 登入
const openLogin = document.querySelector('.open-login')
const loginOverlay = document.querySelector('.login-overlay')
const login = document.querySelector('.log-in')

function showLoginModal() {
  loginOverlay.style.display = 'block'
  login.style.display = 'block'
}

function hideLoginModal() {
  loginOverlay.style.display = 'none'
  login.style.display = 'none'
}

openLogin.addEventListener('click', showLoginModal)

loginOverlay.addEventListener('click', hideLoginModal)

import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js'

import { auth } from './firebaseConfig.js'

// google 登入
const provider = new GoogleAuthProvider()
document.querySelector('.google-sign-in-btn').addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .then(result => {
      console.log('成功登入')
    })
    .catch(error => {
      console.log('登入失敗')
    })
})

const emailInput = document.querySelector('.email-input')
const pwdInput = document.querySelector('.pwd-input')
const signUp = document.querySelector('.sign-up')
const signIn = document.querySelector('.sign-in')
const navLogin = document.querySelector('.nav-login')

// 註冊
signUp.addEventListener('click', () => {
  const email = emailInput.value
  const password = pwdInput.value
  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      hideLoginModal()
    })
    .catch(error => {
      console.log('註冊失敗')
    })
})

// 一般登入
signIn.addEventListener('click', () => {
  const email = emailInput.value
  const password = pwdInput.value
  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      console.log('成功登入')
    })
    .catch(error => {
      console.log('登入失敗')
    })
})

// 登入狀態監聽
onAuthStateChanged(auth, user => {
  if (user) {
    changeLoginBtn(true, user)
    hideLoginModal()
  } else {
    changeLoginBtn(false)
  }
})

function changeLoginBtn(isLogin, user) {
  if (isLogin) {
    if (!user.photoURL) {
      user.photoURL =
        'https://gd-hbimg.huaban.com/e40d922474425c9ffae8f36e2f2495078ea6905b13c2-okJiuY_fw658webp'
    }
    navLogin.innerHTML = `<a href="./member.html"><img src='${user.photoURL}' alt="" class="nav-avatar"></a>`
  }
}
