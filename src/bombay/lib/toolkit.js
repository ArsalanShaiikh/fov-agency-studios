// "The toolkit": the hero's 3D sculpture. Six objects, one per service the
// agency sells. The pointer pushes them aside (they spring back), hovering
// names the service and clicking opens it. Plain three.js, in its own chunk.
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

const extrude = (shape, depth) =>
  new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.1, bevelSegments: 8, curveSegments: 32 }).center()

function play() {
  const s = new THREE.Shape()
  s.moveTo(-0.55, -0.7)
  s.lineTo(0.8, 0)
  s.lineTo(-0.55, 0.7)
  s.closePath()
  return extrude(s, 0.42)
}

function cursor() {
  const s = new THREE.Shape()
  s.moveTo(0, 0)
  s.lineTo(0, -1.5)
  s.lineTo(0.38, -1.12)
  s.lineTo(0.66, -1.72)
  s.lineTo(0.9, -1.6)
  s.lineTo(0.62, -1.02)
  s.lineTo(1.12, -1.02)
  s.closePath()
  return extrude(s, 0.3)
}

function heart() {
  const s = new THREE.Shape()
  s.moveTo(0, -0.9)
  s.bezierCurveTo(-0.2, -0.7, -1.1, -0.2, -1.1, 0.3)
  s.bezierCurveTo(-1.1, 0.8, -0.55, 1.05, 0, 0.6)
  s.bezierCurveTo(0.55, 1.05, 1.1, 0.8, 1.1, 0.3)
  s.bezierCurveTo(1.1, -0.2, 0.2, -0.7, 0, -0.9)
  return extrude(s, 0.38)
}

