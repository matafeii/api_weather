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
let currentLat = cities.krakow.lat;
let currentLon = cities.krakow.lon;
let currentCityName = cities.krakow.name;

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

// Функция создания анимированных эффектов погоды
function createWeatherEffects(weatherCode) {
  const container = document.getElementById('weather-effects');
  container.innerHTML = '';
  
  if (weatherCode === 0 || weatherCode === 1) {
    // Ясно - солнце
    const sunRays = document.createElement('div');
    sunRays.className = 'sun-rays';
    sunRays.innerHTML = '<div class="sun"></div><div class="ray"></div><div class="ray"></div><div class="ray"></div><div class="ray"></div><div class="ray"></div><div class="ray"></div><div class="ray"></div><div class="ray"></div><div class="ray"></div><div class="ray"></div><div class="ray"></div>';
    container.appendChild(sunRays);
    createClouds(container);
  } else if (weatherCode === 2 || weatherCode === 3) {
    // Облачно
    createClouds(container);
  } else if (weatherCode >= 45 && weatherCode <= 48) {
    // Туман
    for (let i = 1; i <= 3; i++) {
      const fog = document.createElement('div');
      fog.className = 'fog fog-' + i;
      container.appendChild(fog);
    }
  } else if ((weatherCode >= 51 && weatherCode <= 55) || (weatherCode >= 61 && weatherCode <= 82)) {
    // Дождь
    createRain(container);
    createClouds(container);
  } else if (weatherCode >= 95 && weatherCode <= 99) {
    // Гроза
    const lightning = document.createElement('div');
    lightning.className = 'lightning';
    container.appendChild(lightning);
    createRain(container);
  } else if (weatherCode >= 71 && weatherCode <= 75) {
    // Снег
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
function setWeatherBackground(weatherCode) {
  const body = document.body;
  
  // Удаляем все классы погоды
  body.classList.remove('weather-clear', 'weather-cloudy', 'weather-rain', 'weather-snow', 'weather-thunder', 'weather-fog');
  
  // Определяем класс фона
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

// Функция получения погоды
async function fetchWeather(lat, lon, cityName) {
  const descriptionEl = document.getElementById('description');
  const tempEl = document.getElementById('temp');
  const humidityEl = document.getElementById('humidity');
  const windEl = document.getElementById('wind');
  const cityNameEl = document.getElementById('city-name');
  
  descriptionEl.textContent = 'Загрузка...';
  
  try {
    const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
    
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error('Ошибка сети');
    }
    
    const data = await response.json();
    const current = data.current;
    
    // Название города
    cityNameEl.textContent = cityName;
    
    // Температура
    tempEl.textContent = Math.round(current.temperature_2m);
    
    // Описание погоды
    const weatherCode = current.weather_code;
    descriptionEl.textContent = weatherCodes[weatherCode] || 'Неизвестно';
    
    // Установка фона в зависимости от погоды
    setWeatherBackground(weatherCode);
    
    // Создание анимированных эффектов
    createWeatherEffects(weatherCode);
    
    // Влажность
    humidityEl.textContent = current.relative_humidity_2m;
    
    // Ветер (перевод из м/с в км/ч)
    windEl.textContent = Math.round(current.wind_speed_10m * 3.6);
    
  } catch (error) {
    console.error('Ошибка:', error);
    descriptionEl.textContent = 'Ошибка загрузки данных';
    tempEl.textContent = '--';
    humidityEl.textContent = '--';
    windEl.textContent = '--';
  }
}

// Обработчик выбора города
document.getElementById('city-select').addEventListener('change', function(e) {
  const cityKey = e.target.value;
  const city = cities[cityKey];
  currentLat = city.lat;
  currentLon = city.lon;
  currentCityName = city.name;
  fetchWeather(currentLat, currentLon, currentCityName);
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
      
      // Сбросить выбор города
      document.getElementById('city-select').value = '';
      
      fetchWeather(currentLat, currentLon, currentCityName);
      gpsBtn.classList.remove('active');
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

// Загрузка при открытии страницы
fetchWeather(currentLat, currentLon, currentCityName);
