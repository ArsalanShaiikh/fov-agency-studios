import * as THREE from 'three'
import { media, anyHover } from '../lib/mediaState'
import { rig } from '../lib/rig'
import { mediaVertex, mediaFragment } from './shaders/media'

/**
 * Draws a shader plane exactly over each registered Work media box, in pixel
 * space, after the main scene. The DOM keeps layout, links, alt text and the
 * placeholder label; WebGL only paints pixels.
 */
export class WorkPlanes {
  constructor() {
    this.scene = new THREE.Scene()
    this.camera = new THREE.OrthographicCamera(0, 1, 0, -1, -10, 10)
    this.geometry = new THREE.PlaneGeometry(1, 1, 32, 12)
    this.loader = new THREE.TextureLoader()
    this.items = new Map()
    this.velocity = 0
    document.documentElement.dataset.webglMedia = ''
  }

  ensure(id, m) {
    let item = this.items.get(id)
    if (item) return item
    const uniforms = {
      uTime: { value: 0 },
      uVelocity: { value: 0 },
      uHover: { value: 0 },
      uOthers: { value: 0 },
      uReveal: { value: 0 },
      uRatio: { value: 1 },
      uSeed: { value: m.seed ?? this.items.size },
      uHasMap: { value: 0 },
      uMapRatio: { value: 1 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMap: { value: null },
      uInk: { value: new THREE.Color('#141413') },
      uPaper: { value: new THREE.Color('#e9e8e4') },
      uSignal: { value: new THREE.Color('#e9c440') },
    }
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: mediaVertex,
      fragmentShader: mediaFragment,
      toneMapped: false,
    })
    const mesh = new THREE.Mesh(this.geometry, material)
    mesh.frustumCulled = false
    this.scene.add(mesh)
    if (m.image) {
      this.loader.load(m.image, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 4
        uniforms.uMap.value = tex
        uniforms.uMapRatio.value = tex.image.width / tex.image.height
        uniforms.uHasMap.value = 1
      })
    }
    item = { mesh, uniforms, hover: 0, others: 0 }
    this.items.set(id, item)
    return item
  }

  render(gl, size, time) {
    const { width: W, height: H } = size
    if (this.camera.right !== W || this.camera.bottom !== -H) {
      this.camera.right = W
      this.camera.bottom = -H
      this.camera.updateProjectionMatrix()
    }

    const target = THREE.MathUtils.clamp(rig.velocity / 45, -1, 1)
    this.velocity += (target - this.velocity) * 0.12
    const hovering = anyHover()
    let drawn = 0

    for (const [id, m] of Object.entries(media)) {
      if (!m.el?.isConnected) continue
      const item = this.ensure(id, m)
      const r = m.el.getBoundingClientRect()
      const visible = r.width > 0 && r.bottom > -80 && r.top < H + 80
      item.mesh.visible = visible
      if (!visible) continue
      drawn++
      item.mesh.position.set(r.left + r.width / 2, -(r.top + r.height / 2), 0)
      item.mesh.scale.set(r.width, r.height, 1)
      item.hover += (m.hover - item.hover) * 0.1
      item.others += ((hovering && m.hover < 0.5 ? 1 : 0) - item.others) * 0.08
      const u = item.uniforms
      u.uTime.value = time
      u.uVelocity.value = this.velocity
      u.uHover.value = item.hover
      u.uOthers.value = item.others
      u.uReveal.value = m.reveal
      u.uRatio.value = r.width / r.height
      u.uMouse.value.set(m.mouseX, m.mouseY)
      u.uRes.value.set(r.width, r.height)
    }

    if (!drawn) return
    gl.clearDepth()
    gl.render(this.scene, this.camera)
  }

  dispose() {
    this.items.forEach(({ mesh, uniforms }) => {
      mesh.material.dispose()
      uniforms.uMap.value?.dispose()
    })
    this.geometry.dispose()
    delete document.documentElement.dataset.webglMedia
  }
}
