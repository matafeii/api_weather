// Карта (Leaflet)
import { currentLat, currentLon, currentCityName, fetchWeather } from './weather.js';

let map = null;
let mapMarker = null;

// Инициализация карты
export function initMap() {
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
}

// Обновление вида карты
export function updateMapView(lat, lon) {
  if (map) {
    map.setView([lat, lon], 10);
    if (mapMarker) {
      mapMarker.setLatLng([lat, lon]);
    } else {
      mapMarker = L.marker([lat, lon]).addTo(map);
    }
  }
}
