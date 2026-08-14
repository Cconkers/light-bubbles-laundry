import * as THREE from 'three';

import { type DeviceTier, getDeviceTier } from './performance';
import { createStackedColumn } from './modelLoader';

const COLUMN_COUNT: Record<DeviceTier, number> = {
  mobile: 3,
  tablet: 4,
  desktop: 6,
};

const DOBLE_WASHER_WIDTH = 3.90;
const GAP_IN_BETWEEN_WASHERS = 0;
const WALL_Z = -1.9;

// GLTF bounding box ratios (138.09 W × 101.05 H × 87.17 D)
const GLTF_H_RATIO = 101.05 / 138.09; // ≈ 0.732
const GLTF_D_RATIO = 87.17 / 138.09;  // ≈ 0.631

const MACHINE_H = DOBLE_WASHER_WIDTH * GLTF_H_RATIO;   // ≈ 2.855
const MACHINE_D = DOBLE_WASHER_WIDTH * GLTF_D_RATIO;   // ≈ 2.460

// Porthole geometry — centred on the column (full-face porthole)
const PORTHOLE_X_OFFSET = 0;
const PORTHOLE_Y       = MACHINE_H * 0.44;             // ≈ 1.256
const PORTHOLE_R       = DOBLE_WASHER_WIDTH * 0.155;   // ≈ 0.604
const PORTHOLE_Z       = WALL_Z + MACHINE_D * 0.51 + 0.04; // just in front of face

// Door animation timing (seconds)
const T_OPEN  = 2.0;
const T_SPIN  = 5.5;
const T_SLOW  = 2.5;
const T_CLOSE = 1.8;
const T_PAUSE = 3.5;
const T_TOTAL = T_OPEN + T_SPIN + T_SLOW + T_CLOSE + T_PAUSE;

export const LAUNDRY_POV_TARGET = new THREE.Vector3(0, 2, WALL_Z + 1);

// ─── helpers ────────────────────────────────────────────────────────────────

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeInCubic(t: number): number {
  return t * t * t;
}

