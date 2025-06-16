import './index.scss';

import * as THREE from 'three';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

let particles: THREE.Object3D<THREE.Event>;
let particles2: THREE.Object3D<THREE.Event>;

let planets: THREE.Object3D<THREE.Event>;
let body: THREE.Object3D<THREE.Event>;
let waves: THREE.Object3D<THREE.Event>;

let time = 0;
let xPos = 0;

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;

const fov = 45;
const aspect = 2;
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 12, 20);
camera.rotation.x = -0.2;

const scene = new THREE.Scene();
scene.background = new THREE.Color('black');

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 3, 1, 0.4);
composer.addPass(bloomPass);

const gltfLoader = new GLTFLoader();
gltfLoader.load('/public/resources/space/scene.gltf', (gltf) => {
  const root = gltf.scene;

  planets = root.clone();
  particles = root.clone();
  particles2 = root.clone();
  body = root.clone();
  waves = root.clone();

  root.getObjectByName('RootNode').children.forEach((child) => {
    if (child.name.includes("Sphere")) {
      particles.getObjectByName(child.name).removeFromParent();
      particles2.getObjectByName(child.name).removeFromParent();
      body.getObjectByName(child.name).removeFromParent();
      waves.getObjectByName(child.name).removeFromParent();
    }

    if (child.name === "body") {
      particles.getObjectByName(child.name).removeFromParent();
      particles2.getObjectByName(child.name).removeFromParent();
      planets.getObjectByName(child.name).removeFromParent();
      waves.getObjectByName(child.name).removeFromParent();
    }

    if (child.name === "Cube") {
      particles.getObjectByName(child.name).removeFromParent();
      particles2.getObjectByName(child.name).removeFromParent();
      body.getObjectByName(child.name).removeFromParent();
      planets.getObjectByName(child.name).removeFromParent();
      waves.getObjectByName(child.name).removeFromParent();
    }

    if (child.name.includes("waves")) {
      particles2.getObjectByName(child.name).removeFromParent();
      particles.getObjectByName(child.name).removeFromParent();
      body.getObjectByName(child.name).removeFromParent();
      planets.getObjectByName(child.name).removeFromParent();
    }

    if (child.name === "particles") {
      body.getObjectByName(child.name).removeFromParent();
      planets.getObjectByName(child.name).removeFromParent();
      waves.getObjectByName(child.name).removeFromParent();
    }
  });

  particles2.position.x += -1;
  particles2.position.z += -1;

  scene.add(planets);
  scene.add(particles);
  scene.add(particles2);
  scene.add(waves);
  scene.add(body);
});

function render() {
  time += 0.001;
  if (resizeRendererToDisplaySize()) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
    
  if (particles) {
    particles.rotation.y = time * 0.5;
  }

  if (particles2) {
    particles.rotation.y = time * 0.1 - 10;
  }

  if (planets) {
    planets.rotation.y = time * 0.1;
  }

  if (waves) {
    waves.rotation.y = -time * 0.1;
  }

  if (body) {
    // 0.6 = right 
    // -0.6 = middle
    // -1.6 = left
    body.rotation.y = -1.6 + (xPos / 100 * 2);
  }

  const frequency = 4;
  renderer.toneMappingExposure = Math.sin(time * 100 * (Math.PI / frequency)) * 2 + 10;

  renderer.render(scene, camera);
  composer.render();

  requestAnimationFrame(render);
}

function resizeRendererToDisplaySize() {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
    composer.setSize(width, height);
  }
  return needResize;
}

document.addEventListener('mousemove', (event) => {
  xPos = Math.round(event.clientX / window.innerWidth * 100);
})

requestAnimationFrame(render);