export function startToolkit(canvas, { reduceMotion = false, labels, onHover, onPick, fit = 'hero' } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = envMap

  // Brand lighting: a warm sand key, a maroon rim, a sky fill so chrome reads.
  const key = new THREE.DirectionalLight(0xffe7c4, 2.4)
  key.position.set(4, 6, 6)
  const rim = new THREE.DirectionalLight(0xb3202c, 3)
  rim.position.set(-6, -3, 2)
  const fill = new THREE.DirectionalLight(0xaec4d4, 0.9)
  fill.position.set(0, -6, 4)
  scene.add(key, rim, fill)

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
  camera.position.set(0, 0, 16)

  const chrome = new THREE.MeshPhysicalMaterial({ color: 0xfff4ec, metalness: 1, roughness: 0.08 })
  const gloss = (color) => new THREE.MeshPhysicalMaterial({ color, metalness: 0.05, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.05 })
  const materials = [chrome]

  // One root per service; anchors are in cluster units (radius about 2.6).
  const build = []
  const add = (index, root, anchor, scale) => build.push({ index, root, anchor: new THREE.Vector3(...anchor), scale })

  add(0, new THREE.Mesh(cursor(), chrome), [-1.35, 1.25, 0.6], 0.95)

  const maroonGloss = gloss(0x790d16)
  materials.push(maroonGloss)
  add(1, new THREE.Mesh(play(), maroonGloss), [1.35, 1.45, -0.4], 1)

  const skyGloss = gloss(0xaec4d4)
  materials.push(skyGloss)
  add(2, new THREE.Mesh(heart(), skyGloss), [1.75, -0.55, 0.7], 0.85)

  // Magnifier: SEO.
  const sand = gloss(0xe5d3af)
  materials.push(sand)
  const glass = new THREE.Group()
  const lens = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.14, 32, 80), sand)
  const handle = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.75, 12, 24), sand)
  handle.position.set(0.62, -0.62, 0)
  handle.rotation.z = Math.PI / 4
  glass.add(lens, handle)
  add(3, glass, [-1.7, -0.85, 0.1], 0.95)

  // Linked rings: CRM, everything connected.
  const rings = new THREE.Group()
  const ringA = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.13, 32, 80), chrome)
  const ringB = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.13, 32, 80), skyGloss)
  ringA.position.x = -0.32
  ringB.position.x = 0.32
  ringB.rotation.y = Math.PI / 2
  rings.add(ringA, ringB)
  add(4, rings, [0.05, -1.75, -0.6], 1)

  // Cut gem: branding.
  const gemMat = new THREE.MeshPhysicalMaterial({ color: 0xf5efe1, metalness: 0.9, roughness: 0.12, iridescence: 1, iridescenceIOR: 1.8, flatShading: true })
  materials.push(gemMat)
  add(5, new THREE.Mesh(new THREE.OctahedronGeometry(0.85, 0), gemMat), [0.05, 0.15, 0.3], 1.05)

  const cluster = new THREE.Group()
  scene.add(cluster)

  const items = build.map((b, i) => {
    const holder = new THREE.Group()
    holder.add(b.root)
    b.root.rotation.set(0.4 * i, 0.7 * i, 0.2 * i)
    b.root.traverse((m) => {
      if (m.isMesh) m.userData.item = i
    })
    cluster.add(holder)
    return {
      ...b,
      holder,
      offset: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      hover: 0,
      spin: new THREE.Vector3(0.12 + (i % 3) * 0.05, 0.18 + (i % 2) * 0.1, 0.04),
      phase: i * 1.1,
      delay: 0.3 + i * 0.1,
    }
  })

  // Small beads orbiting the sculpture: atmosphere, not interactive.
  const beads = Array.from({ length: 7 }, (_, i) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.11 + (i % 3) * 0.05, 24, 24), i % 2 ? chrome : sand)
    cluster.add(m)
    return { m, r: 2.9 + (i % 3) * 0.35, a: (i / 7) * Math.PI * 2, s: 0.12 + (i % 4) * 0.03, y: ((i % 5) - 2) * 0.5 }
  })

  // Layout: right half on desktop, below the headline on phones.
  const view = { halfW: 1, halfH: 1, mobile: false }
  const resize = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    view.halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z
    view.halfW = view.halfH * camera.aspect
    view.mobile = camera.aspect < 0.9
    if (fit === 'tile') {
      // Centred in its own box (the hero's middle tile).
      cluster.scale.setScalar(Math.min(view.halfH, view.halfW) / 4)
      cluster.position.set(0, 0, 0)
      return
    }
    const scale = view.mobile ? Math.min(view.halfW / 3.4, 0.95) : Math.min(view.halfH / 3.6, view.halfW / 6.6)
    cluster.scale.setScalar(scale)
    cluster.position.set(view.mobile ? 0 : view.halfW * 0.42, view.mobile ? -view.halfH * 0.5 : -view.halfH * 0.02, 0)
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  // Pointer: world position on the z = 0 plane, plus raycast for hover.
  const ndc = new THREE.Vector2(9, 9)
  const pointerWorld = new THREE.Vector3(999, 999, 0)
  const tilt = { x: 0, y: 0, tx: 0, ty: 0 }
  const raycaster = new THREE.Raycaster()
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
  let hovered = -1
  let last = { x: 0, y: 0 }

  const onMove = (e) => {
    const r = canvas.getBoundingClientRect()
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    tilt.tx = ndc.x
    tilt.ty = ndc.y
    last = { x: e.clientX, y: e.clientY }
    raycaster.setFromCamera(ndc, camera)
    raycaster.ray.intersectPlane(plane, pointerWorld)
    // Reduced motion draws on demand only.
    if (reduceMotion && !raf) raf = requestAnimationFrame(frame)
  }
  const onLeave = () => {
    ndc.set(9, 9)
    pointerWorld.set(999, 999, 0)
  }
  const onClick = () => {
    if (hovered >= 0) onPick?.(items[hovered].index)
  }
  canvas.addEventListener('pointermove', onMove, { passive: true })
  canvas.addEventListener('pointerleave', onLeave)
  canvas.addEventListener('click', onClick)

  let visible = true
  let raf = 0
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting
    if (visible && !raf) raf = requestAnimationFrame(frame)
  })
  io.observe(canvas)

  const ease = (t) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 4)
  const local = new THREE.Vector3()
  const start = performance.now()
  let prev = start

  function frame(now) {
    raf = 0
    const dt = Math.min(0.05, (now - prev) / 1000)
    prev = now
    const t = reduceMotion ? 3 : (now - start) / 1000

    // Hover via raycast against the objects.
    raycaster.setFromCamera(ndc, camera)
    const hit = raycaster.intersectObjects(
      items.map((i) => i.root),
      true,
    )[0]
    const next = hit ? hit.object.userData.item : -1
    if (next !== hovered) {
      hovered = next
      canvas.style.cursor = hovered >= 0 ? 'pointer' : ''
      onHover?.(hovered >= 0 ? labels[items[hovered].index] : null, last)
    } else if (hovered >= 0) {
      onHover?.(labels[items[hovered].index], last)
    }

    tilt.x += (tilt.tx - tilt.x) * 0.04
    tilt.y += (tilt.ty - tilt.y) * 0.04
    cluster.rotation.y = tilt.x * 0.35 + (reduceMotion ? 0 : Math.sin(t * 0.2) * 0.15)
    cluster.rotation.x = -tilt.y * 0.2

    // Pointer in cluster space, for the push.
    local.copy(pointerWorld)
    cluster.worldToLocal(local)

    for (const it of items) {
      const k = reduceMotion ? 1 : ease((t - it.delay) / 1.5)
      // Spring back to the anchor, pushed away from the pointer when close.
      const pos = it.holder.position
      const dx = pos.x - local.x
      const dy = pos.y - local.y
      const dist = Math.hypot(dx, dy)
      // The hovered object holds still (so it can be read and clicked); its neighbours dodge.
      const radius = 1.6
      const isHovered = hovered === items.indexOf(it)
      if (!reduceMotion && !isHovered && dist < radius && dist > 0.001) {
        const f = ((radius - dist) / radius) * 18
        it.velocity.x += (dx / dist) * f * dt
        it.velocity.y += (dy / dist) * f * dt
      }
      it.velocity.addScaledVector(it.offset, -14 * dt)
      it.velocity.multiplyScalar(1 - 5 * dt)
      it.offset.addScaledVector(it.velocity, dt)

      const bob = reduceMotion ? 0 : Math.sin(t * 0.9 + it.phase) * 0.12
      pos.set(it.anchor.x + it.offset.x, it.anchor.y + it.offset.y + bob, it.anchor.z)

      it.hover += ((hovered === items.indexOf(it) ? 1 : 0) - it.hover) * 0.12
      it.holder.scale.setScalar(Math.max(0.0001, it.scale * k * (1 + it.hover * 0.18)))
      if (!reduceMotion) {
        const boost = 1 + it.hover * 3
        it.root.rotation.x += it.spin.x * dt * boost
        it.root.rotation.y += it.spin.y * dt * boost
        it.root.rotation.z += it.spin.z * dt
      }
    }

    for (const b of beads) {
      const a = b.a + (reduceMotion ? 0 : t * b.s)
      b.m.position.set(Math.cos(a) * b.r, b.y + Math.sin(a * 2) * 0.2, Math.sin(a) * b.r * 0.5)
      b.m.scale.setScalar(Math.max(0.0001, reduceMotion ? 1 : ease((t - 1.2) / 1.5)))
    }

    renderer.render(scene, camera)
    if (visible && !document.hidden && !reduceMotion) raf = requestAnimationFrame(frame)
  }

  const onVisibility = () => {
    if (!document.hidden && visible && !raf) {
      prev = performance.now()
      raf = requestAnimationFrame(frame)
    }
  }
  document.addEventListener('visibilitychange', onVisibility)
  raf = requestAnimationFrame(frame)

  return () => {
    cancelAnimationFrame(raf)
    ro.disconnect()
    io.disconnect()
    canvas.removeEventListener('pointermove', onMove)
    canvas.removeEventListener('pointerleave', onLeave)
    canvas.removeEventListener('click', onClick)
    document.removeEventListener('visibilitychange', onVisibility)
    scene.traverse((o) => o.geometry?.dispose())
    materials.forEach((m) => m.dispose())
    envMap.dispose()
    pmrem.dispose()
    renderer.dispose()
  }
}
