import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils } from 'three'
import { rig, pointer, cameraOut, lensWeights } from '../lib/rig'
import { computeCamera, subjectFrame } from '../lib/cameraMath'
import {
  buildFrameData,
  frameUniforms,
  createFrameMesh,
  setSubjectSize,
  dustUniforms,
  createDust,
  createWindow,
} from './frames'

const DUST = { high: 4500, mid: 3000, low: 1400 }

/**
 * The world behind the page: the frame tunnel, projector dust and the window
 * at the end. Every frame it resolves the camera rig (dolly zoom, travel,
 * lens, truck, bookend) and feeds the shaders.
 */
export default function World({ tier = 'high', reduce = false }) {
  const { camera, size, gl } = useThree()
  const uniforms = useMemo(() => frameUniforms(), [])
  const frames = useMemo(() => createFrameMesh(buildFrameData(), uniforms), [uniforms])
  const dustU = useMemo(() => dustUniforms(uniforms), [uniforms])
  const dust = useMemo(() => createDust(DUST[tier] ?? DUST.mid, dustU), [tier, dustU])
  const win = useMemo(() => createWindow(), [])
  const smooth = useRef({ x: 0, y: 0, active: 0 })

  // Subject frame follows the viewport ratio (portrait: a vertical frame).
  useEffect(() => {
    const { w } = subjectFrame(size.width / size.height)
    setSubjectSize(frames, w, 1)
  }, [frames, size])

  useEffect(
    () => () => {
      frames.geometry.dispose()
      frames.material.dispose()
      dust.geometry.dispose()
      dust.material.dispose()
      win.geometry.dispose()
      win.material.dispose()
    },
    [frames, dust, win],
  )

  useFrame((_, delta) => {
    const aspect = size.width / size.height
    computeCamera(rig, aspect, cameraOut)

    // Pointer: damped parallax (off for reduced motion and touch).
    const p = smooth.current
    const k = 1 - Math.exp(-delta * 3)
    p.x += ((reduce ? 0 : pointer.x) - p.x) * k
    p.y += ((reduce ? 0 : pointer.y) - p.y) * k
    p.active += (pointer.active - p.active) * k

    camera.fov = cameraOut.fov
    camera.aspect = aspect
    camera.position.set(cameraOut.x + p.x * 0.05, p.y * 0.035, cameraOut.z)
    camera.rotation.set(p.y * 0.014, -p.x * 0.022, 0)
    camera.updateProjectionMatrix()

    // Lens states for the services section.
    const mix = rig.lensMix
    lensWeights.spread = mix * Math.max(0, 1 - Math.abs(rig.lens - 0))
    lensWeights.wave = mix * Math.max(0, 1 - Math.abs(rig.lens - 1))
    lensWeights.align = mix * Math.max(0, 1 - Math.abs(rig.lens - 2))

    const tanHalf = Math.tan(MathUtils.degToRad(cameraOut.fov) / 2)
    const u = uniforms
    if (!reduce) u.uTime.value += Math.min(delta, 0.05)
    u.uIntro.value = rig.intro
    u.uSpread.value = lensWeights.spread
    u.uWave.value = lensWeights.wave
    u.uAlign.value = lensWeights.align
    u.uLock.value = rig.lock
    u.uDim.value = rig.dim
    u.uWorldPerPixel.value = (2 * tanHalf) / size.height
    u.uPointer.value.set(p.x, p.y)
    // Focus: on the subject plane by default; racks to infinity in the manifesto.
    const subjectDistance = MathUtils.clamp(cameraOut.z, 2.5, 20)
    u.uFocusDist.value = MathUtils.lerp(subjectDistance, 95, rig.focus)
    // Deep focus at telephoto (a clean graphic), shallower as the lens widens.
    u.uAperture.value = 0.008 + 0.022 * rig.dolly + rig.focus * 0.11

    dustU.uIntro.value = rig.intro
    dustU.uPixelRatio.value = gl.getPixelRatio()
    dustU.uTanHalf.value = tanHalf
    dustU.uAspect.value = aspect
    dustU.uPointerActive.value = p.active

    win.material.uniforms.uIntro.value = rig.intro
    win.material.uniforms.uDim.value = rig.dim
  })

  return (
    <>
      <primitive object={win} />
      <primitive object={frames} />
      <primitive object={dust} />
    </>
  )
}
