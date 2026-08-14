import * as THREE from 'three';

import { BubbleSystem } from './bubbles';
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

export function initScene(canvas: HTMLCanvasElement): BubbleScene {
  if (bubbleSceneInstance) {
    bubbleSceneInstance.dispose();
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.z = 14;

  let tier: DeviceTier = getDeviceTier();

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, getDprCap(tier)));
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  let bubbleSystem = new BubbleSystem(scene, getParticleLimit(tier));

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

  function handleResize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const nextTier = getDeviceTier();

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, getDprCap(nextTier)));
    renderer.setSize(width, height, false);

    if (nextTier !== tier) {
      tier = nextTier;
      bubbleSystem.dispose();
      bubbleSystem = new BubbleSystem(scene, getParticleLimit(tier));
    }
  }

  const onResize = debounce(handleResize, 150);

  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('resize', onResize, { passive: true });

  animate();

  return bubbleScene;
}
