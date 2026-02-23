// Анимации (GSAP)
import { handleMouseMove } from './scene.js';

// Инициализация анимаций
export function initAnimations() {
  // Обработчик движения мыши
  document.addEventListener('mousemove', handleMouseMove);

  // Обработчик скролла
  window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    const scrollIndicator = document.getElementById('scroll-indicator');
    
    if (scrollY > 50) {
      scrollIndicator.classList.add('hidden');
    } else {
      scrollIndicator.classList.remove('hidden');
    }
  });

  // Клик по индикатору скролла
  document.getElementById('scroll-indicator').addEventListener('click', function() {
    window.scrollTo({
      top: 100,
      behavior: 'smooth'
    });
  });

  // Скрытие loader и запуск анимаций
  setTimeout(function() {
    const loader = document.getElementById('loader-3d');
    if (loader) {
      loader.classList.add('hidden');
    }
    
    // GSAP анимация для контейнера
    if (typeof gsap !== 'undefined') {
      gsap.to('.weather-container', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.3
      });
    }
  }, 1500);
}
