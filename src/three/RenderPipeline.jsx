import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { HalfFloatType, Vector2 } from 'three'
import {
  BlendFunction,
  BloomEffect,
  ChromaticAberrationEffect,
  EffectComposer,
  EffectPass,
  NoiseEffect,
  RenderPass,
  VignetteEffect,
} from 'postprocessing'
import { rig } from '../lib/rig'
import { WorkPlanes } from './WorkPlanes'
import { DollyDemo } from './DollyDemo'

function createPost(gl, scene, camera) {
  const composer = new EffectComposer(gl, {
    frameBufferType: HalfFloatType,
    multisampling: Math.min(2, gl.capabilities.maxSamples),
  })
  composer.addPass(new RenderPass(scene, camera))
  const bloom = new BloomEffect({ mipmapBlur: true, luminanceThreshold: 0.78, luminanceSmoothing: 0.2, intensity: 0.7, radius: 0.65 })
  const ca = new ChromaticAberrationEffect({ offset: new Vector2(), radialModulation: true, modulationOffset: 0.3 })
  const noise = new NoiseEffect({ premultiply: true, blendFunction: BlendFunction.SCREEN })
  noise.blendMode.opacity.value = 0.09
  const vignette = new VignetteEffect({ offset: 0.32, darkness: 0.6 })
  composer.addPass(new EffectPass(camera, bloom, ca, noise, vignette))
  return { composer, ca }
}

/**
 * Takes over rendering (priority 1): the world (through post-processing on
 * capable desktops), then the Work planes and the Open demo drawn into their
 * DOM rectangles of the same canvas. One WebGL context for the whole site.
 */
export default function RenderPipeline({ effects = false, workPlanes = false, demo = true }) {
  const { gl, scene, camera, size } = useThree()
  const post = useRef(null)
  const planes = useRef(null)
  const dolly = useRef(null)

  useEffect(() => {
    if (!effects) return
    const p = createPost(gl, scene, camera)
    post.current = p
    return () => {
      p.composer.dispose()
      post.current = null
    }
  }, [effects, gl, scene, camera])

  useEffect(() => {
    post.current?.composer.setSize(size.width, size.height)
  }, [size, effects])

  useEffect(() => {
    if (!workPlanes) return
    const p = new WorkPlanes()
    planes.current = p
    return () => {
      p.dispose()
      planes.current = null
    }
  }, [workPlanes])

  useEffect(() => {
    if (!demo) return
    const d = new DollyDemo()
    dolly.current = d
    return () => {
      d.dispose()
      dolly.current = null
    }
  }, [demo])

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime
    const p = post.current
    if (p) {
      const v = Math.min(1, Math.abs(rig.velocity) / 60)
      p.ca.offset.set(0.0003 + v * 0.003, 0.00015 + v * 0.0012)
      p.composer.render(delta)
    } else {
      gl.autoClear = true
      gl.render(scene, camera)
    }
    gl.autoClear = false
    planes.current?.render(gl, size, time)
    dolly.current?.render(gl, size, time)
    gl.autoClear = true
  }, 1)

  return null
}
