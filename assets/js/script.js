var searchFormEl = document.querySelector('#search-form')
var cityInputEl = document.querySelector('#city')
var weatherContainerEl = document.querySelector('#weather-container')
var currentDayEl = document.querySelector('#current-day')
var futureWeatherEl = document.querySelector('#five-day-forecast')

var getCurrentWeather = function (city) {
  var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=f8bdae7d507d571fec219a255946d59e'
  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      displayWeather(data, city)
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

var displayWeather = function (weather, city) {
  console.log(weather)

  // get icon url, create image element, add icon url as src
  var weatherIcon = 'http://openweathermap.org/img/wn/' + weather.weather[0].icon + '@2x.png'
  var iconImageEl = document.createElement('img')
  iconImageEl.setAttribute('src', weatherIcon)

  // format unix date into human readable date
  var unixTimestamp = weather.dt
  var millUnixValue = unixTimestamp * 1000
  var dateObject = new Date(millUnixValue).toLocaleDateString()

  currentDayEl.textContent = ''
  currentDayEl.textContent = city + ' ' + dateObject

  currentDayEl.appendChild(iconImageEl)
}

searchFormEl.addEventListener('submit', formSubmitHandler)

// Open Weather API Key: f8bdae7d507d571fec219a255946d59e
