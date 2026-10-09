import * as THREE from 'three'
import { getState } from '../lib/store'
import { dollyDistance } from '../lib/cameraMath'
import { buildFrameData, frameUniforms, createFrameMesh, setSubjectSize, createWindow } from './frames'

const K = 0.5 // subject frame takes half the demo window's height
const INK = new THREE.Color('#0b0b0a')
const INK_2 = new THREE.Color('#141413')

/**
 * The Open section's live breakdown: a small copy of the tunnel rendered into
 * the [data-dolly-view] rectangle of the shared canvas (scissor), driven by
 * the visitor's slider. Same shader, same maths as the hero.
 */
export class DollyDemo {
  constructor() {
    this.scene = new THREE.Scene()
    this.uniforms = frameUniforms()
    this.frames = createFrameMesh(buildFrameData({ seed: 21, behind: 30, front: 5, depth: 52 }), this.uniforms)
    this.window = createWindow(-56)
    this.scene.add(this.window, this.frames)
    this.camera = new THREE.PerspectiveCamera(30, 1.6, 0.05, 140)
    this.el = null
    this.fov = 30
    this.uniforms.uIntro.value = 1
    this.uniforms.uLock.value = 1
    this.uniforms.uAperture.value = 0.012
    this.window.material.uniforms.uIntro.value = 1
    document.documentElement.dataset.webglDemo = ''
  }

  render(gl, size, time) {
    if (!this.el?.isConnected) {
      this.el = document.querySelector('[data-dolly-view]')
      this.tile = this.el?.closest('[data-dolly-tile]')
    }
    if (!this.el) return
    const tile = this.tile?.getBoundingClientRect()
    if (!tile || tile.bottom < 0 || tile.top > size.height) return
    const r = this.el.getBoundingClientRect()

    // Ease toward the slider value so dragging feels like a real zoom ring.
    this.fov += (getState().demoFov - this.fov) * 0.18
    const aspect = r.width / r.height
    setSubjectSize(this.frames, aspect * 0.86, 1)
    const z = dollyDistance(this.fov, K)
    this.camera.fov = this.fov
    this.camera.aspect = aspect
    this.camera.position.set(0, 0, z)
    this.camera.updateProjectionMatrix()

    const u = this.uniforms
    u.uTime.value = time
    u.uWorldPerPixel.value = (2 * Math.tan(THREE.MathUtils.degToRad(this.fov) / 2)) / r.height
    u.uFocusDist.value = z

    // The DOM tile is transparent while WebGL is live, so paint its ground here.
    gl.setScissorTest(true)
    gl.setScissor(tile.left, size.height - tile.bottom, tile.width, tile.height)
    gl.setClearColor(INK_2, 1)
    gl.clear(true, false, false)

    const y = size.height - r.bottom
    gl.setScissor(r.left, y, r.width, r.height)
    gl.setViewport(r.left, y, r.width, r.height)
    gl.setClearColor(INK, 1)
    gl.clear(true, true, false)
    gl.render(this.scene, this.camera)
    gl.setScissorTest(false)
    gl.setViewport(0, 0, size.width, size.height)
  }

  dispose() {
    this.frames.geometry.dispose()
    this.frames.material.dispose()
    this.window.geometry.dispose()
    this.window.material.dispose()
    delete document.documentElement.dataset.webglDemo
  }
}
