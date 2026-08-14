import * as THREE from 'three';

import {
  getDeviceTier,
  getParticleLimit,
  isCursorInteractionEnabled,
  type DeviceTier,
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
  opacity: number;
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

const SPHERE_SEGMENTS: Record<DeviceTier, number> = {
  mobile: 20,
  tablet: 28,
  desktop: 32,
};

const dummy = new THREE.Object3D();
const instancePosition = new THREE.Vector3();
const instanceScale = new THREE.Vector3();
const instanceQuaternion = new THREE.Quaternion();

function createBubbleShaderMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader: `
      attribute float instanceOpacity;

      varying vec3 vWorldNormal;
      varying vec3 vViewDir;
      varying vec3 vWorldPos;
      varying float vOpacity;

      void main() {
        vec4 worldPosition = modelMatrix * instanceMatrix * vec4(position, 1.0);
        vWorldPos = worldPosition.xyz;
        vWorldNormal = normalize(mat3(modelMatrix * instanceMatrix) * normal);
        vec4 mvPosition = viewMatrix * worldPosition;
        vViewDir = normalize(-mvPosition.xyz);
        vOpacity = instanceOpacity;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float uTime;

      varying vec3 vWorldNormal;
      varying vec3 vViewDir;
      varying vec3 vWorldPos;
      varying float vOpacity;

      vec3 soapIridescence(float angle, vec3 worldPos) {
        float film = angle * 6.28318 + worldPos.y * 1.4 + worldPos.x * 0.9 + uTime * 0.15;
        vec3 wave = 0.5 + 0.5 * cos(film + vec3(0.0, 2.1, 4.2));
        vec3 base = vec3(0.72, 0.93, 0.97);
        return mix(base, wave * vec3(0.85, 0.95, 1.0), 0.55);
      }

      void main() {
        vec3 normal = normalize(vWorldNormal);
        vec3 viewDir = normalize(vViewDir);

        float ndv = clamp(abs(dot(normal, viewDir)), 0.0, 1.0);
        float fresnel = pow(1.0 - ndv, 2.8);

        vec3 iridescence = soapIridescence(fresnel, vWorldPos);

        vec3 keyLight = normalize(vec3(0.35, 1.0, 0.55));
        vec3 halfVector = normalize(keyLight + viewDir);
        float specular = pow(max(dot(normal, halfVector), 0.0), 140.0);
        vec3 highlight = vec3(1.0) * specular * 1.1;

        vec3 fillLight = normalize(vec3(-0.6, 0.25, 0.75));
        vec3 halfFill = normalize(fillLight + viewDir);
        float specFill = pow(max(dot(normal, halfFill), 0.0), 70.0);
        highlight += vec3(0.82, 0.94, 1.0) * specFill * 0.45;

        float rim = smoothstep(0.55, 0.98, fresnel);
        float body = (1.0 - ndv) * 0.06;

        vec3 color = iridescence * (rim * 0.55 + body);
        color += highlight;
        color += vec3(0.9, 0.98, 1.0) * rim * 0.12;

        float alpha = (rim * 0.62 + specular * 0.35 + body) * vOpacity;
        alpha = clamp(alpha, 0.02, 0.72);

        if (alpha < 0.015) discard;

        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.NormalBlending,
  });
}

function getSphereSegments(): number {
  return SPHERE_SEGMENTS[getDeviceTier()];
}

function createOrganicBubbleSize(): number {
  const roll = Math.random();

  if (roll < 0.18) {
    return 4.2 + Math.random() * 2.8;
  }

  if (roll < 0.48) {
    return 2.6 + Math.random() * 1.6;
  }

  return 1.4 + Math.pow(Math.random(), 1.35) * 1.8;
}

function createBubbleOpacity(): number {
  return 0.5 + Math.random() * 0.5;
}

export class BubbleSystem {
  readonly mesh: THREE.InstancedMesh;
  private readonly geometry: THREE.SphereGeometry;
  private readonly material: THREE.ShaderMaterial;
  private readonly opacities: Float32Array;
  private readonly particles: BubbleParticle[] = [];
  private readonly mouseWorld = new THREE.Vector2(0, 0);
  private scrollProgress = 0;
  private elapsed = 0;
  private readonly cursorEnabled: boolean;
  private readonly boundMouseMove: (event: MouseEvent) => void;

  constructor(
    private readonly scene: THREE.Scene,
    particleCount?: number,
  ) {
    const count = particleCount ?? getParticleLimit(getDeviceTier());
    this.cursorEnabled = isCursorInteractionEnabled();

    const segments = getSphereSegments();
    this.geometry = new THREE.SphereGeometry(1, segments, segments);
    this.material = createBubbleShaderMaterial();
    this.opacities = new Float32Array(count);

    this.mesh = new THREE.InstancedMesh(this.geometry, this.material, count);
    this.mesh.frustumCulled = false;

    this.mesh.geometry.setAttribute(
      'instanceOpacity',
      new THREE.InstancedBufferAttribute(this.opacities, 1),
    );

    for (let i = 0; i < count; i += 1) {
      const particle = this.createParticle();
      this.particles.push(particle);
      this.opacities[i] = particle.opacity;
      this.updateInstanceMatrix(i, particle);
    }

    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.geometry.attributes.instanceOpacity.needsUpdate = true;
    this.mesh.instanceMatrix.needsUpdate = true;

    this.scene.add(this.mesh);

    this.boundMouseMove = (event: MouseEvent) => this.handleMouseMove(event);

    if (this.cursorEnabled) {
      window.addEventListener('mousemove', this.boundMouseMove, { passive: true });
    }
  }

  update(deltaTime: number): void {
    this.elapsed += deltaTime;
    this.material.uniforms.uTime.value = this.elapsed;

    const speedMultiplier = 1 + this.scrollProgress * 1.5;
    const turbulence = 1 + this.scrollProgress * 0.8;

    for (let i = 0; i < this.particles.length; i += 1) {
      const particle = this.particles[i];

      particle.phase += particle.phaseSpeed * deltaTime;

      const swayX = Math.sin(particle.phase) * 0.45 * turbulence;
      const swayZ = Math.cos(particle.phase * 0.85) * 0.32 * turbulence;

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
      this.updateInstanceMatrix(i, particle);
    }

    this.mesh.instanceMatrix.needsUpdate = true;
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
      size: createOrganicBubbleSize(),
      opacity: createBubbleOpacity(),
    };
  }

  private updateInstanceMatrix(index: number, particle: BubbleParticle): void {
    const radius = particle.size * 0.5;

    instancePosition.set(particle.x, particle.y, particle.z);
    instanceQuaternion.identity();
    instanceScale.set(radius, radius, radius);

    dummy.matrix.compose(instancePosition, instanceQuaternion, instanceScale);
    this.mesh.setMatrixAt(index, dummy.matrix);
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
      particle.opacity = createBubbleOpacity();
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
