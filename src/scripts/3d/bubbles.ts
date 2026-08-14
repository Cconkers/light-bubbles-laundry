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
  colorMix: number;
}

const WORLD_WIDTH = 14;
const WORLD_HEIGHT = 10;
const WORLD_DEPTH = 8;
const BASE_RISE_SPEED = 0.38;
const IMPULSE_RADIUS = 3.4;
const IMPULSE_STRENGTH = 2.4;
const IMPULSE_DECAY = 4.5;

const BUBBLE_COLOR_INNER = '#E0F7FA';
const BUBBLE_COLOR_OUTER = '#B2EBF2';

const innerColor = new THREE.Color(BUBBLE_COLOR_INNER);
const outerColor = new THREE.Color(BUBBLE_COLOR_OUTER);
const mixedColor = new THREE.Color();

function createSoftBubbleTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No 2D context for bubble texture');

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 1;

  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  // Transparent body — mostly the rim is visible
  const body = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  body.addColorStop(0, 'rgba(224, 247, 250, 0.55)');
  body.addColorStop(0.30, 'rgba(178, 235, 242, 0.30)');
  body.addColorStop(0.65, 'rgba(178, 235, 242, 0.12)');
  body.addColorStop(0.88, 'rgba(179, 229, 252, 0.05)');
  body.addColorStop(1, 'rgba(179, 229, 252, 0)');
  ctx.fillStyle = body;
  ctx.fillRect(0, 0, size, size);

  // Specular highlight — top-left glint
  const hx = cx - r * 0.22;
  const hy = cy - r * 0.28;
  const hl = ctx.createRadialGradient(hx, hy, 0, hx, hy, r * 0.38);
  hl.addColorStop(0, 'rgba(255, 255, 255, 0.92)');
  hl.addColorStop(0.30, 'rgba(255, 255, 255, 0.25)');
  hl.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = hl;
  ctx.fillRect(0, 0, size, size);

  // Rim light
  const rim = ctx.createRadialGradient(cx, cy, r * 0.70, cx, cy, r);
  rim.addColorStop(0, 'rgba(178, 235, 242, 0)');
  rim.addColorStop(0.50, 'rgba(178, 235, 242, 0.28)');
  rim.addColorStop(1, 'rgba(224, 247, 250, 0)');
  ctx.fillStyle = rim;
  ctx.fillRect(0, 0, size, size);

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function createBubbleColorMix(): number {
  return Math.random();
}

