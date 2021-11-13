// Open Weather API Key: f8bdae7d507d571fec219a255946d59e

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

var createForecastCards = function (oneCallUrl) {
  fetch(oneCallUrl).then(function (response) {
    response.json().then(function (data) {
      console.log(data)
      for (var i = 0; i < 6; i++) {
        // create card element
        var cardEl = document.createElement('div')
        cardEl.classList.add('bg-secondary')

        // display date
        var cardTitle = document.createElement('h5')
        cardTitle.textContent = data.daily[i].dt
        cardEl.appendChild(cardTitle)

        // display icon
        var cardIcon = 'http://openweathermap.org/img/wn/' + data.daily[i].weather[i].icon + '@2x.png'
        var cardImgEl = document.createElement('img')
        cardImgEl.setAttribute('src', cardIcon)
        cardEl.appendChild(cardImgEl)

        // display temp
        var cardTempEl = document.createElement('p')
        cardTempEl.textContent = data.daily[i].temp.day + '°F'
        cardEl.appendChild(cardTempEl)

        // display wind
        var cardWindEl = document.createElement('p')
        cardWindEl.textContent = data.daily[i].wind_speed + 'mph'
        cardEl.appendChild(cardWindEl)

        // display humidity
        var cardHumidEl = document.createElement('p')
        cardHumidEl.textContent = data.daily[i].humidity + '%'
        cardEl.appendChild(cardHumidEl)

        // append entire card element to five day forecast container
        futureWeatherEl.appendChild(cardEl)
      }
    })
  })
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

  // create temp element, add 'Temp: main.temp' text, append temp element to currentDayEl
  var currentTempEl = document.createElement('p')
  currentTempEl.textContent = 'Temp: ' + weather.main.temp + '°F'
  currentDayEl.appendChild(currentTempEl)

  // create wind speed element, add 'Wind: wind.speed' text, append wind element to currentDayEl
  var currentWindEl = document.createElement('p')
  currentWindEl.textContent = 'Wind: ' + weather.wind.speed + 'mph'
  currentDayEl.appendChild(currentWindEl)

  // create humidity element, add 'Humidity: main.humidity' text, append humidity element to currentDayEl
  var currentHumidEl = document.createElement('p')
  currentHumidEl.textContent = 'Humidity: ' + weather.main.humidity + '%'
  currentDayEl.appendChild(currentHumidEl)

  // create UV index element, send coord.lat and coord.lon to OneWeather again to retrieve UV index, add 'UV Index: response' text, append UV index element to currentDayEl
  var currentCityLat = weather.coord.lat
  var currentCityLon = weather.coord.lon
  var currentUviEl = document.createElement('p')

  var oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + currentCityLat + '&lon=' + currentCityLon + '&units=imperial&appid=f8bdae7d507d571fec219a255946d59e'
  fetch(oneCallUrl).then(function (response) {
    response.json().then(function (data) {
      var UvIndexVal = data.current.uvi
      currentUviEl.textContent = 'UV index: ' + UvIndexVal

      if (UvIndexVal <= 2) {
        currentUviEl.classList.add('favorable')
        currentUviEl.classList.remove('moderate', 'severe')
      } else if (UvIndexVal >= 3 || UvIndexVal <= 7) {
        currentUviEl.classList.add('moderate')
        currentUviEl.classList.remove('favorable', 'severe')
      } else {
        currentUviEl.classList.add('severe')
        currentUviEl.classList.remove('moderate', 'favorable')
      }
      currentDayEl.appendChild(currentUviEl)
    })
  })

  createForecastCards(oneCallUrl)
}

searchFormEl.addEventListener('submit', formSubmitHandler)
