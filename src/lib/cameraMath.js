// Pure camera maths shared by the 3D rig and the DOM readout (no three.js import,
// so the readout and the CSS fallback stay in the main bundle).

const DEG = Math.PI / 180

export const FOV_START = 8 // ~171mm
export const FOV_WIDE = 78 // ~15mm
export const LENSES_MM = [24, 50, 85]

/** Full-frame equivalent focal length for a vertical FOV (24mm sensor height). */
export const focalFromFov = (fov) => 12 / Math.tan((fov * DEG) / 2)
export const fovFromFocal = (mm) => (2 * Math.atan(12 / mm)) / DEG

const lerp = (a, b, t) => a + (b - a) * t

/** Interpolate two FOVs in log-focal space so zooms feel even. */
export function mixFov(a, b, t) {
  const fa = Math.log(focalFromFov(a))
  const fb = Math.log(focalFromFov(b))
  return fovFromFocal(Math.exp(lerp(fa, fb, t)))
}

/** Hero dolly: t in 0..1 -> FOV between FOV_START and FOV_WIDE. */
export const fovAt = (t) => mixFov(FOV_START, FOV_WIDE, t)

/** Services lens: continuous index 0..2 across 24 / 50 / 85mm. */
export function lensFov(index) {
  const i = Math.max(0, Math.min(LENSES_MM.length - 1.0001, index))
  const a = Math.floor(i)
  const t = i - a
  const fa = Math.log(LENSES_MM[a])
  const fb = Math.log(LENSES_MM[Math.min(a + 1, LENSES_MM.length - 1)])
  return fovFromFocal(Math.exp(lerp(fa, fb, t)))
}

/**
 * The subject frame (the innermost window). Landscape: the visitor's own
 * viewport ratio. Portrait: a vertical frame for the stacked wordmark.
 * k = the frame's share of viewport height; w = frame width when height = 1.
 */
export function subjectFrame(aspect) {
  if (aspect >= 1) return { k: 0.55, w: Math.min(aspect, 2.39), h: 1 }
  const k = 0.62
  return { k, w: Math.min((0.84 * aspect) / k, 0.8), h: 1 }
}

/** Camera distance that keeps the subject frame the same size on screen. */
export const dollyDistance = (fov, k) => 1 / (2 * k * Math.tan((fov * DEG) / 2))

/**
 * Resolve the rig into a camera state.
 * @returns {{fov:number, focal:number, z:number, x:number, k:number}}
 */
export function computeCamera(rig, aspect, out = {}) {
  const { k } = subjectFrame(aspect)

  let fov = fovAt(rig.dolly)
  let z = dollyDistance(fov, k)
  z -= rig.through * 2.4 + rig.travelA * 5 + rig.travelB * 6

  if (rig.lensMix > 0) fov = mixFov(fov, lensFov(rig.lens), rig.lensMix)

  let x = rig.truck * 1.1

  if (rig.end > 0) {
    fov = mixFov(fov, FOV_START, rig.end)
    z = lerp(z, dollyDistance(FOV_START, k), rig.end)
    x = lerp(x, 0, rig.end)
  }

  out.fov = fov
  out.focal = focalFromFov(fov)
  out.z = z
  out.x = x
  out.k = k
  return out
}
