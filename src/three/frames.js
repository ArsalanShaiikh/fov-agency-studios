import * as THREE from 'three'
import { frameVertex, frameFragment } from './shaders/frame'
import { dustVertex, dustFragment, windowVertex, windowFragment } from './shaders/dust'

const RATIOS = [2.39, 1.85, 16 / 9, 4 / 3, 1, 4 / 5, 9 / 16]
const PAPER = '#e9e8e4'
const SIGNAL = '#e9c440'
const WINDOW = '#fff4d6'

/** Deterministic PRNG so the tunnel is identical on every visit. */
export function prng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Frame layout. Index 0 is always the subject frame at z = 0 (resized to the
 * viewport ratio at runtime). Frames in front of it are few, calm and
 * viewport-shaped so the 8° state reads as clean nested frames; frames
 * behind are denser near the subject and fall away into depth.
 */
export function buildFrameData({ seed = 7, behind = 40, front = 5, depth = 62 } = {}) {
  const rnd = prng(seed)
  const frames = [{ z: 0, w: 1.6, h: 1, rot: 0, ox: 0, oy: 0, seed: 0, subject: 1 }]

  const frontZ = [1.5, 2.7, 4.1, 5.8, 7.8, 10.1, 12.4].slice(0, front)
  frontZ.forEach((z, i) => {
    const h = 1.12 + i * 0.08 + rnd() * 0.08
    frames.push({ z, w: h * (1.58 + rnd() * 0.1), h, rot: (rnd() - 0.5) * 0.01, ox: (rnd() - 0.5) * 0.02, oy: (rnd() - 0.5) * 0.015, seed: 0.05 + rnd() * 0.3, subject: 0 })
  })

  for (let i = 0; i < behind; i++) {
    const f = (i + 1) / behind
    const z = -0.8 - depth * Math.pow(f, 1.35)
    const near = f < 0.25
    const r = RATIOS[Math.floor(rnd() * RATIOS.length)]
    const h = near ? 1.0 + rnd() * 0.75 : 0.72 + rnd() * 0.7
    frames.push({
      z,
      w: Math.min(h * r, 3.2),
      h: r < 1 ? Math.min(h * 1.25, 2.2) : h,
      rot: (rnd() - 0.5) * (near ? 0.024 : 0.04),
      ox: (rnd() - 0.5) * 0.09,
      oy: (rnd() - 0.5) * 0.06,
      seed: 0.2 + f * 0.8 * rnd(),
      subject: 0,
    })
  }
  return frames
}

export function frameUniforms() {
  return {
    uTime: { value: 0 },
    uIntro: { value: 0 },
    uSpread: { value: 0 },
    uWave: { value: 0 },
    uAlign: { value: 0 },
    uPointer: { value: new THREE.Vector2() },
    uWorldPerPixel: { value: 0.001 },
    uBaseWidth: { value: 0.0042 },
    uFocusDist: { value: 13 },
    uAperture: { value: 0.03 },
    uFogNear: { value: 6 },
    uFogFar: { value: 58 },
    uLock: { value: 0 },
    uDim: { value: 0 },
    uColor: { value: new THREE.Color(PAPER) },
    uSignal: { value: new THREE.Color(SIGNAL) },
  }
}

/** One draw call for every frame: instanced border bands. */
export function createFrameMesh(frames, uniforms) {
  const geometry = new THREE.InstancedBufferGeometry()
  const corners = [-0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5]
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(24), 3))
  geometry.setAttribute('aCorner', new THREE.BufferAttribute(new Float32Array([...corners, ...corners]), 2))
  geometry.setAttribute('aSide', new THREE.BufferAttribute(new Float32Array([0, 0, 0, 0, 1, 1, 1, 1]), 1))
  const index = []
  for (let e = 0; e < 4; e++) {
    const a = e
    const b = (e + 1) % 4
    index.push(a, b, 4 + b, a, 4 + b, 4 + a)
  }
  geometry.setIndex(index)

  const n = frames.length
  const center = new Float32Array(n * 3)
  const size = new Float32Array(n * 2)
  const jitter = new Float32Array(n * 3)
  const seed = new Float32Array(n)
  const subject = new Float32Array(n)
  frames.forEach((f, i) => {
    center.set([0, 0, f.z], i * 3)
    size.set([f.w, f.h], i * 2)
    jitter.set([f.rot, f.ox, f.oy], i * 3)
    seed[i] = f.seed
    subject[i] = f.subject
  })
  geometry.setAttribute('aCenter', new THREE.InstancedBufferAttribute(center, 3))
  geometry.setAttribute('aSize', new THREE.InstancedBufferAttribute(size, 2))
  geometry.setAttribute('aJitter', new THREE.InstancedBufferAttribute(jitter, 3))
  geometry.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seed, 1))
  geometry.setAttribute('aSubject', new THREE.InstancedBufferAttribute(subject, 1))
  geometry.instanceCount = n

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: frameVertex,
    fragmentShader: frameFragment,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.frustumCulled = false
  mesh.renderOrder = 2
  return mesh
}

/** Resize the subject frame (instance 0) to a given width:height. */
export function setSubjectSize(mesh, w, h = 1) {
  const attr = mesh.geometry.getAttribute('aSize')
  if (attr.array[0] === w && attr.array[1] === h) return
  attr.array[0] = w
  attr.array[1] = h
  attr.needsUpdate = true
}

export function dustUniforms(shared) {
  return {
    uTime: shared.uTime,
    uWorldPerPixel: shared.uWorldPerPixel,
    uFocusDist: shared.uFocusDist,
    uAperture: shared.uAperture,
    uFogNear: shared.uFogNear,
    uFogFar: shared.uFogFar,
    uDim: shared.uDim,
    uPointer: shared.uPointer,
    uIntro: { value: 0 },
    uPixelRatio: { value: 1 },
    uTanHalf: { value: 0.07 },
    uAspect: { value: 1.6 },
    uPointerActive: { value: 0 },
    uColor: { value: new THREE.Color(PAPER) },
  }
}

export function createDust(count, uniforms, seed = 11) {
  const rnd = prng(seed)
  const pos = new Float32Array(count * 3)
  const seeds = new Float32Array(count)
  const scale = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (rnd() - 0.5) * 6.4
    pos[i * 3 + 1] = (rnd() - 0.5) * 4.4
    pos[i * 3 + 2] = 13 - rnd() * 76
    seeds[i] = rnd()
    scale[i] = 0.003 + rnd() * rnd() * 0.012
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
  geometry.setAttribute('aScale', new THREE.BufferAttribute(scale, 1))
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: dustVertex,
    fragmentShader: dustFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  })
  const points = new THREE.Points(geometry, material)
  points.frustumCulled = false
  points.renderOrder = 3
  return points
}

export function createWindow(z = -66) {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(WINDOW) },
      uIntro: { value: 0 },
      uDim: { value: 0 },
      uAspect: { value: 1.7 },
    },
    vertexShader: windowVertex,
    fragmentShader: windowFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(14, 8.2), material)
  material.uniforms.uAspect.value = 14 / 8.2
  mesh.position.z = z
  mesh.renderOrder = 1
  return mesh
}
