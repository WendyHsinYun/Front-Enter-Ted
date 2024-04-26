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
            <a href="content.html?id=${item.creatTime}">
              <img src="images/location_icon_one.png" class="location-icon">
            </a>
            <p class="location">${item.city}</p>
          </div>
          <div class="card-content">
            <a href="content.html?id=${item.creatTime}">
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
