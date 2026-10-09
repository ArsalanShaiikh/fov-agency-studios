import { useCallback } from 'react'
import { gsap } from './gsap'

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** The element a project overlay expands from (set by the Work section). */
export const overlaySource = { el: null }

const insetFrom = (rect) => {
  const w = window.innerWidth
  const h = window.innerHeight
  return `inset(${Math.max(0, rect.top)}px ${Math.max(0, w - rect.right)}px ${Math.max(0, h - rect.bottom)}px ${Math.max(0, rect.left)}px)`
}

/**
 * Menu: a focal-plane shutter. The first curtain travels down to open; the
 * second curtain travels down to close. Reduced motion: opacity only.
 */
export function useShutter(ref) {
  const shutterOpen = useCallback(() => {
    const d = ref.current
    if (!d) return
    const items = d.querySelectorAll('[data-menu-item] > a')
    if (reduced()) {
      gsap.fromTo(d, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'none' })
      return
    }
    gsap.fromTo(d, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'shutter' })
    gsap.fromTo(items, { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'lens', stagger: 0.06, delay: 0.35 })
  }, [ref])

  const shutterClose = useCallback(
    (done) => {
      const d = ref.current
      if (!d) return done()
      if (reduced()) {
        gsap.to(d, { opacity: 0, duration: 0.25, ease: 'none', onComplete: () => (gsap.set(d, { clearProps: 'opacity' }), done()) })
        return
      }
      gsap.to(d, {
        clipPath: 'inset(100% 0% 0% 0%)',
        duration: 0.8,
        ease: 'shutter',
        onComplete: () => {
          gsap.set(d, { clearProps: 'clipPath' })
          done()
        },
      })
    },
    [ref],
  )

  return { shutterOpen, shutterClose }
}

/**
 * Project overlay: the clicked frame expands to full screen (a "frame-expand
 * cut"), then the copy rises. Closing contracts back into the source frame.
 */
export function useProjectOverlayMotion(ref) {
  const animateOpen = useCallback(() => {
    const d = ref.current
    if (!d) return
    const reveal = d.querySelectorAll('[data-overlay-reveal]')
    const source = overlaySource.el?.getBoundingClientRect()
    gsap.killTweensOf(d)

    if (reduced() || !source) {
      gsap.fromTo(d, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'none' })
      gsap.fromTo(reveal, { opacity: 0 }, { opacity: 1, duration: 0.4, delay: 0.1, ease: 'none' })
      return
    }

    d.scrollTop = 0
    const tl = gsap.timeline()
    tl.fromTo(d, { clipPath: insetFrom(source) }, { clipPath: 'inset(0px 0px 0px 0px)', duration: 1.1, ease: 'shutter' })
    tl.fromTo(
      reveal,
      { yPercent: 30, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.9, ease: 'lens', stagger: 0.08 },
      0.65,
    )
  }, [ref])

  const animateClose = useCallback(
    (done) => {
      const d = ref.current
      if (!d) return done()
      const source = overlaySource.el?.getBoundingClientRect()
      const finish = () => {
        gsap.set(d, { clearProps: 'clipPath,opacity' })
        done()
      }
      if (reduced() || !source || source.bottom < 0 || source.top > window.innerHeight) {
        gsap.to(d, { opacity: 0, duration: 0.3, ease: 'none', onComplete: finish })
        return
      }
      gsap.to(d, { clipPath: insetFrom(source), duration: 0.9, ease: 'shutter', onComplete: finish })
    },
    [ref],
  )

  return { animateOpen, animateClose }
}
