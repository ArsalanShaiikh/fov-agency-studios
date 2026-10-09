import { useRef, useState } from 'react'
import { useGSAP, gsap } from '../animations/gsap'
import { startScroll, stopScroll } from '../animations/smoothScroll'
import { getState, setState, subscribe } from '../lib/store'
import { rig } from '../lib/rig'

const MIN_MS = 1400
const MAX_MS = 3200
const SIZE = 26 // bracket arm length

/**
 * Preloader: "Focusing". The hero wordmark is painted from the first frame
 * (it is the LCP element) but blurred; real load progress pulls it into
 * focus. At 100% the autofocus brackets lock onto it, flash signal yellow,
 * then open back out to the edges as the 3D world fades up.
 */
export default function Preloader() {
  const root = useRef(null)
  const [done, setDone] = useState(false)

  useGSAP(
    () => {
      const el = root.current
      const brackets = [...el.querySelectorAll('[data-bracket]')]
      const label = el.querySelector('[data-pct]')
      const wordmark = document.querySelector('[data-wordmark]')
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const startedAt = performance.now()
      const progress = { shown: 0, target: 0.08 }
      let finished = false

      stopScroll()
      document.documentElement.style.overflow = 'hidden'

      const place = (rect, animate, opts = {}) => {
        const s = SIZE
        const pts = [
          [rect.left, rect.top],
          [rect.right - s, rect.top],
          [rect.left, rect.bottom - s],
          [rect.right - s, rect.bottom - s],
        ]
        brackets.forEach((b, i) =>
          animate ? gsap.to(b, { x: pts[i][0], y: pts[i][1], ...opts }) : gsap.set(b, { x: pts[i][0], y: pts[i][1] }),
        )
      }
      const edges = (pad) => ({ left: pad, top: pad, right: window.innerWidth - pad, bottom: window.innerHeight - pad })
      place(edges(window.innerWidth < 768 ? 16 : 28), false)

      // Progress sources: fonts, then the 3D scene (when it is being loaded).
      document.fonts.ready.then(() => (progress.target = Math.max(progress.target, 0.45)))
      const needsScene = () => {
        const { webgl, tier } = getState()
        return webgl === true && tier !== 'low'
      }
      const checkScene = () => {
        const { webgl, sceneReady } = getState()
        if (webgl === false || sceneReady || (webgl !== null && !needsScene())) progress.target = 1
      }
      const unsubscribe = subscribe(checkScene)
      checkScene()
      const timeout = window.setTimeout(() => (progress.target = 1), MAX_MS)

      const finish = () => {
        finished = true
        gsap.ticker.remove(tick)
        const release = () => {
          document.documentElement.style.overflow = ''
          startScroll()
          setState({ loaded: true })
          setDone(true)
        }
        if (reduce) {
          gsap.set(wordmark, { filter: 'none' })
          gsap.to(el, { opacity: 0, duration: 0.4, ease: 'none', onComplete: release })
          rig.intro = 1
          return
        }
        const r = wordmark.getBoundingClientRect()
        const pad = Math.max(14, r.height * 0.18)
        const target = { left: r.left - pad, top: r.top - pad, right: r.right + pad, bottom: r.bottom + pad }
        const tl = gsap.timeline({ onComplete: release })
        tl.to(label, { opacity: 0, duration: 0.3, ease: 'none' }, 0)
        tl.add(() => place(target, true, { duration: 0.7, ease: 'lock' }), 0)
        // Focus confirmed: a brief signal flash on the brackets and the 3D subject frame.
        tl.to(brackets, { borderColor: '#e9c440', duration: 0.08, ease: 'none' }, 0.62)
        tl.fromTo(rig, { lock: 0 }, { lock: 1, duration: 0.12, ease: 'none' }, 0.62)
        tl.to(brackets, { borderColor: '#e9e8e4', duration: 0.3, ease: 'none' }, 0.86)
        tl.to(rig, { lock: 0, duration: 0.5, ease: 'focus' }, 0.9)
        // Brackets open out to the edges and dissolve; the world fades up.
        tl.add(() => place(edges(-SIZE * 2), true, { duration: 1.1, ease: 'shutter' }), 1.0)
        tl.to(brackets, { opacity: 0, duration: 0.6, ease: 'none' }, 1.35)
        tl.fromTo(rig, { intro: 0 }, { intro: 1, duration: 1.6, ease: 'lens' }, 0.95)
      }

      const tick = () => {
        progress.shown += (progress.target - progress.shown) * 0.06
        if (progress.target - progress.shown < 0.002) progress.shown = progress.target
        const p = progress.shown
        label.textContent = `${Math.round(p * 100)}%`
        if (wordmark) wordmark.style.filter = p >= 1 ? 'none' : `blur(${((1 - p) * 16).toFixed(2)}px)`
        if (!finished && p >= 1 && performance.now() - startedAt > MIN_MS) finish()
      }
      gsap.ticker.add(tick)

      return () => {
        gsap.ticker.remove(tick)
        unsubscribe()
        window.clearTimeout(timeout)
        document.documentElement.style.overflow = ''
      }
    },
    { scope: root },
  )

  if (done) return null

  return (
    <div ref={root} className="pointer-events-none fixed inset-0 z-(--z-preloader)">
      <p className="sr-only" role="status">
        Loading FOV
      </p>
      {['border-t border-l', 'border-t border-r', 'border-b border-l', 'border-b border-r'].map((sides) => (
        <span
          key={sides}
          data-bracket
          aria-hidden="true"
          className={`absolute top-0 left-0 ${sides} border-paper`}
          style={{ width: SIZE, height: SIZE, borderWidth: undefined }}
        />
      ))}
      <p
        aria-hidden="true"
        className="mono-label absolute bottom-[clamp(18px,3.6svh,44px)] left-(--margin) text-paper"
      >
        Focusing <span data-pct className="text-signal">0%</span>
      </p>
    </div>
  )
}
