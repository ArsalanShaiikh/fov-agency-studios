import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'
import { shutterFn } from './eases'
import { rig } from '../lib/rig'

let lenis = null

/**
 * Lenis drives wheel smoothing; ScrollTrigger reads the same native scroll
 * position, and both run off gsap.ticker so there is one clock.
 * Touch keeps native momentum (syncTouch: false). Reduced motion: no Lenis.
 */
export function initSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}

  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false, autoRaf: false })
  lenis.on('scroll', (l) => {
    rig.velocity = l.velocity
    ScrollTrigger.update()
  })

  const tick = (time) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = null
  }
}

export const getLenis = () => lenis

export function stopScroll() {
  lenis?.stop()
}

export function startScroll() {
  lenis?.start()
}

/** Scroll to an element or selector with the shutter ease (native fallback). */
export function scrollToTarget(target, { offset = 0, immediate = false } = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el && typeof target !== 'number') return
  if (lenis) {
    lenis.scrollTo(el ?? target, { offset, duration: immediate ? 0 : 1.6, easing: shutterFn, immediate })
    return
  }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const top = typeof target === 'number' ? target : el.getBoundingClientRect().top + window.scrollY + offset
  window.scrollTo({ top, behavior: reduce || immediate ? 'auto' : 'smooth' })
}
