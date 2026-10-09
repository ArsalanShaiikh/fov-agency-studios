import { useGSAP, gsap, MQ, ScrollTrigger } from '../gsap'
import { rig } from '../../lib/rig'
import { getState, setState } from '../../lib/store'
import { revealLines, fadeIn } from '../reveal'

/** The subject frame's inset on screen, in px (mirrors subjectFrame()). */
function subjectInset() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const portrait = vh > vw
  const h = portrait ? 0.62 * vh : 0.55 * vh
  const w = portrait ? Math.min(0.84 * vw, 0.496 * vh) : Math.min(0.55 * vw, 1.31 * vh)
  return { y: (vh - h) / 2, x: (vw - w) / 2 }
}

/** The nav, readout and cursor read this flag to switch to ink-on-signal. */
function setSignal(on) {
  if (getState().endcard !== on) setState({ endcard: on })
}

/**
 * End card, "lights on". Over the bookend spacer the camera pulls back to the
 * opening 8° frame (bookending the hero), the innermost frame floods signal
 * yellow, then opens to full bleed. The real end card slides in underneath in
 * the same colour, so the hand-off is invisible.
 */
export function useEndCardMotion(root) {
  useGSAP(
    () => {
      const wrap = root.current
      const bookend = wrap.querySelector('[data-bookend]')
      const flood = wrap.querySelector('[data-flood]')
      const card = wrap.querySelector('[data-endcard]')
      const reveals = [...wrap.querySelectorAll('[data-endcard-reveal]')]

      // Pause the 3D while the card fully covers it.
      ScrollTrigger.create({
        trigger: card,
        start: 'top top',
        end: 'bottom top',
        onToggle: (self) => setState({ scenePaused: self.isActive }),
      })

      const mm = gsap.matchMedia()
      mm.add({ motion: MQ.motion }, (ctx) => {
        if (!ctx.conditions.motion) {
          ScrollTrigger.create({
            trigger: card,
            start: 'top top+=64',
            end: 'bottom top',
            onToggle: (self) => setSignal(self.isActive),
          })
          fadeIn(reveals, { trigger: card })
          return
        }

        // Flood clip as an explicit 4-value box (see insetTween for why).
        const box = { open: 0 }
        const applyClip = () => {
          const { x, y } = subjectInset()
          const k = 1 - box.open
          flood.style.clipPath = `inset(${y * k}px ${x * k}px ${y * k}px ${x * k}px)`
        }
        applyClip()

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: bookend,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => setSignal(self.progress > 0.94),
            onLeave: () => setSignal(true),
          },
        })

        // 1. Pull back to the opening frame; brighten the world again.
        tl.fromTo(rig, { end: 0 }, { end: 1, duration: 0.62, ease: 'focus' }, 0)
        tl.fromTo(rig, { dim: 0.6 }, { dim: 0, duration: 0.4 }, 0)
        // 2. The innermost frame floods signal yellow...
        tl.fromTo(flood, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.14 }, 0.56)
        // 3. ...and opens to full bleed: the lights come on.
        tl.fromTo(box, { open: 0 }, { open: 1, duration: 0.3, ease: 'shutter', onUpdate: applyClip }, 0.7)
        const onResize = () => applyClip()
        window.addEventListener('resize', onResize)

        const [headline, ...rest] = reveals
        revealLines(headline, { trigger: card, start: 'top 65%' })
        gsap.from(rest, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'lens',
          stagger: 0.1,
          scrollTrigger: { trigger: card, start: 'top 55%', once: true },
        })

        return () => {
          window.removeEventListener('resize', onResize)
          setSignal(false)
        }
      })

      return () => mm.revert()
    },
    { scope: root },
  )
}
