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

// Переменная для карты
let map = null;
let mapMarker = null;

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
  0: '☀️',
  1: '🌤️',
  2: '⛅',
  3: '☁️',
  45: '🌫️',
  48: '🌫️',
  51: '🌧️',
  53: '🌧️',
  55: '🌧️',
  61: '🌧️',
  63: '🌧️',
  65: '🌧️',
  71: '❄️',
  73: '❄️',
  75: '❄️',
  80: '⛈️',
  81: '⛈️',
  82: '⛈️',
  95: '⚡',
  96: '⚡',
  99: '⚡'
};

// Mouse position for interaction
let mouseX = 0;
let mouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;

// Функция создания анимированных эффектов погоды
function createWeatherEffects(weatherCode) {
  const container = document.getElementById('weather-effects');
  container.innerHTML = '';
  
  if (weatherCode === 0 || weatherCode === 1) {
    const sunRays = document.createElement('div');
    sunRays.className = 'sun-rays';
    sunRays.innerHTML = '<div class="sun"></div><div class="ray"></div><div class="ray"></div><div class="ray"></div><div class="ray"></div><div class="ray"></div><div class="ray"></div><div class="ray"></div><div class="ray"></div><div class="ray"></div><div class="ray"></div><div class="ray"></div>';
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
function setWeatherBackground(weatherCode) {
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
async function fetchWeather(lat, lon, cityName) {
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
    
    // Обновление 3D эффектов
    if (typeof update3DWeather === 'function') {
      update3DWeather(weatherCode);
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

// Функция инициализации карты
function initMap() {
  if (map) return;
  
  map = L.map('map').setView([currentLat, currentLon], 5);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  
  // Обработчик клика по карте
  map.on('click', function(e) {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;
    
    currentLat = lat;
    currentLon = lon;
    currentCityName = 'Выбранный город';
    
    // Обновляем маркер
    if (mapMarker) {
      mapMarker.setLatLng([lat, lon]);
    } else {
      mapMarker = L.marker([lat, lon]).addTo(map);
    }
    
    // Сбрасываем выбор города
    document.getElementById('city-select').value = '';
    
    // Получаем погоду для новых координат
    fetchWeather(lat, lon, 'Выбранный город');
  });
}

// Обработчик кнопки карты
document.getElementById('map-btn').addEventListener('click', function() {
  const mapContainer = document.getElementById('map-container');
  mapContainer.classList.toggle('active');
  
  if (mapContainer.classList.contains('active')) {
    setTimeout(function() {
      if (!map) {
        initMap();
      }
      map.invalidateSize();
      map.setView([currentLat, currentLon], 5);
    }, 100);
  }
});

// Обработчик выбора города
document.getElementById('city-select').addEventListener('change', function(e) {
  const cityKey = e.target.value;
  const city = cities[cityKey];
  currentLat = city.lat;
  currentLon = city.lon;
  currentCityName = city.name;
  fetchWeather(currentLat, currentLon, currentCityName);
  
  // Обновляем карту если она открыта
  if (map) {
    map.setView([currentLat, currentLon], 10);
    if (mapMarker) {
      mapMarker.setLatLng([currentLat, currentLon]);
    } else {
      mapMarker = L.marker([currentLat, currentLon]).addTo(map);
    }
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
      if (map) {
        map.setView([currentLat, currentLon], 10);
        if (mapMarker) {
          mapMarker.setLatLng([currentLat, currentLon]);
        } else {
          mapMarker = L.marker([currentLat, currentLon]).addTo(map);
        }
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

// === 3D Shader Effects с Three.js ===
let scene3D, camera3D, renderer3D, particles3D;
let currentWeatherType = 'clear';

function init3DWeather() {
  const canvas = document.getElementById('weather-canvas');
  if (!canvas || typeof THREE === 'undefined') return;
  
  scene3D = new THREE.Scene();
  camera3D = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera3D.position.z = 5;
  
  renderer3D = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer3D.setSize(window.innerWidth, window.innerHeight);
  renderer3D.setPixelRatio(window.devicePixelRatio);
  
  createWeatherParticles('clear');
  
  window.addEventListener('resize', onWindowResize);
  animate3D();
}

function createWeatherParticles(weatherType) {
  if (particles3D) {
    scene3D.remove(particles3D);
    particles3D.geometry.dispose();
    particles3D.material.dispose();
  }
  
  let particleCount, color, size, speed;
  
  switch(weatherType) {
    case 'clear':
      particleCount = 50;
      color = new THREE.Color(0xffd700);
      size = 0.15;
      speed = 0.002;
      break;
    case 'cloudy':
      particleCount = 80;
      color = new THREE.Color(0xffffff);
      size = 0.3;
      speed = 0.001;
      break;
    case 'rain':
      particleCount = 200;
      color = new THREE.Color(0x88ccff);
      size = 0.05;
      speed = 0.05;
      break;
    case 'snow':
      particleCount = 150;
      color = new THREE.Color(0xffffff);
      size = 0.08;
      speed = 0.01;
      break;
    case 'thunder':
      particleCount = 100;
      color = new THREE.Color(0x666666);
      size = 0.1;
      speed = 0.03;
      break;
    case 'fog':
      particleCount = 30;
      color = new THREE.Color(0xaaaaaa);
      size = 0.5;
      speed = 0.001;
      break;
    default:
      particleCount = 50;
      color = new THREE.Color(0xffffff);
      size = 0.1;
      speed = 0.01;
  }
  
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount);
  const sizes = new Float32Array(particleCount);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    velocities[i] = speed * (0.5 + Math.random());
    sizes[i] = size * (0.5 + Math.random());
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.userData = { velocities: velocities, speed: speed, weatherType: weatherType };
  
  const material = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: color },
      time: { value: 0 }
    },
    vertexShader: `
      attribute float size;
      varying float vOpacity;
      uniform float time;
      
      void main() {
        vOpacity = 0.6 + 0.4 * sin(time + position.x);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      varying float vOpacity;
      
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = smoothstep(0.5, 0.0, dist) * vOpacity;
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  
  particles3D = new THREE.Points(geometry, material);
  scene3D.add(particles3D);
  currentWeatherType = weatherType;
}

function update3DWeather(weatherCode) {
  let weatherType;
  
  if (weatherCode === 0 || weatherCode === 1) {
    weatherType = 'clear';
  } else if (weatherCode === 2 || weatherCode === 3) {
    weatherType = 'cloudy';
  } else if (weatherCode >= 45 && weatherCode <= 48) {
    weatherType = 'fog';
  } else if ((weatherCode >= 51 && weatherCode <= 55) || (weatherCode >= 61 && weatherCode <= 82)) {
    weatherType = 'rain';
  } else if (weatherCode >= 95 && weatherCode <= 99) {
    weatherType = 'thunder';
  } else if (weatherCode >= 71 && weatherCode <= 75) {
    weatherType = 'snow';
  } else {
    weatherType = 'cloudy';
  }
  
  createWeatherParticles(weatherType);
}

function animate3D() {
  requestAnimationFrame(animate3D);
  
  if (particles3D && scene3D && camera3D && renderer3D) {
    const positions = particles3D.geometry.attributes.position.array;
    const velocities = particles3D.geometry.userData.velocities;
    
    // Mouse interaction - rotate camera based on mouse position
    targetRotationX = (mouseY * 0.5);
    targetRotationY = (mouseX * 0.5);
    
    camera3D.rotation.x += 0.05 * (targetRotationX - camera3D.rotation.x);
    camera3D.rotation.y += 0.05 * (targetRotationY - camera3D.rotation.y);
    
    for (let i = 0; i < positions.length / 3; i++) {
      if (currentWeatherType === 'rain') {
        positions[i * 3 + 1] -= velocities[i];
        if (positions[i * 3 + 1] < -5) {
          positions[i * 3 + 1] = 5;
          positions[i * 3] = (Math.random() - 0.5) * 10;
        }
      } else if (currentWeatherType === 'snow') {
        positions[i * 3 + 1] -= velocities[i];
        positions[i * 3] += Math.sin(Date.now() * 0.001 + i) * 0.002;
        if (positions[i * 3 + 1] < -5) {
          positions[i * 3 + 1] = 5;
          positions[i * 3] = (Math.random() - 0.5) * 10;
        }
      } else if (currentWeatherType === 'clear') {
        positions[i * 3] += Math.cos(Date.now() * 0.0005 + i) * 0.003;
        positions[i * 3 + 1] += Math.sin(Date.now() * 0.0005 + i) * 0.003;
      } else if (currentWeatherType === 'thunder') {
        positions[i * 3 + 1] -= velocities[i];
        if (positions[i * 3 + 1] < -5) {
          positions[i * 3 + 1] = 5;
          positions[i * 3] = (Math.random() - 0.5) * 10;
        }
      } else {
        positions[i * 3] += velocities[i];
        if (positions[i * 3] > 5) positions[i * 3] = -5;
      }
    }
    
    particles3D.geometry.attributes.position.needsUpdate = true;
    particles3D.material.uniforms.time.value = Date.now() * 0.001;
    
    renderer3D.render(scene3D, camera3D);
  }
}

function onWindowResize() {
  if (camera3D && renderer3D) {
    camera3D.aspect = window.innerWidth / window.innerHeight;
    camera3D.updateProjectionMatrix();
    renderer3D.setSize(window.innerWidth, window.innerHeight);
  }
}

// Mouse move event handler
document.addEventListener('mousemove', function(event) {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Scroll event handler
let lastScrollY = 0;
window.addEventListener('scroll', function() {
  const scrollY = window.scrollY;
  const scrollIndicator = document.getElementById('scroll-indicator');
  
  // Hide scroll indicator after scrolling
  if (scrollY > 50) {
    scrollIndicator.classList.add('hidden');
  } else {
    scrollIndicator.classList.remove('hidden');
  }
  
  lastScrollY = scrollY;
});

// Scroll indicator click handler
document.getElementById('scroll-indicator').addEventListener('click', function() {
  window.scrollTo({
    top: 100,
    behavior: 'smooth'
  });
});

// Initialize on page load
function init() {
  // Hide loader after everything is ready
  setTimeout(function() {
    const loader = document.getElementById('loader-3d');
    if (loader) {
      loader.classList.add('hidden');
    }
    
    // GSAP animation for container
    if (typeof gsap !== 'undefined') {
      gsap.to('.weather-container', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.3
      });
    }
    
    // Initialize 3D weather
    if (document.getElementById('weather-canvas') && typeof THREE !== 'undefined') {
      init3DWeather();
    }
    
    // Fetch initial weather
    fetchWeather(currentLat, currentLon, currentCityName);
  }, 1500);
}

// Start initialization
init();
