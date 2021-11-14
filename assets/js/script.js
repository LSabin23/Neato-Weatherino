// Open Weather API Key: f8bdae7d507d571fec219a255946d59e

var searchFormEl = document.querySelector('#search-form')
var cityInputEl = document.querySelector('#city')
var previousCitiesEl = document.querySelector('#previous-cities')
var currentDayHeadingEl = document.querySelector('#current-day-heading')
var currentDayContentEl = document.querySelector('#current-day-content')
var futureWeatherEl = document.querySelector('#five-day-forecast')

// if 'cities' doesn't exist in localStorage set var to empty array instead
var savedCitiesList = JSON.parse(localStorage.getItem('cities')) || []

// START OPEN WEATHER API CALL
var getCurrentWeather = function (city) {
  var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=f8bdae7d507d571fec219a255946d59e'
  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      displayWeather(data, city)
    })
  })
}
// END OPEN WEATHER API CALL

// START LOAD SAVED CITIES
var loadSavedCities = function () {
  if (savedCitiesList.length === 0) {
    previousCitiesEl.textContent = 'No saved city data available.'
  } else {
    console.log('Saved cities exist.')
    previousCitiesEl.textContent = ''
    for (var i = 0; i < savedCitiesList.length; i++) {
      var prevCityBtnEl = document.createElement('button')
      prevCityBtnEl.classList.add('btn-block', 'rounded', 'btn-secondary', 'w-100', 'mb-2', 'prev-city-btn')
      prevCityBtnEl.textContent = savedCitiesList[i]

      previousCitiesEl.appendChild(prevCityBtnEl)
    }
  }
}
// END LOAD SAVED CITIES

// START SEARCH FORM SUBMISSION HANDLER
var formSubmitHandler = function (event) {
  event.preventDefault()
  var cityName = cityInputEl.value.trim()

  if (cityName) {
    getCurrentWeather(cityName)
    saveCityName(cityName)
    loadSavedCities()
    cityInputEl.value = ''
  } else {
    alert('Please enter a city name.')
  }
}
// END SEARCH FORM SUBMISSION HANDLER

// START SAVE CITY NAME TO LOCAL STORAGE
var saveCityName = function (cityName) {
  savedCitiesList.push(cityName)
  localStorage.setItem('cities', JSON.stringify(savedCitiesList))
}
// END SAVE CITY NAME TO LOCAL STORAGE

// START FORECAST CARDS
var createForecastCards = function (oneCallUrl) {
  fetch(oneCallUrl).then(function (response) {
    response.json().then(function (data) {
      console.log(data)
      // clear futureWeatherEl to add new content
      futureWeatherEl.innerHTML = ''

      for (var i = 1; i < 6; i++) {
        // create card element
        var cardEl = document.createElement('div')
        cardEl.classList.add('bg-primary', 'bg-gradient', 'text-white', 'col-2', 'mx-auto', 'px-auto', 'rounded')

        // create date element
        var cardTitle = document.createElement('h5')

        // convert Unix timestamp to readable date
        var cardUnixTimestamp = data.daily[i].dt
        var cardMillUnixValue = cardUnixTimestamp * 1000
        var cardDate = new Date(cardMillUnixValue).toLocaleDateString()

        // display date on card
        cardTitle.textContent = cardDate
        cardEl.appendChild(cardTitle)

        // display icon
        var cardIcon = 'http://openweathermap.org/img/wn/' + data.daily[i].weather[0].icon + '@2x.png'
        var cardImgEl = document.createElement('img')
        cardImgEl.setAttribute('src', cardIcon)
        cardEl.appendChild(cardImgEl)

        // display temp
        var cardTempEl = document.createElement('p')
        cardTempEl.textContent = 'Temp: ' + data.daily[i].temp.day + '°F'
        cardEl.appendChild(cardTempEl)

        // display wind
        var cardWindEl = document.createElement('p')
        cardWindEl.textContent = 'Wind: ' + data.daily[i].wind_speed + 'mph'
        cardEl.appendChild(cardWindEl)

        // display humidity
        var cardHumidEl = document.createElement('p')
        cardHumidEl.textContent = 'Humidity: ' + data.daily[i].humidity + '%'
        cardEl.appendChild(cardHumidEl)

        // append entire card element to five day forecast container
        futureWeatherEl.appendChild(cardEl)
      }
    })
  })
}
// END FORECAST CARDS

// START CURRENT DAY
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

  // clear data then add new city name, date, and icon to current day element
  currentDayHeadingEl.textContent = ''
  currentDayHeadingEl.textContent = city + ' ' + dateObject

  currentDayHeadingEl.appendChild(iconImageEl)

  // clear currentDayContentEl to add new content
  currentDayContentEl.innerHTML = ''

  // create temp element, add 'Temp: main.temp' text, append temp element to currentDayEl
  var currentTempEl = document.createElement('p')
  currentTempEl.textContent = 'Temp: ' + weather.main.temp + '°F'
  currentDayContentEl.appendChild(currentTempEl)

  // create wind speed element, add 'Wind: wind.speed' text, append wind element to currentDayEl
  var currentWindEl = document.createElement('p')
  currentWindEl.textContent = 'Wind: ' + weather.wind.speed + 'mph'
  currentDayContentEl.appendChild(currentWindEl)

  // create humidity element, add 'Humidity: main.humidity' text, append humidity element to currentDayEl
  var currentHumidEl = document.createElement('p')
  currentHumidEl.textContent = 'Humidity: ' + weather.main.humidity + '%'
  currentDayContentEl.appendChild(currentHumidEl)

  // create UV index element, send coord.lat and coord.lon to OneWeather again to retrieve UV index, add 'UV Index: response' text, append UV index element to currentDayEl
  var currentCityLat = weather.coord.lat
  var currentCityLon = weather.coord.lon
  var currentUviEl = document.createElement('p')
  currentUviEl.classList.add('rounded')

  var oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + currentCityLat + '&lon=' + currentCityLon + '&units=imperial&appid=f8bdae7d507d571fec219a255946d59e'
  fetch(oneCallUrl).then(function (response) {
    response.json().then(function (data) {
      var UvIndexVal = data.current.uvi
      currentUviEl.textContent = 'UV index: ' + UvIndexVal

      // add color indicator to UV Index
      if (UvIndexVal < 3) {
        currentUviEl.classList.add('favorable')
        currentUviEl.classList.remove('moderate', 'severe')
      } else if (UvIndexVal >= 3 && UvIndexVal <= 7) {
        currentUviEl.classList.add('moderate')
        currentUviEl.classList.remove('favorable', 'severe')
      } else {
        currentUviEl.classList.add('severe')
        currentUviEl.classList.remove('moderate', 'favorable')
      }
      currentDayContentEl.appendChild(currentUviEl)
    })
  })

  createForecastCards(oneCallUrl)
}
// END CURRENT DAY

// START PREVIOUS CITY BUTTON CLICK FUNCTION
var prevCityBtnHandler = function (event) {
  var btnName = event.target.textContent
  getCurrentWeather(btnName)
}
// END PREVIOUS CITY BUTTON CLICK FUNCTION

searchFormEl.addEventListener('submit', formSubmitHandler)
previousCitiesEl.addEventListener('click', prevCityBtnHandler)
loadSavedCities()
