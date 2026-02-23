// Координаты польских городов
const cities = {
  krakow: { name: 'Краков', lat: 50.0647, lon: 19.9450 },
  warsaw: { name: 'Варшава', lat: 52.2297, lon: 21.0122 },
  gdansk: { name: 'Гданьск', lat: 54.3520, lon: 18.6466 },
  wroclaw: { name: 'Вроцлав', lat: 51.1079, lon: 17.0385 },
  poznan: { name: 'Познань', lat: 52.4064, lon: 16.9252 },
  lodz: { name: 'Лодзь', lat: 51.7592, lon: 19.4550 },
  lublin: { name: 'Люблин', lat: 51.2465, lon: 22.5689 },
  bydgoszcz: { name: 'Быдгощ', lat: 53.0085, lon: 18.0408 }
};

// Текущие координаты
export let currentLat = cities.krakow.lat;
export let currentLon = cities.krakow.lon;
export let currentCityName = cities.krakow.name;

// Коды погоды WMO -> описание
const weatherCodes = {
  0: 'Ясно',
  1: 'Преимущественно ясно',
  2: 'Переменная облачность',
  3: 'Пасмурно',
  45: 'Туман',
  48: 'Туман',
  51: 'Морось',
  53: 'Морось',
  55: 'Морось',
  61: 'Дождь',
  63: 'Дождь',
  65: 'Сильный дождь',
  71: 'Снег',
  73: 'Снег',
  75: 'Сильный снег',
  80: 'Дождь с грозами',
  81: 'Дождь с грозами',
  82: 'Сильный дождь с грозами',
  95: 'Гроза',
  96: 'Гроза с градом',
  99: 'Сильная гроза с градом'
};

// Иконки погоды для hourly forecast
const weatherIcons = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
  45: '🌫️', 48: '🌫️',
  51: '🌧️', 53: '🌧️', 55: '🌧️',
  61: '🌧️', 63: '🌧️', 65: '🌧️',
  71: '❄️', 73: '❄️', 75: '❄️',
  80: '⛈️', 81: '⛈️', 82: '⛈️',
  95: '⚡', 96: '⚡', 99: '⚡'
};

// Функция создания анимированных эффектов погоды
export function createWeatherEffects(weatherCode) {
  const container = document.getElementById('weather-effects');
  container.innerHTML = '';
  
  if (weatherCode === 0 || weatherCode === 1) {
    const sunRays = document.createElement('div');
    sunRays.className = 'sun-rays';
    sunRays.innerHTML = '<div class="sun"></div>' + 
      '<div class="ray"></div>'.repeat(12);
    container.appendChild(sunRays);
    createClouds(container);
  } else if (weatherCode === 2 || weatherCode === 3) {
    createClouds(container);
  } else if (weatherCode >= 45 && weatherCode <= 48) {
    for (let i = 1; i <= 3; i++) {
      const fog = document.createElement('div');
      fog.className = 'fog fog-' + i;
      container.appendChild(fog);
    }
  } else if ((weatherCode >= 51 && weatherCode <= 55) || (weatherCode >= 61 && weatherCode <= 82)) {
    createRain(container);
    createClouds(container);
  } else if (weatherCode >= 95 && weatherCode <= 99) {
    const lightning = document.createElement('div');
    lightning.className = 'lightning';
    container.appendChild(lightning);
    createRain(container);
  } else if (weatherCode >= 71 && weatherCode <= 75) {
    createSnow(container);
    createClouds(container);
  } else {
    createClouds(container);
  }
}

function createClouds(container) {
  for (let i = 1; i <= 3; i++) {
    const cloud = document.createElement('div');
    cloud.className = 'cloud cloud-' + i;
    container.appendChild(cloud);
  }
}

function createRain(container) {
  for (let i = 0; i < 50; i++) {
    const drop = document.createElement('div');
    drop.className = 'rain-drop';
    drop.style.left = (Math.random() * 100) + '%';
    drop.style.animationDuration = (0.5 + Math.random() * 0.5) + 's';
    drop.style.animationDelay = (Math.random() * 2) + 's';
    drop.style.opacity = 0.3 + Math.random() * 0.7;
    container.appendChild(drop);
  }
}

function createSnow(container) {
  for (let i = 0; i < 50; i++) {
    const flake = document.createElement('div');
    flake.className = 'snowflake';
    flake.style.left = (Math.random() * 100) + '%';
    flake.style.animationDuration = (3 + Math.random() * 4) + 's';
    flake.style.animationDelay = (Math.random() * 5) + 's';
    const size = 5 + Math.random() * 10;
    flake.style.width = size + 'px';
    flake.style.height = size + 'px';
    flake.style.opacity = 0.5 + Math.random() * 0.5;
    container.appendChild(flake);
  }
}

