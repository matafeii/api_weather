// 3D Scene (Three.js)
import { createWeatherEffects } from './weather.js';

let scene3D, camera3D, renderer3D, particles3D;
let currentWeatherType = 'clear';
let mouseX = 0;
let mouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;

// Инициализация 3D сцены
export function init3DScene() {
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

// Создание частиц погоды
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

// Обновление 3D погоды
export function update3DWeather(weatherCode) {
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

// Анимация 3D сцены
function animate3D() {
  requestAnimationFrame(animate3D);
  
  if (particles3D && scene3D && camera3D && renderer3D) {
    const positions = particles3D.geometry.attributes.position.array;
    const velocities = particles3D.geometry.userData.velocities;
    
    // Взаимодействие с мышью
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

// Обработчик движения мыши
export function handleMouseMove(event) {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}
