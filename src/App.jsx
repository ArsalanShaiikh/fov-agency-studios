import { lazy, Suspense, useEffect, useLayoutEffect } from 'react'
import { ScrollTrigger } from './animations/gsap'
import { initSmoothScroll } from './animations/smoothScroll'
import { detectTier, detectWebGL } from './lib/device'
import { getState, setState, useStore } from './lib/store'
import Preloader from './components/Preloader'
import FocusCursor from './components/FocusCursor'
import Nav from './components/Nav'
import FrameFallback from './components/FrameFallback'
import CameraReadout from './components/CameraReadout'
import ProjectOverlay from './components/ProjectOverlay'
import MenuOverlay from './components/MenuOverlay'
import CreditsDialog from './components/CreditsDialog'
import Hero from './sections/Hero'
import Manifesto from './sections/Manifesto'
import Services from './sections/Services'
import Work from './sections/Work'
import Process from './sections/Process'
import Open from './sections/Open'
import EndCard from './sections/EndCard'

// three.js and the scene load in their own chunk, after first paint.
const SceneCanvas = lazy(() => import('./three/SceneCanvas'))

export default function App() {
  const webgl = useStore((s) => s.webgl)
  const sceneRequested = useStore((s) => s.sceneRequested)
  // Hold the CSS frames until the 3D frames start flying in (preloader done).
  const sceneLive = useStore((s) => s.sceneReady && s.loaded)

  useLayoutEffect(() => {
    setState({ webgl: detectWebGL(), tier: detectTier() })
  }, [])

  useEffect(() => initSmoothScroll(), [])

  // 3D loads straight away on capable devices. On the low tier (phones) it
  // waits for the first interaction or an idle moment, so it never competes
  // with the first paint; the hero's 3D is scroll-driven anyway.
  useEffect(() => {
    if (!webgl) return
    if (getState().tier !== 'low') {
      setState({ sceneRequested: true })
      return
    }
    const events = ['pointerdown', 'touchstart', 'wheel', 'keydown', 'scroll']
    const cleanup = () => {
      events.forEach((e) => window.removeEventListener(e, go))
      window.clearTimeout(idle)
    }
    const go = () => {
      cleanup()
      setState({ sceneRequested: true })
    }
    events.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }))
    const idle = window.setTimeout(go, 6000)
    return cleanup
  }, [webgl])

  useEffect(() => {
    document.fonts.ready.then(() => ScrollTrigger.refresh())
  }, [])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-(--z-preloader) focus:bg-signal focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>

      <FrameFallback visible={!sceneLive} />
      {webgl && sceneRequested && (
        <Suspense fallback={null}>
          <SceneCanvas />
        </Suspense>
      )}

      <Nav />

      <main id="main" tabIndex={-1} className="relative z-(--z-content) outline-none">
        <Hero />
        <Manifesto />
        <Services />
        <Work />
        <Process />
        <Open />
      </main>

      <div className="relative z-(--z-content)">
        <EndCard />
      </div>

      <CameraReadout />
      <FocusCursor />
      <Preloader />
      <ProjectOverlay />
      <MenuOverlay />
      <CreditsDialog />
    </>
  )
}
