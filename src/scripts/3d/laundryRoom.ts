import * as THREE from 'three';

import { type DeviceTier, getDeviceTier } from './performance';
import { createStackedColumn } from './modelLoader';

const COLUMN_COUNT: Record<DeviceTier, number> = {
  mobile: 3,
  tablet: 4,
  desktop: 6,
};

const DOBLE_WASHER_WIDTH = 3.90; // Ancho del par de lavadoras
const GAP_IN_BETWEEN_WASHERS = 0; // Separacion del par de lavadoras
const WALL_Z = -1; // Posicion de la pared

export const LAUNDRY_POV_TARGET = new THREE.Vector3(0, 1.72, WALL_Z + 0.65);

function createSevillaInterior(): THREE.Group {
  const env = new THREE.Group();

  const floorMat = new THREE.MeshStandardMaterial({
    color: 0xe8ddd0,
    roughness: 0.78,
    metalness: 0.02,
  });
  const floorAlt = new THREE.MeshStandardMaterial({
    color: 0xe8ddd0,
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
    color: 0xffffff,
    roughness: 0.92,
    metalness: 0,
  });
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(14, 9), ceilingMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, 4.6, 1);
  env.add(ceiling);

  const lightMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xfff9e6,
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

async function buildMachineWall(columns: number): Promise<THREE.Group> {
  const wallGroup = new THREE.Group();
  const totalWidth = columns * DOBLE_WASHER_WIDTH + (columns - 1) * GAP_IN_BETWEEN_WASHERS;
  const startX = -totalWidth * 0.5 + DOBLE_WASHER_WIDTH * 0.5;

  const columnPromises = Array.from({ length: columns }, () =>
    createStackedColumn(DOBLE_WASHER_WIDTH),
  );
  const stackedColumns = await Promise.all(columnPromises);

  stackedColumns.forEach((column, index) => {
    column.position.set(startX + index * (DOBLE_WASHER_WIDTH + GAP_IN_BETWEEN_WASHERS), 0, WALL_Z);
    wallGroup.add(column);
  });

  return wallGroup;
}

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
  const machineWall = await buildMachineWall(columns);
  group.add(machineWall);

  const disposables: THREE.Material[] = [];

  group.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const { material } = child;
      if (Array.isArray(material)) {
        disposables.push(...material);
      } else {
        disposables.push(material);
      }
    }
  });

  const update = (_elapsed: number) => {
    // Reservado para animaciones futuras (tambores, luces)
  };

  const dispose = () => {
    group.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
      }
    });

    const uniqueMaterials = [...new Set(disposables)];
    for (const material of uniqueMaterials) {
      material.dispose();
    }
  };

  return { group, update, dispose };
}

export { WALL_Z };
