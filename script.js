document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.querySelector('.search_box button');
    const searchInput = document.querySelector('.search_box input');
    const cityListDiv = document.querySelector('.city-list');
  
    // Load search history from local storage upon page load
    loadSearchHistory();
  
    searchButton.addEventListener('click', function() {
      const city = searchInput.value.trim();
      if (city) {
        fetchWeatherData(city);
        saveToSearchHistory(city);
      }
    });
  
    cityListDiv.addEventListener('click', function(event) {
      if (event.target.tagName === 'BUTTON') {
        const city = event.target.textContent;
        searchInput.value = city;
        fetchWeatherData(city);
      }
    });
  });
  
  function fetchWeatherData(city) {
    fetchCurrentWeather(city);
    fetchWeatherForecast(city);
  }
  
  function fetchCurrentWeather(city) {
    const apiKey = '313578daa00ce443203335aee6b04ce0';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        displayCurrentWeather(data);
      })
      .catch(error => {
        console.error('Error fetching current weather:', error);
      });
  }
  
  function fetchWeatherForecast(city) {
    const apiKey = '313578daa00ce443203335aee6b04ce0';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        displayWeatherForecast(data);
      })
      .catch(error => {
        console.error('Error fetching weather forecast:', error);
      });
  }
  
  function displayCurrentWeather(data) {
    const currentWeatherDiv = document.querySelector('.current-weather');
    const weatherEmoji = getWeatherEmoji(data.weather[0].main);
    
    // current date and time
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    const currentTime = now.toLocaleString('en-US', options);
    
    currentWeatherDiv.innerHTML = `
      <h2>Current Weather in ${data.name} ${weatherEmoji}</h2>
      <p>${currentTime}</p>
      <p>Temperature: ${data.main.temp}°C</p>
      <p>Wind Speed: ${data.wind.speed} m/s</p>
      <p>Humidity: ${data.main.humidity}%</p>
    `;
  }
  
function displayWeatherForecast(data) {
    const forecastContainer = document.querySelector('.forecast-container');
    forecastContainer.innerHTML = ''; // Clear previous forecasts
    
    // Filter for midday forecasts
    const middayForecasts = data.list.filter(forecast => new Date(forecast.dt_txt).getUTCHours() === 12);
  
    middayForecasts.slice(0, 5).forEach(forecast => {
      const date = new Date(forecast.dt * 1000);
      const weatherEmoji = getWeatherEmoji(forecast.weather[0].main);
      const forecastDiv = document.createElement('div');
      forecastDiv.classList.add('forecast-box');
      forecastDiv.innerHTML = `
        <div class="forecast-date">${date.toLocaleDateString()}</div>
        <div class="weather-icon">${weatherEmoji}</div>
        <div class="forecast-temp">Temp: ${forecast.main.temp}°C</div>
        <div class="forecast-wind">Wind: ${forecast.wind.speed} m/s</div>
        <div class="forecast-humidity">Humidity: ${forecast.main.humidity}%</div>
      `;
      forecastContainer.appendChild(forecastDiv);
    });
  }


  
  function saveToSearchHistory(city) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searchHistory.includes(city)) {
      searchHistory.unshift(city);
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory.slice(0, 5))); // Limit history to 5 entries
      displaySearchHistory();
    }
  }
  
  function loadSearchHistory() {
    displaySearchHistory();
  }
  
  function displaySearchHistory() {
    const cityListDiv = document.querySelector('.city-list');
    cityListDiv.innerHTML = '';
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.forEach(city => {
      addCityToHistory(city);
    });
  }
  
  function addCityToHistory(city) {
    const cityListDiv = document.querySelector('.city-list');
    const cityButton = document.createElement('button');
    cityButton.textContent = city;
    cityButton.classList.add('city-btn');
    cityListDiv.appendChild(cityButton);
  }
  
  function getWeatherEmoji(main) {
    const weatherConditions = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Snow': '❄️',
      'Thunderstorm': '⛈️',
      'Drizzle': '🌦️',
      'Mist': '🌫️',
      'Smoke': '💨',
      'Haze': '🌫️',
      'Dust': '💨',
      'Fog': '🌫️',
      'Sand': '💨',
      'Ash': '💨',
      'Squall': '🌬️',
      'Tornado': '🌪️'
    };
    return weatherConditions[main] || '🔆'; // Default emoji
  }
  