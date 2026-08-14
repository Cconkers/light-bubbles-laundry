import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

const MODEL_BASE = '/models/kenney/';

/** GLB de Meshy (lavadora + secadora apiladas). Colocar en public/models/. */
const STACKED_GLB_URL = '/models/stacked-washer-dryer.glb';

const modelCache = new Map<string, Promise<THREE.Group>>();
let stackedGlbPromise: Promise<THREE.Group | null> | null = null;

/**
 * Intenta cargar el GLB apilado de Meshy. Devuelve null si el archivo
 * no existe todavía (fallback a los modelos Kenney).
 */
export function loadStackedGlb(): Promise<THREE.Group | null> {
  if (stackedGlbPromise) return stackedGlbPromise;

  stackedGlbPromise = (async () => {
    try {
      const head = await fetch(STACKED_GLB_URL, { method: 'HEAD' });
      if (!head.ok) return null;

      const loader = new GLTFLoader();
      const gltf = await loader.loadAsync(STACKED_GLB_URL);
      const group = new THREE.Group();
      group.name = 'stacked-glb';
      group.add(gltf.scene);

      group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = false;
          child.receiveShadow = false;
        }
      });

      return group;
    } catch {
      return null;
    }
  })();

  return stackedGlbPromise;
}

export function cloneModelWithMaterials(model: THREE.Group): THREE.Group {
  const clone = model.clone(true);
  clone.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const material = child.material as THREE.Material | THREE.Material[];
      child.material = Array.isArray(material)
        ? material.map((m) => m.clone())
        : material.clone();
    }
  });
  return clone;
}

function upgradeMaterial(material: THREE.Material): THREE.MeshStandardMaterial {
  if (material instanceof THREE.MeshStandardMaterial) {
    return material;
  }

  const source = material as THREE.MeshPhongMaterial;
  const name = source.name?.toLowerCase() ?? '';

  const upgraded = new THREE.MeshStandardMaterial({
    color: source.color,
    transparent: source.transparent,
    opacity: source.opacity,
    roughness: name.includes('glass') ? 0.08 : name.includes('metal') ? 0.28 : 0.52,
    metalness: name.includes('glass') ? 0.05 : name.includes('metal') ? 0.82 : 0.06,
  });

  if (name.includes('glass')) {
    upgraded.transparent = true;
    upgraded.opacity = 0.55;
    upgraded.depthWrite = false;
  }

  source.dispose();
  return upgraded;
}

export function loadKenneyModel(name: string): Promise<THREE.Group> {
  const cached = modelCache.get(name);
  if (cached) return cached;

  const loadPromise = (async () => {
    const mtlLoader = new MTLLoader();
    mtlLoader.setPath(MODEL_BASE);
    const materials = await mtlLoader.loadAsync(`${name}.mtl`);
    materials.preload();

    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath(MODEL_BASE);

    const object = await objLoader.loadAsync(`${name}.obj`);
    const group = new THREE.Group();
    group.name = name;
    group.add(object);

    object.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.material = upgradeMaterial(child.material as THREE.Material);
      child.castShadow = false;
      child.receiveShadow = false;
    });

    return group;
  })();

  modelCache.set(name, loadPromise);
  return loadPromise;
}

/** Escala uniforme, centra en X/Z y apoya la base en y=0. Devuelve altura final. */
export function normalizeModelToFloor(model: THREE.Group, targetWidth: number): number {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const scale = targetWidth / Math.max(size.x, 0.001);

  model.scale.setScalar(scale);
  model.updateMatrixWorld(true);

  const scaledBox = new THREE.Box3().setFromObject(model);
  const centerX = (scaledBox.min.x + scaledBox.max.x) * 0.5;
  const centerZ = (scaledBox.min.z + scaledBox.max.z) * 0.5;

  model.position.x -= centerX;
  model.position.y -= scaledBox.min.y;
  model.position.z -= centerZ;
  model.updateMatrixWorld(true);

  const finalBox = new THREE.Box3().setFromObject(model);
  return finalBox.max.y - finalBox.min.y;
}

export async function createStackedColumn(targetWidth: number): Promise<THREE.Group> {
  const stackedGlb = await loadStackedGlb();

  if (stackedGlb) {
    const column = cloneModelWithMaterials(stackedGlb);
    normalizeModelToFloor(column, targetWidth);
    return column;
  }

  return createKenneyStackedColumn(targetWidth);
}

export async function createKenneyStackedColumn(targetWidth: number): Promise<THREE.Group> {
  const [washer, dryer] = await Promise.all([
    loadKenneyModel('washer'),
    loadKenneyModel('dryer'),
  ]);

  const washerClone = washer.clone(true);
  const dryerClone = dryer.clone(true);

  washerClone.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = (child.material as THREE.MeshStandardMaterial).clone();
    }
  });
  dryerClone.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = (child.material as THREE.MeshStandardMaterial).clone();
    }
  });

  const washerHeight = normalizeModelToFloor(washerClone, targetWidth);
  normalizeModelToFloor(dryerClone, targetWidth);
  dryerClone.position.y = washerHeight + 0.05;

  const column = new THREE.Group();
  column.name = 'stacked-column';
  column.add(washerClone, dryerClone);
  return column;
}

export async function createKenneyWallSegment(
  name: string,
  targetWidth: number,
): Promise<THREE.Group> {
  const wall = await loadKenneyModel(name);
  const clone = wall.clone(true);
  normalizeModelToFloor(clone, targetWidth);
  return clone;
}
