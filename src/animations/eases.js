import { CustomEase } from 'gsap/CustomEase'

// Camera-language eases. Never fall back to linear or power1 for reveals.
export const EASES = {
  // Reveals and settles: long, confident deceleration. The default.
  lens: 'M0,0 C0.16,1 0.3,1 1,1',
  // Cuts: overlays, menu, project transitions.
  shutter: 'M0,0 C0.76,0 0.24,1 1,1',
  // Timed blur-to-sharp: a short hunt, then lock.
  focus: 'M0,0 C0.45,0 0.15,1 1,1',
  // Autofocus brackets snapping onto a target; magnetic release.
  lock: 'M0,0 C0.3,1.4 0.45,1 1,1',
  // Something rushing toward the lens (the wordmark passing the camera).
  approach: 'M0,0 C0.6,0 0.9,0.35 1,1',
}

export const DURATION = {
  micro: 0.3,
  bracket: 0.5,
  reveal: 0.9,
  display: 1.1,
  cut: 1.1,
}

export const STAGGER = {
  lines: 0.08,
  words: 0.025,
  chars: 0.08,
  items: 0.1,
}

let registered = false
export function registerEases() {
  if (registered) return
  Object.entries(EASES).forEach(([name, path]) => CustomEase.create(name, path))
  registered = true
}

// Plain-JS version of `shutter` for Lenis.scrollTo (expects t -> t).
export const shutterFn = (t) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2)
