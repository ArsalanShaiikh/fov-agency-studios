import { useGSAP, gsap, MQ, ScrollTrigger, SplitText } from '../gsap'
import { rig, applyStillRig } from '../../lib/rig'
import { getState, setState, subscribe } from '../../lib/store'

/** Run `fn` once the preloader has finished (immediately if it already has). */
function onLoaded(fn) {
  if (getState().loaded) {
    fn()
    return () => {}
  }
  const unsubscribe = subscribe(() => {
    if (getState().loaded) {
      unsubscribe()
      fn()
    }
  })
  return unsubscribe
}

/**
 * Hero: the dolly zoom. The stage pins while scroll drives rig.dolly
 * (8° -> 78°, camera distance compensating), then the camera passes through
 * the subject frame and the wordmark's letters rush past the lens.
 */
export function useHeroMotion(root) {
  useGSAP(
    () => {
      const stage = root.current.querySelector('[data-hero-stage]')
      const chars = root.current.querySelectorAll('[data-char]')
      const vision = root.current.querySelector('[data-vision]')

      const mm = gsap.matchMedia()
      mm.add({ motion: MQ.motion, desktop: MQ.desktop, portrait: MQ.portrait }, (ctx) => {
        const { motion, desktop, portrait } = ctx.conditions

        if (!motion) {
          applyStillRig()
          gsap.set(vision, { opacity: 0 })
          return onLoaded(() => gsap.to(vision, { opacity: 1, duration: 0.4, ease: 'none' }))
        }

        // Intro: the vision rises line by line once the preloader confirms focus.
        const split = SplitText.create(vision, { type: 'lines', mask: 'lines', linesClass: 'split-line', aria: 'none' })
        gsap.set(split.lines, { yPercent: 105 })
        gsap.set(vision, { opacity: 1 })
        const stopIntro = onLoaded(() =>
          gsap.to(split.lines, {
            yPercent: 0,
            duration: 1,
            ease: 'lens',
            stagger: 0.09,
            delay: 0.35,
            onComplete: () => split.revert(),
          }),
        )

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: desktop ? '+=160%' : '+=110%',
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
          },
        })

        // 1. The dolly zoom: the world stretches, the subject holds still.
        tl.fromTo(rig, { dolly: 0 }, { dolly: 1, duration: 0.7 }, 0)
        tl.to(vision, { opacity: 0, yPercent: -30, duration: 0.16, ease: 'focus' }, 0.52)

        // 2. Through the frame: F and V part, the O opens over the lens.
        tl.fromTo(rig, { through: 0 }, { through: 1, duration: 0.3 }, 0.7)
        const part = portrait ? 'yPercent' : 'xPercent'
        tl.to(chars[0], { [part]: -170, scale: 3.2, opacity: 0, duration: 0.24, ease: 'approach' }, 0.72)
        tl.to(chars[2], { [part]: 170, scale: 3.2, opacity: 0, duration: 0.24, ease: 'approach' }, 0.72)
        tl.to(chars[1], { scale: 11, opacity: 0, duration: 0.28, ease: 'approach' }, 0.72)

        return () => {
          stopIntro()
          split.revert()
        }
      })

      // After the pin, so the end accounts for its spacer. Readout visibility
      // on small screens: only while the hero is on screen.
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom top',
        onToggle: (self) => setState({ inHero: self.isActive }),
      })

      return () => mm.revert()
    },
    { scope: root },
  )
}