// Функция установки фона в зависимости от погоды
export function setWeatherBackground(weatherCode) {
  const body = document.body;
  body.classList.remove('weather-clear', 'weather-cloudy', 'weather-rain', 'weather-snow', 'weather-thunder', 'weather-fog');
  
  if (weatherCode === 0 || weatherCode === 1) {
    body.classList.add('weather-clear');
  } else if (weatherCode === 2 || weatherCode === 3) {
    body.classList.add('weather-cloudy');
  } else if (weatherCode >= 45 && weatherCode <= 48) {
    body.classList.add('weather-fog');
  } else if (weatherCode >= 51 && weatherCode <= 55) {
    body.classList.add('weather-rain');
  } else if (weatherCode >= 61 && weatherCode <= 82) {
    body.classList.add('weather-rain');
  } else if (weatherCode >= 95 && weatherCode <= 99) {
    body.classList.add('weather-thunder');
  } else if (weatherCode >= 71 && weatherCode <= 75) {
    body.classList.add('weather-snow');
  } else {
    body.classList.add('weather-cloudy');
  }
}

// Функция отображения прогноза на 5 часов
function displayHourlyForecast(hourlyData) {
  const hourlyList = document.getElementById('hourly-list');
  hourlyList.innerHTML = '';
  
  const times = hourlyData.time.slice(0, 5);
  const temps = hourlyData.temperature_2m.slice(0, 5);
  const codes = hourlyData.weather_code.slice(0, 5);
  
  for (let i = 0; i < times.length; i++) {
    const date = new Date(times[i]);
    const hours = date.getHours().toString().padStart(2, '0') + ':00';
    
    const item = document.createElement('div');
    item.className = 'hourly-item';
    item.innerHTML = `
      <div class="hourly-time">${hours}</div>
      <div class="hourly-icon">${weatherIcons[codes[i]] || '☁️'}</div>
      <div class="hourly-temp">${Math.round(temps[i])}°</div>
    `;
    hourlyList.appendChild(item);
  }
}

// Функция получения погоды
export async function fetchWeather(lat, lon, cityName) {
  const descriptionEl = document.getElementById('description');
  const tempEl = document.getElementById('temp');
  const humidityEl = document.getElementById('humidity');
  const windEl = document.getElementById('wind');
  const cityNameEl = document.getElementById('city-name');
  
  descriptionEl.textContent = 'Загрузка...';
  
  try {
    const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&forecast_days=1`;
    
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error('Ошибка сети');
    }
    
    const data = await response.json();
    const current = data.current;
    
    cityNameEl.textContent = cityName;
    tempEl.textContent = Math.round(current.temperature_2m);
    
    const weatherCode = current.weather_code;
    descriptionEl.textContent = weatherCodes[weatherCode] || 'Неизвестно';
    
    setWeatherBackground(weatherCode);
    createWeatherEffects(weatherCode);
    
    // Отображение hourly forecast
    if (data.hourly) {
      displayHourlyForecast(data.hourly);
    }
    
    // GSAP анимация при смене погоды
    if (typeof gsap !== 'undefined') {
      gsap.fromTo('.temperature', 
        { scale: 1.2, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );
    }
    
    humidityEl.textContent = current.relative_humidity_2m;
    windEl.textContent = Math.round(current.wind_speed_10m * 3.6);
    
  } catch (error) {
    console.error('Ошибка:', error);
    descriptionEl.textContent = 'Ошибка загрузки данных';
    tempEl.textContent = '--';
    humidityEl.textContent = '--';
    windEl.textContent = '--';
  }
}

// Инициализация погоды
export function initWeather() {
  // Обработчик выбора города
  document.getElementById('city-select').addEventListener('change', function(e) {
    const cityKey = e.target.value;
    const city = cities[cityKey];
    currentLat = city.lat;
    currentLon = city.lon;
    currentCityName = city.name;
    fetchWeather(currentLat, currentLon, currentCityName);
    
    // Обновляем карту если она открыта
    if (typeof updateMapView === 'function') {
      updateMapView(currentLat, currentLon);
    }
  });

  // Обработчик GPS
  document.getElementById('gps-btn').addEventListener('click', function() {
    const gpsBtn = this;
    gpsBtn.classList.add('active');
    
    if (!navigator.geolocation) {
      alert('Геолокация не поддерживается вашим браузером');
      gpsBtn.classList.remove('active');
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      function(position) {
        currentLat = position.coords.latitude;
        currentLon = position.coords.longitude;
        currentCityName = 'Ваше местоположение';
        document.getElementById('city-select').value = '';
        fetchWeather(currentLat, currentLon, currentCityName);
        gpsBtn.classList.remove('active');
        
        // Обновляем карту если она открыта
        if (typeof updateMapView === 'function') {
          updateMapView(currentLat, currentLon);
        }
      },
      function(error) {
        alert('Не удалось определить местоположение');
        gpsBtn.classList.remove('active');
      }
    );
  });

  // Обновление при нажатии кнопки
  document.getElementById('refresh-btn').addEventListener('click', function() {
    fetchWeather(currentLat, currentLon, currentCityName);
  });

  // Загрузка погоды при открытии
  fetchWeather(currentLat, currentLon, currentCityName);
}
