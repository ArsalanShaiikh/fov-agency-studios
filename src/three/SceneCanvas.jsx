import { Suspense, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, PerformanceMonitor } from '@react-three/drei'
import World from './World'
import VintageCamera from './VintageCamera'
import RenderPipeline from './RenderPipeline'
import { getState, setState, useStore } from '../lib/store'
import { pointer } from '../lib/rig'
import { maxDpr } from '../lib/device'
import { useReducedMotion } from '../hooks/useMediaQuery'

function Ready() {
  useFrame(() => {
    if (!getState().sceneReady) setState({ sceneReady: true })
  })
  return null
}

function Lights({ tier }) {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[2.5, 3, 4]} intensity={2.4} color="#fff4d6" />
      <directionalLight position={[-4, 1.5, -3]} intensity={2.2} color="#e9c440" />
      {tier !== 'low' && (
        <Environment resolution={128} frames={1}>
          <Lightformer form="rect" intensity={2.2} color="#fff4d6" position={[0, 2, 3]} scale={[4, 1.2, 1]} />
          <Lightformer form="rect" intensity={1.4} color="#e9c440" position={[-3, 0, -2]} scale={[1, 4, 1]} />
        </Environment>
      )}
    </>
  )
}

/**
 * The one shared canvas, fixed behind the DOM. Lazy-loaded after first paint
 * (three.js never blocks the wordmark). Quality is tiered and adapts at runtime.
 */
export default function SceneCanvas() {
  const tier = useStore((s) => s.tier)
  const paused = useStore((s) => s.scenePaused || s.project !== null || s.menuOpen)
  const reduce = useReducedMotion()
  const [dpr, setDpr] = useState(() => maxDpr(tier))
  const [effects, setEffects] = useState(tier === 'high')

  useEffect(() => {
    const move = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
      pointer.active = e.pointerType === 'mouse' ? 1 : 0
    }
    const resize = () => setDpr(maxDpr(tier))
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('resize', resize)
    }
  }, [tier])

  return (
    <div aria-hidden="true" data-scene className="pointer-events-none fixed inset-0 z-(--z-canvas)">
      <Canvas
        dpr={dpr}
        frameloop={paused ? 'never' : 'always'}
        gl={{ antialias: tier !== 'low', alpha: false, stencil: false, powerPreference: 'high-performance' }}
        camera={{ fov: 8, near: 0.05, far: 160, position: [0, 0, 13] }}
        resize={{ scroll: false, debounce: 100 }}
        onCreated={({ gl }) => gl.setClearColor('#0b0b0a', 1)}
        style={{ width: '100%', height: '100%' }}
      >
        <PerformanceMonitor
          onDecline={() => {
            if (effects) setEffects(false)
            else setDpr((d) => Math.max(1, Math.round((d - 0.25) * 100) / 100))
          }}
        />
        <Lights tier={tier} />
        <World tier={tier} reduce={reduce} />
        <Suspense fallback={null}>
          <VintageCamera />
        </Suspense>
        <RenderPipeline effects={effects} workPlanes={tier !== 'low'} demo />
        <Ready />
      </Canvas>
    </div>
  )
}
