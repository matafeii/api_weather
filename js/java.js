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