function createClothesTexture(): THREE.CanvasTexture {
  const S = 256;
  const cv = document.createElement('canvas');
  cv.width = cv.height = S;
  const ctx = cv.getContext('2d')!;

  ctx.fillStyle = '#0d0d0d';
  ctx.fillRect(0, 0, S, S);

  const palette = ['#c0392b', '#2980b9', '#f39c12', '#27ae60', '#8e44ad', '#ecf0f1', '#e67e22', '#1abc9c'];
  for (let i = 0; i < 14; i++) {
    ctx.save();
    ctx.translate(Math.random() * S, Math.random() * S);
    ctx.rotate(Math.random() * Math.PI);
    ctx.fillStyle = palette[i % palette.length];
    ctx.globalAlpha = 0.7 + Math.random() * 0.3;
    ctx.beginPath();
    ctx.ellipse(0, 0, 6 + Math.random() * 22, 4 + Math.random() * 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const tex = new THREE.CanvasTexture(cv);
  tex.needsUpdate = true;
  return tex;
}

// ─── machine door animation ──────────────────────────────────────────────────

interface MachineAnim {
  group: THREE.Group;
  update: (elapsed: number) => void;
  dispose: () => void;
}

function createMachineAnimation(columnX: number): MachineAnim {
  const group = new THREE.Group();
  group.position.set(
    columnX + PORTHOLE_X_OFFSET,
    PORTHOLE_Y,
    PORTHOLE_Z,
  );

  const R = PORTHOLE_R;

  // Drum background
  const bgMesh = new THREE.Mesh(
    new THREE.CircleGeometry(R * 0.90, 48),
    new THREE.MeshBasicMaterial({ color: 0x080808 }),
  );
  bgMesh.position.z = -0.01;
  bgMesh.visible = false;
  group.add(bgMesh);

  // Clothes disc (hidden until door opens)
  const clothesTex = createClothesTexture();
  const clothesMat = new THREE.MeshBasicMaterial({
    map: clothesTex,
    transparent: true,
    opacity: 0,
  });
  const clothesMesh = new THREE.Mesh(
    new THREE.CircleGeometry(R * 0.84, 48),
    clothesMat,
  );
  clothesMesh.position.z = -0.008;
  group.add(clothesMesh);

  // Drum ribs (6 radial fins attached to clothes disc)
  const ribMat = new THREE.MeshBasicMaterial({ color: 0x1a1a1a });
  for (let i = 0; i < 6; i++) {
    const rib = new THREE.Mesh(
      new THREE.BoxGeometry(R * 0.07, R * 1.65, 0.002),
      ribMat,
    );
    rib.rotation.z = (i / 6) * Math.PI * 2;
    clothesMesh.add(rib);
  }

  // Porthole frame ring
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    metalness: 0.90,
    roughness: 0.18,
  });
  const frameMesh = new THREE.Mesh(
    new THREE.TorusGeometry(R, R * 0.10, 16, 64),
    frameMat,
  );
  frameMesh.position.z = 0.005;
  group.add(frameMesh);

  // Door pivot — hinge sits at left edge of porthole
  const doorPivot = new THREE.Group();
  doorPivot.position.set(-R, 0, 0.01);
  group.add(doorPivot);

  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xddeeff,
    metalness: 0.05,
    roughness: 0.05,
    transparent: true,
    opacity: 0.52,
    side: THREE.DoubleSide,
  });
  const glassMesh = new THREE.Mesh(
    new THREE.CircleGeometry(R * 0.90, 48),
    glassMat,
  );
  // Shift circle so its left edge is on the pivot
  glassMesh.position.x = R;
  doorPivot.add(glassMesh);

  // Door handle
  const handleMat = new THREE.MeshStandardMaterial({
    color: 0xdddddd,
    metalness: 0.92,
    roughness: 0.12,
  });
  const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.022, 0.08, 12),
    handleMat,
  );
  handle.rotation.z = Math.PI / 2;
  handle.position.set(R * 0.68, 0, 0.018);
  glassMesh.add(handle);

  // Animation state
  let drumAngle = 0;

  const update = (elapsed: number): void => {
    const t = elapsed % T_TOTAL;

    // ── door ──
    if (t < T_OPEN) {
      const p = easeOutCubic(t / T_OPEN);
      doorPivot.rotation.y = p * Math.PI * 0.72;
      bgMesh.visible = t > T_OPEN * 0.4;
    } else if (t < T_OPEN + T_SPIN + T_SLOW) {
      doorPivot.rotation.y = Math.PI * 0.72;
      bgMesh.visible = true;
      clothesMat.opacity = Math.min((t - T_OPEN) / 0.35, 1.0);
    } else if (t < T_OPEN + T_SPIN + T_SLOW + T_CLOSE) {
      const p = easeInCubic((t - T_OPEN - T_SPIN - T_SLOW) / T_CLOSE);
      doorPivot.rotation.y = (1 - p) * Math.PI * 0.72;
      clothesMat.opacity = Math.max(1 - p * 2.5, 0);
      bgMesh.visible = true;
    } else {
      doorPivot.rotation.y = 0;
      clothesMat.opacity = 0;
      bgMesh.visible = false;
    }

    // ── drum ──
    const spinStart = T_OPEN;
    const spinEnd   = T_OPEN + T_SPIN;
    const slowEnd   = spinEnd + T_SLOW;

    if (t > spinStart && t < spinEnd) {
      const p = (t - spinStart) / T_SPIN;
      const vel = Math.min(p * 5, 1) * 0.14; // ramp up then constant
      drumAngle += vel;
    } else if (t >= spinEnd && t < slowEnd) {
      const p = (t - spinEnd) / T_SLOW;
      const vel = (1 - easeInCubic(p)) * 0.14;
      drumAngle += vel;
    }

    clothesMesh.rotation.z = drumAngle;
  };

  const dispose = (): void => {
    clothesTex.dispose();
    group.traverse((c) => {
      if (!(c instanceof THREE.Mesh)) return;
      c.geometry.dispose();
      const m = c.material;
      if (Array.isArray(m)) m.forEach((x) => x.dispose());
      else (m as THREE.Material).dispose();
    });
  };

  return { group, update, dispose };
}

