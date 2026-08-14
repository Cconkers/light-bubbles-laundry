import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const WASH_MACHINE_GLTF = '/models/wash-machine/scene.gltf';

let modelPromise: Promise<THREE.Group> | null = null;

/** Carga el modelo GLTF de lavadora+secadora y lo cachea. */
function loadWashMachineModel(): Promise<THREE.Group> {
  if (modelPromise) return modelPromise;

  modelPromise = (async () => {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(WASH_MACHINE_GLTF);

    const group = new THREE.Group();
    group.name = 'wash-machine';
    group.add(gltf.scene);

    group.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });

    return group;
  })();

  return modelPromise;
}

/** Clona un grupo duplicando también los materiales para que cada instancia sea independiente. */
export function cloneModelWithMaterials(model: THREE.Group): THREE.Group {
  const clone = model.clone(true);
  clone.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const mat = child.material as THREE.Material | THREE.Material[];
      child.material = Array.isArray(mat) ? mat.map((m) => m.clone()) : mat.clone();
    }
  });
  return clone;
}

/**
 * Escala el modelo uniformemente para que su ancho encaje en targetWidth,
 * centra en X/Z y apoya la base en y=0.
 * Devuelve la altura final del modelo escalado.
 */
export function normalizeModelToFloor(model: THREE.Group, targetWidth: number): number {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const scale = targetWidth / Math.max(size.x, 0.001);

  model.scale.setScalar(scale);
  model.updateMatrixWorld(true);

  const scaled = new THREE.Box3().setFromObject(model);
  model.position.x -= (scaled.min.x + scaled.max.x) * 0.5;
  model.position.y -= scaled.min.y;
  model.position.z -= (scaled.min.z + scaled.max.z) * 0.5;
  model.updateMatrixWorld(true);

  const final = new THREE.Box3().setFromObject(model);
  return final.max.y - final.min.y;
}

/** Crea una unidad de lavadora+secadora escalada al ancho indicado. */
export async function createStackedColumn(targetWidth: number): Promise<THREE.Group> {
  const base = await loadWashMachineModel();
  const column = cloneModelWithMaterials(base);
  normalizeModelToFloor(column, targetWidth);
  return column;
}
