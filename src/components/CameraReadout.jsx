// Live camera readout: the camera's real vertical angle and its full-frame
// equivalent focal length, computed from the rig every tick (no React render).
import { useRef } from 'react'
import { useGSAP, gsap } from '../animations/gsap'
import { computeCamera } from '../lib/cameraMath'
import { cameraOut, rig } from '../lib/rig'
import { useStore } from '../lib/store'
import { useDesktop } from '../hooks/useMediaQuery'

export default function CameraReadout() {
  const root = useRef(null)
  const desktop = useDesktop()
  const visible = useStore((s) => s.loaded && !s.endcard && !s.inWork && (desktop || s.inHero))

  useGSAP(
    () => {
      const fovEl = root.current.querySelector('[data-readout-fov]')
      const mmEl = root.current.querySelector('[data-readout-mm]')
      let lastFov = ''
      let lastMm = ''
      const tick = () => {
        computeCamera(rig, window.innerWidth / window.innerHeight, cameraOut)
        const fov = `${cameraOut.fov.toFixed(1)}°`
        const mm = `${Math.round(cameraOut.focal)}MM`
        if (fov !== lastFov) fovEl.textContent = lastFov = fov
        if (mm !== lastMm) mmEl.textContent = lastMm = mm
      }
      gsap.ticker.add(tick)
      return () => gsap.ticker.remove(tick)
    },
    { scope: root },
  )

  return (
    <div
      ref={root}
      aria-hidden="true"
      data-readout
      className="mono-label pointer-events-none fixed right-(--margin) bottom-[clamp(18px,3.6svh,44px)] z-(--z-hud) flex gap-4 text-paper transition-opacity duration-500"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <span>
        FOV <span data-readout-fov className="text-signal">8.0°</span>
      </span>
      <span data-readout-mm>171MM</span>
    </div>
  )
}