// ─── interior ────────────────────────────────────────────────────────────────

function createSevillaInterior(): THREE.Group {
  const env = new THREE.Group();

  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x00d4ff,
    roughness: 0.78,
    metalness: 0.02,
  });
  const floorAlt = new THREE.MeshStandardMaterial({
    color: 0x00d4ff,
    roughness: 0.78,
    metalness: 0.02,
  });

  for (let x = -9; x < 9; x += 1) {
    for (let z = -1; z < 8; z += 1) {
      const tile = new THREE.Mesh(
        new THREE.PlaneGeometry(0.95, 0.95),
        (x + z) % 2 === 0 ? floorMat : floorAlt,
      );
      tile.rotation.x = -Math.PI / 2;
      tile.position.set(x * 0.48 + 0.24, 0, z * 0.48 - 0.5);
      env.add(tile);
    }
  }

  const ceilingMat = new THREE.MeshStandardMaterial({
    color: 0x00d4ff,
    roughness: 0.92,
    metalness: 0,
  });
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(14, 9), ceilingMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, 4.6, 1);
  env.add(ceiling);

  const lightMat = new THREE.MeshStandardMaterial({
    color: 0x00d4ff,
    emissive: 0x00d4ff,
    emissiveIntensity: 1.6,
    roughness: 0.35,
  });

  for (const x of [-2.4, 0, 2.4]) {
    const fixture = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 0.28), lightMat);
    fixture.position.set(x, 4.48, 0.2);
    env.add(fixture);
  }

  return env;
}

async function buildMachineWall(columns: number): Promise<{ wallGroup: THREE.Group; animatedColumnX: number }> {
  const wallGroup = new THREE.Group();
  const totalWidth = columns * DOBLE_WASHER_WIDTH + (columns - 1) * GAP_IN_BETWEEN_WASHERS;
  const startX = -totalWidth * 0.5 + DOBLE_WASHER_WIDTH * 0.5;

  const stackedColumns = await Promise.all(
    Array.from({ length: columns }, () => createStackedColumn(DOBLE_WASHER_WIDTH)),
  );

  stackedColumns.forEach((column, index) => {
    column.position.set(startX + index * (DOBLE_WASHER_WIDTH + GAP_IN_BETWEEN_WASHERS), 0, WALL_Z);
    wallGroup.add(column);
  });

  // Target the right-center column: its washer half (left) has porthole closest to x=0
  const animatedIndex = Math.floor(columns / 2);
  const animatedColumnX = startX + animatedIndex * (DOBLE_WASHER_WIDTH + GAP_IN_BETWEEN_WASHERS);

  return { wallGroup, animatedColumnX };
}

// ─── public API ──────────────────────────────────────────────────────────────

export interface LaundryRoom {
  group: THREE.Group;
  update: (elapsed: number) => void;
  dispose: () => void;
}

export async function createLaundryRoom(
  tier: DeviceTier = getDeviceTier(),
): Promise<LaundryRoom> {
  const group = new THREE.Group();
  group.name = 'laundry-room';
  group.renderOrder = 0;

  group.add(createSevillaInterior());

  const columns = COLUMN_COUNT[tier];
  const { wallGroup, animatedColumnX } = await buildMachineWall(columns);
  group.add(wallGroup);

  // Door animation on the center-right machine (porthole closest to x=0)
  const doorAnim = createMachineAnimation(animatedColumnX);
  group.add(doorAnim.group);

  // Collect disposable materials
  const disposables: THREE.Material[] = [];
  group.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const { material } = child;
      if (Array.isArray(material)) disposables.push(...material);
      else disposables.push(material);
    }
  });

  const update = (elapsed: number): void => {
    doorAnim.update(elapsed);
  };

  const dispose = (): void => {
    doorAnim.dispose();
    group.traverse((child) => {
      if (child instanceof THREE.Mesh) child.geometry.dispose();
    });
    for (const mat of new Set(disposables)) mat.dispose();
  };

  return { group, update, dispose };
}

export { WALL_Z };
