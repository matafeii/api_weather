// Main entry point
import { initWeather } from './weather.js';
import { initMap, updateMapView } from './map.js';
import { init3DScene } from './scene.js';
import { initAnimations } from './animation.js';

// Делаем updateMapView глобальной для использования в weather.js
window.updateMapView = updateMapView;

// Инициализация приложения
function initApp() {
  // Инициализация погоды
  initWeather();
  
  // Инициализация карты
  initMap();
  
  // Инициализация 3D сцены
  init3DScene();
  
  // Инициализация анимаций
  initAnimations();
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', initApp);