export class BubbleSystem {
  readonly mesh: THREE.Points;
  private readonly geometry: THREE.BufferGeometry;
  private readonly material: THREE.PointsMaterial;
  private readonly texture: THREE.CanvasTexture;
  private readonly positions: Float32Array;
  private readonly colors: Float32Array;
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
    this.colors = new Float32Array(count * 3);

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.positions, 3).setUsage(THREE.DynamicDrawUsage),
    );
    this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));

    this.texture = createSoftBubbleTexture();

    // size 0.55 world-units: with sizeAttenuation at ~3 units camera distance
    // gives roughly 80-130 px sprites — clearly visible without being huge.
    this.material = new THREE.PointsMaterial({
      map: this.texture,
      color: 0xffffff,
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
      blending: THREE.NormalBlending,
      size: 0.55,
      sizeAttenuation: true,
      vertexColors: true,
      alphaTest: 0.01,
      fog: true,
    });

    this.mesh = new THREE.Points(this.geometry, this.material);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 2;

    for (let i = 0; i < count; i += 1) {
      const p = this.createParticle();
      this.particles.push(p);
      this.writeParticle(i, p);
    }

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;

    this.scene.add(this.mesh);

    this.boundMouseMove = (e: MouseEvent) => this.handleMouseMove(e);
    if (this.cursorEnabled) {
      window.addEventListener('mousemove', this.boundMouseMove, { passive: true });
    }
  }

  update(deltaTime: number): void {
    const speedMultiplier = 1 + this.scrollProgress * 1.5;
    const turbulence = 1 + this.scrollProgress * 0.8;

    for (let i = 0; i < this.particles.length; i += 1) {
      const p = this.particles[i];

      p.phase += p.phaseSpeed * deltaTime;

      const swayX = Math.sin(p.phase) * 0.45 * turbulence;
      const swayZ = Math.cos(p.phase * 0.85) * 0.32 * turbulence;

      p.x += (p.vx + swayX) * deltaTime;
      p.y += p.vy * BASE_RISE_SPEED * speedMultiplier * deltaTime;
      p.z += (p.vz + swayZ) * deltaTime;

      p.vx *= Math.exp(-IMPULSE_DECAY * deltaTime);
      p.vy *= Math.exp(-IMPULSE_DECAY * deltaTime);
      p.vz *= Math.exp(-IMPULSE_DECAY * deltaTime);

      if (this.cursorEnabled) this.applyCursorImpulse(p, deltaTime);

      this.wrapParticle(p);
      this.writeParticle(i, p);
    }

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
  }

  setScrollProgress(progress: number): void {
    this.scrollProgress = THREE.MathUtils.clamp(progress, 0, 1);
  }

  dispose(): void {
    if (this.cursorEnabled) {
      window.removeEventListener('mousemove', this.boundMouseMove);
    }
    this.scene.remove(this.mesh);
    this.geometry.dispose();
    this.material.dispose();
    this.texture.dispose();
  }

  private createParticle(): BubbleParticle {
    return {
      x: (Math.random() - 0.5) * WORLD_WIDTH,
      y: 0.8 + Math.random() * (WORLD_HEIGHT - 1),
      z: -1.5 + Math.random() * 4,
      vx: 0,
      vy: 0,
      vz: 0,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.45 + Math.random() * 1.1,
      colorMix: createBubbleColorMix(),
    };
  }

  private writeParticle(index: number, p: BubbleParticle): void {
    const o = index * 3;
    this.positions[o] = p.x;
    this.positions[o + 1] = p.y;
    this.positions[o + 2] = p.z;

    mixedColor.copy(innerColor).lerp(outerColor, p.colorMix);
    this.colors[o] = mixedColor.r;
    this.colors[o + 1] = mixedColor.g;
    this.colors[o + 2] = mixedColor.b;
  }

  private wrapParticle(p: BubbleParticle): void {
    const hw = WORLD_WIDTH * 0.5;
    const hh = WORLD_HEIGHT * 0.5;
    const hd = WORLD_DEPTH * 0.5;

    if (p.y > hh) {
      p.y = -hh;
      p.x = (Math.random() - 0.5) * WORLD_WIDTH;
      p.z = (Math.random() - 0.5) * WORLD_DEPTH;
      p.vx = 0;
      p.vy = 0;
      p.vz = 0;
      p.colorMix = createBubbleColorMix();
    }

    if (p.x < -hw) p.x = hw;
    if (p.x > hw) p.x = -hw;
    if (p.z < -hd) p.z = hd;
    if (p.z > hd) p.z = -hd;
  }

  private handleMouseMove(e: MouseEvent): void {
    this.mouseWorld.set(
      ((e.clientX / window.innerWidth) * 2 - 1) * (WORLD_WIDTH * 0.5),
      (-(e.clientY / window.innerHeight) * 2 + 1) * (WORLD_HEIGHT * 0.5),
    );
  }

  private applyCursorImpulse(p: BubbleParticle, deltaTime: number): void {
    const dx = p.x - this.mouseWorld.x;
    const dy = p.y - this.mouseWorld.y;
    const distSq = dx * dx + dy * dy;
    const radSq = IMPULSE_RADIUS * IMPULSE_RADIUS;

    if (distSq > radSq || distSq < 0.0001) return;

    const dist = Math.sqrt(distSq);
    const falloff = 1 - dist / IMPULSE_RADIUS;
    const impulse = IMPULSE_STRENGTH * falloff * falloff * deltaTime * 60;

    p.vx += (dx / dist) * impulse;
    p.vy += (dy / dist) * impulse * 0.35;
  }
}

export { BUBBLE_COLOR_INNER, BUBBLE_COLOR_OUTER };
