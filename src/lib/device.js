// Capability checks used to pick a quality tier (DESIGN.md §6, quality tiers).

export function detectWebGL() {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2')
    const ok = !!gl
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    return ok
  } catch {
    return false
  }
}

export function detectTier() {
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const cores = navigator.hardwareConcurrency || 4
  const memory = navigator.deviceMemory || 8
  if (coarse || cores <= 4 || memory <= 4) return 'low'
  if (cores >= 8 && memory >= 8) return 'high'
  return 'mid'
}

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const hasFinePointer = () => window.matchMedia('(pointer: fine)').matches

/** Cap total canvas pixels (~8.3M, i.e. 4K at DPR 1) so 4K/5K screens stay smooth. */
export function maxDpr(tier) {
  const base = tier === 'high' ? 2 : 1.5
  const px = window.innerWidth * window.innerHeight
  return Math.max(1, Math.min(base, window.devicePixelRatio || 1, Math.sqrt(8_300_000 / px)))
}
