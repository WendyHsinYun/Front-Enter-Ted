const topBtn = document.querySelector('.topBtn')
const loading = document.querySelector('.loading')
const testLoad = document.querySelector('.test-img')

topBtn.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

window.addEventListener('load', function () {
  loading.classList.add('loaded')
  testLoad.classList.add('loaded')
})
