import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

import { BubbleSystem } from './bubbles';
import { createLaundryRoom, LAUNDRY_POV_TARGET } from './laundryRoom';
import {
  type DeviceTier,
  getDeviceTier,
  getDprCap,
  getParticleLimit,
} from './performance';
import { debounce } from '../utils/resize';

export interface BubbleScene {
  setScrollProgress: (progress: number) => void;
  dispose: () => void;
}

let bubbleSceneInstance: BubbleScene | null = null;

export function getBubbleScene(): BubbleScene | null {
  return bubbleSceneInstance;
}

export async function initScene(canvas: HTMLCanvasElement): Promise<BubbleScene> {
  if (bubbleSceneInstance) {
    bubbleSceneInstance.dispose();
  }

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xf5f3ef, 0.026);

  const camera = new THREE.PerspectiveCamera(
    62,
    window.innerWidth / window.innerHeight,
    0.1,
    100,
  );
  camera.position.set(0, 1.68, 2.2);
  camera.lookAt(LAUNDRY_POV_TARGET);

  let tier: DeviceTier = getDeviceTier();

  const getCanvasSize = () => ({
    width: Math.max(canvas.clientWidth, 1),
    height: Math.max(canvas.clientHeight, 1),
  });

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  const applyRendererSize = () => {
    const { width, height } = getCanvasSize();
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, getDprCap(tier)));
    renderer.setSize(width, height, false);
  };

  applyRendererSize();
  RectAreaLightUniformsLib.init();

  const ambientLight = new THREE.AmbientLight(0xf5f3ef, 0.62);
  const ceilingLight = new THREE.RectAreaLight(0xfff9e6, 3.2, 5, 1.4);
  ceilingLight.position.set(0, 4.4, 0.4);
  ceilingLight.lookAt(0, 0, -2);

  const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
  keyLight.position.set(2, 5, 4);
  const fillLight = new THREE.DirectionalLight(0xdceefb, 0.4);
  fillLight.position.set(-3, 3, 2);

  scene.add(ambientLight, ceilingLight, keyLight, fillLight);

  let laundryRoom = await createLaundryRoom(tier);
  scene.add(laundryRoom.group);

  let bubbleSystem = new BubbleSystem(scene, getParticleLimit(tier));
  bubbleSystem.mesh.renderOrder = 2;

  const clock = new THREE.Clock();
  let animationId = 0;
  let isRunning = !document.hidden;

  const bubbleScene: BubbleScene = {
    setScrollProgress(progress: number) {
      bubbleSystem.setScrollProgress(progress);
    },
    dispose() {
      isRunning = false;
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      bubbleSystem.dispose();
      laundryRoom.dispose();
      renderer.dispose();
      if (bubbleSceneInstance === bubbleScene) {
        bubbleSceneInstance = null;
      }
    },
  };

  bubbleSceneInstance = bubbleScene;

  function animate(): void {
    if (!isRunning) return;

    animationId = requestAnimationFrame(animate);
    const deltaTime = Math.min(clock.getDelta(), 0.05);
    bubbleSystem.update(deltaTime);
    laundryRoom.update(clock.elapsedTime);
    renderer.render(scene, camera);
  }

  function onVisibilityChange(): void {
    isRunning = !document.hidden;

    if (isRunning) {
      clock.getDelta();
      animate();
    } else {
      cancelAnimationFrame(animationId);
    }
  }

  async function handleResize(): Promise<void> {
    const nextTier = getDeviceTier();

    if (nextTier !== tier) {
      tier = nextTier;
      bubbleSystem.dispose();
      laundryRoom.dispose();
      scene.remove(laundryRoom.group);
      laundryRoom = await createLaundryRoom(tier);
      scene.add(laundryRoom.group);
      bubbleSystem = new BubbleSystem(scene, getParticleLimit(tier));
      bubbleSystem.mesh.renderOrder = 2;
    }

    applyRendererSize();
  }

  const onResize = debounce(() => {
    void handleResize();
  }, 150);

  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('resize', onResize, { passive: true });

  animate();

  return bubbleScene;
}
