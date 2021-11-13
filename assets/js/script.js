var searchFormEl = document.querySelector('#search-form')
var cityInputEl = document.querySelector('#city')

var getCurrentWeather = function (city) {
  var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=f8bdae7d507d571fec219a255946d59e'
  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      console.log(data)
    })
  })
}

var formSubmitHandler = function (event) {
  event.preventDefault()
  var cityName = cityInputEl.value.trim()

  if (cityName) {
    getCurrentWeather(cityName)
    cityInputEl.value = ''
  } else {
    alert('Please enter a city name.')
  }
}

searchFormEl.addEventListener('submit', formSubmitHandler)

// Open Weather API Key: f8bdae7d507d571fec219a255946d59e
