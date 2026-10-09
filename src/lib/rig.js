/**
 * The camera rig: plain mutable numbers that GSAP ScrollTriggers scrub and the
 * R3F scene reads every frame. No React state, so scrolling never re-renders.
 * Each property is owned by exactly one section (DESIGN.md §6, lens map).
 */
export const rig = {
  // Hero
  dolly: 0, // 0..1  dolly zoom, 8° -> 78°
  through: 0, // 0..1  camera passes through the subject frame
  // Manifesto / Services travel down the tunnel
  travelA: 0,
  travelB: 0,
  // Manifesto: 0 = focus on the subject plane, 1 = focus at infinity (bokeh)
  focus: 0,
  // Services: lens index 0..2 (24 / 50 / 85mm) and how much the lens overrides the dolly FOV
  lens: 0,
  lensMix: 0,
  // World states driven by the active lens
  spread: 0, // 3D Websites: frames widen into a room
  wave: 0, // Motion: staggered rotation wave
  align: 0, // Video: frames flatten and align
  showModel: 0, // Video: vintage camera fades in
  // Work / Open dim the world
  dim: 0,
  // Process: lateral truck, -1..1
  truck: 0,
  // End card: pull back to the opening frame
  end: 0,
  // Preloader focus confirm flash on the subject frame
  lock: 0,
  // Scene fade-in once loaded
  intro: 0,
  // Work: lens distortion input from scroll velocity (written by Lenis)
  velocity: 0,
}

/** Latest camera values, written by the scene (or the readout fallback). */
export const cameraOut = { fov: 8, focal: 171, z: 13, x: 0, k: 0.55 }

/** Reduced-motion still: a single mid-zoom frame. */
export function applyStillRig() {
  rig.dolly = 0.42
  rig.through = 0
  rig.intro = 1
}

/** Pointer in normalised device coords (-1..1, y up). `active` is 1 for mice. */
export const pointer = { x: 0, y: 0, active: 0 }

/** Lens-state weights derived from rig.lens / rig.lensMix by the 3D world. */
export const lensWeights = { spread: 0, wave: 0, align: 0 }
