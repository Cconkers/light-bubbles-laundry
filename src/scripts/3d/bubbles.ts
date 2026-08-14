import * as THREE from 'three';

import {
  getDeviceTier,
  getParticleLimit,
  isCursorInteractionEnabled,
} from './performance';

interface BubbleParticle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  phase: number;
  phaseSpeed: number;
  size: number;
}

const WORLD_WIDTH = 24;
const WORLD_HEIGHT = 16;
const WORLD_DEPTH = 12;
const BASE_RISE_SPEED = 0.45;
const IMPULSE_RADIUS = 2.8;
const IMPULSE_STRENGTH = 2.4;
const IMPULSE_DECAY = 4.5;

const BUBBLE_COLOR_INNER = '#E0F7FA';
const BUBBLE_COLOR_OUTER = '#B2EBF2';

let sharedBubbleTexture: THREE.CanvasTexture | null = null;

function createBubbleTexture(): THREE.CanvasTexture {
  const resolution = 128;
  const canvas = document.createElement('canvas');
  canvas.width = resolution;
  canvas.height = resolution;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('No se pudo crear el contexto 2D para la textura de burbujas.');
  }

  const center = resolution / 2;
  const radius = center - 1;

  const bodyGradient = ctx.createRadialGradient(
    center * 0.82,
    center * 0.78,
    radius * 0.05,
    center,
    center,
    radius,
  );
  bodyGradient.addColorStop(0, 'rgba(224, 247, 250, 0.95)');
  bodyGradient.addColorStop(0.35, 'rgba(201, 243, 248, 0.72)');
  bodyGradient.addColorStop(0.65, 'rgba(178, 235, 242, 0.38)');
  bodyGradient.addColorStop(0.88, 'rgba(178, 235, 242, 0.12)');
  bodyGradient.addColorStop(1, 'rgba(178, 235, 242, 0)');

  ctx.clearRect(0, 0, resolution, resolution);
  ctx.fillStyle = bodyGradient;
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.fill();

  const highlight = ctx.createRadialGradient(
    center * 0.68,
    center * 0.62,
    0,
    center * 0.68,
    center * 0.62,
    radius * 0.38,
  );
  highlight.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
  highlight.addColorStop(0.45, 'rgba(255, 255, 255, 0.25)');
  highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = highlight;
  ctx.beginPath();
  ctx.arc(center * 0.68, center * 0.62, radius * 0.38, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';

  const rim = ctx.createRadialGradient(
    center,
    center,
    radius * 0.72,
    center,
    center,
    radius,
  );
  rim.addColorStop(0, 'rgba(178, 235, 242, 0)');
  rim.addColorStop(0.75, 'rgba(129, 212, 250, 0.18)');
  rim.addColorStop(1, 'rgba(79, 195, 247, 0.35)');

  ctx.strokeStyle = rim;
  ctx.lineWidth = radius * 0.08;
  ctx.beginPath();
  ctx.arc(center, center, radius * 0.92, 0, Math.PI * 2);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

function getBubbleTexture(): THREE.CanvasTexture {
  if (!sharedBubbleTexture) {
    sharedBubbleTexture = createBubbleTexture();
  }

  return sharedBubbleTexture;
}

function createBubbleMaterial(map: THREE.Texture): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      map: { value: map },
      opacity: { value: 0.6 },
    },
    vertexShader: `
      attribute float size;

      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / max(-mvPosition.z, 0.001));
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      uniform float opacity;

      void main() {
        vec4 sampled = texture2D(map, gl_PointCoord);
        if (sampled.a < 0.02) discard;
        gl_FragColor = vec4(sampled.rgb, sampled.a * opacity);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });
}

function createOrganicBubbleSize(): number {
  const roll = Math.random();

  if (roll < 0.15) {
    return 0.55 + Math.random() * 0.35;
  }

  if (roll < 0.45) {
    return 0.32 + Math.random() * 0.22;
  }

  return 0.14 + Math.pow(Math.random(), 1.6) * 0.24;
}

export class BubbleSystem {
  readonly points: THREE.Points;
  private readonly geometry: THREE.BufferGeometry;
  private readonly material: THREE.ShaderMaterial;
  private readonly texture: THREE.CanvasTexture;
  private readonly positions: Float32Array;
  private readonly sizes: Float32Array;
  private readonly particles: BubbleParticle[] = [];
  private readonly mouseWorld = new THREE.Vector2(0, 0);
  private scrollProgress = 0;
  private readonly cursorEnabled: boolean;
  private readonly boundMouseMove: (event: MouseEvent) => void;

  constructor(
    private readonly scene: THREE.Scene,
    particleCount?: number,
  ) {
    const count = particleCount ?? getParticleLimit(getDeviceTier());
    this.cursorEnabled = isCursorInteractionEnabled();

    this.positions = new Float32Array(count * 3);
    this.sizes = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      const particle = this.createParticle();
      this.particles.push(particle);
      this.writeParticleToBuffers(i, particle);
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.positions, 3),
    );
    this.geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));

    this.texture = getBubbleTexture();
    this.material = createBubbleMaterial(this.texture);

    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);

    this.boundMouseMove = (event: MouseEvent) => this.handleMouseMove(event);

    if (this.cursorEnabled) {
      window.addEventListener('mousemove', this.boundMouseMove, { passive: true });
    }
  }

  update(deltaTime: number): void {
    const speedMultiplier = 1 + this.scrollProgress * 1.5;
    const turbulence = 1 + this.scrollProgress * 0.8;

    for (let i = 0; i < this.particles.length; i += 1) {
      const particle = this.particles[i];

      particle.phase += particle.phaseSpeed * deltaTime;

      const swayX = Math.sin(particle.phase) * 0.55 * turbulence;
      const swayZ = Math.cos(particle.phase * 0.85) * 0.4 * turbulence;

      particle.x += (particle.vx + swayX) * deltaTime;
      particle.y += particle.vy * BASE_RISE_SPEED * speedMultiplier * deltaTime;
      particle.z += (particle.vz + swayZ) * deltaTime;

      particle.vx *= Math.exp(-IMPULSE_DECAY * deltaTime);
      particle.vy *= Math.exp(-IMPULSE_DECAY * deltaTime);
      particle.vz *= Math.exp(-IMPULSE_DECAY * deltaTime);

      if (this.cursorEnabled) {
        this.applyCursorImpulse(particle, deltaTime);
      }

      this.wrapParticle(particle);
      this.writeParticleToBuffers(i, particle);
    }

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.size.needsUpdate = true;
  }

  setScrollProgress(progress: number): void {
    this.scrollProgress = THREE.MathUtils.clamp(progress, 0, 1);
  }

  dispose(): void {
    if (this.cursorEnabled) {
      window.removeEventListener('mousemove', this.boundMouseMove);
    }

    this.scene.remove(this.points);
    this.geometry.dispose();
    this.material.dispose();
  }

  private createParticle(): BubbleParticle {
    return {
      x: (Math.random() - 0.5) * WORLD_WIDTH,
      y: (Math.random() - 0.5) * WORLD_HEIGHT,
      z: (Math.random() - 0.5) * WORLD_DEPTH,
      vx: 0,
      vy: 0,
      vz: 0,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.6 + Math.random() * 1.4,
      size: createOrganicBubbleSize(),
    };
  }

  private writeParticleToBuffers(index: number, particle: BubbleParticle): void {
    const offset = index * 3;
    this.positions[offset] = particle.x;
    this.positions[offset + 1] = particle.y;
    this.positions[offset + 2] = particle.z;
    this.sizes[index] = particle.size;
  }

  private wrapParticle(particle: BubbleParticle): void {
    const halfWidth = WORLD_WIDTH * 0.5;
    const halfHeight = WORLD_HEIGHT * 0.5;
    const halfDepth = WORLD_DEPTH * 0.5;

    if (particle.y > halfHeight) {
      particle.y = -halfHeight;
      particle.x = (Math.random() - 0.5) * WORLD_WIDTH;
      particle.z = (Math.random() - 0.5) * WORLD_DEPTH;
      particle.vx = 0;
      particle.vy = 0;
      particle.vz = 0;
      particle.size = createOrganicBubbleSize();
    }

    if (particle.x < -halfWidth) particle.x = halfWidth;
    if (particle.x > halfWidth) particle.x = -halfWidth;
    if (particle.z < -halfDepth) particle.z = halfDepth;
    if (particle.z > halfDepth) particle.z = -halfDepth;
  }

  private handleMouseMove(event: MouseEvent): void {
    const normalizedX = (event.clientX / window.innerWidth) * 2 - 1;
    const normalizedY = -(event.clientY / window.innerHeight) * 2 + 1;

    this.mouseWorld.set(
      normalizedX * (WORLD_WIDTH * 0.5),
      normalizedY * (WORLD_HEIGHT * 0.5),
    );
  }

  private applyCursorImpulse(particle: BubbleParticle, deltaTime: number): void {
    const dx = particle.x - this.mouseWorld.x;
    const dy = particle.y - this.mouseWorld.y;
    const distanceSq = dx * dx + dy * dy;
    const radiusSq = IMPULSE_RADIUS * IMPULSE_RADIUS;

    if (distanceSq > radiusSq || distanceSq < 0.0001) return;

    const distance = Math.sqrt(distanceSq);
    const falloff = 1 - distance / IMPULSE_RADIUS;
    const impulse = IMPULSE_STRENGTH * falloff * falloff * deltaTime * 60;

    particle.vx += (dx / distance) * impulse;
    particle.vy += (dy / distance) * impulse * 0.35;
  }
}

export { BUBBLE_COLOR_INNER, BUBBLE_COLOR_OUTER };
