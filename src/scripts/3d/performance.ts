export type DeviceTier = 'mobile' | 'tablet' | 'desktop';

export const PARTICLE_LIMITS = {
  mobile: 100,
  tablet: 250,
  desktop: 500,
} as const;

export const DPR_CAPS = {
  mobile: 1.5,
  tablet: 2,
  desktop: 2,
} as const;

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function getDeviceTier(): DeviceTier {
  if (prefersReducedMotion()) return 'mobile';

  const width = window.innerWidth;
  const cores = navigator.hardwareConcurrency ?? 4;

  if (width <= 768 || cores <= 4) return 'mobile';
  if (width <= 1024) return 'tablet';
  return 'desktop';
}

export function getParticleLimit(tier: DeviceTier = getDeviceTier()): number {
  return PARTICLE_LIMITS[tier];
}

export function getDprCap(tier: DeviceTier = getDeviceTier()): number {
  return DPR_CAPS[tier];
}

export function isCursorInteractionEnabled(): boolean {
  return !prefersReducedMotion();
}
