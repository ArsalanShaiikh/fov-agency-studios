import { useGSAP, gsap, MQ, SplitText } from '../gsap'
import { rig } from '../../lib/rig'

const SIGNAL = '#e9c440'

/**
 * Manifesto: a scroll-scrubbed rack focus. Words come into focus in reading
 * order while the 3D world racks out (rig.focus -> infinity, dust -> bokeh).
 * Mobile uses opacity + rise instead of per-word blur (cheaper on Android).
 */
export function useManifestoMotion(root) {
  useGSAP(
    () => {
      const section = root.current
      const p = section.querySelector('[data-manifesto]')
      const emphasis = section.querySelector('[data-emphasis]')

      // The world: drift forward and rack out of focus as the words rack in.
      gsap.fromTo(
        rig,
        { travelA: 0 },
        { travelA: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true } },
      )
      gsap.fromTo(
        rig,
        { focus: 0 },
        { focus: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'center center', scrub: true } },
      )
      // ...and racks back onto the world as Services arrives.
      gsap.fromTo(
        rig,
        { focus: 1 },
        {
          focus: 0,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: { trigger: section, start: 'bottom 65%', end: 'bottom top', scrub: true },
        },
      )

      const mm = gsap.matchMedia()
      mm.add({ motion: MQ.motion, desktop: MQ.desktop }, (ctx) => {
        const { motion, desktop } = ctx.conditions
        if (!motion) {
          gsap.set(emphasis, { color: SIGNAL })
          return
        }

        const split = SplitText.create(p, { type: 'words', wordsClass: 'manifesto-word', aria: 'none' })
        const words = split.words
        const from = desktop ? { filter: 'blur(8px)', opacity: 0.14 } : { opacity: 0.14, y: 10 }
        const to = desktop ? { filter: 'blur(0px)', opacity: 1 } : { opacity: 1, y: 0 }

        // The soft state is only applied once the paragraph enters the viewport,
        // so the text is never dimmed while it is off-screen.
        const tl = gsap.timeline({
          // Back above the paragraph: drop the soft state entirely (after scrub smoothing).
          onReverseComplete: () => gsap.set(words, { clearProps: 'filter,opacity,transform,color' }),
          scrollTrigger: { trigger: p, start: 'top bottom', end: 'bottom 45%', scrub: 0.6 },
        })
        const each = 0.12
        tl.fromTo(words, from, { ...to, ease: 'none', duration: 0.6, stagger: each, immediateRender: false })

        // "impossible to ignore" locks in signal yellow as it comes into focus.
        const emphasisWords = words.filter((w) => emphasis.contains(w))
        const first = words.indexOf(emphasisWords[0])
        tl.fromTo(
          emphasisWords,
          { color: 'inherit' },
          { color: SIGNAL, duration: 0.3, stagger: each, ease: 'none' },
          first * each + 0.35,
        )

        return () => split.revert()
      })

      return () => mm.revert()
    },
    { scope: root },
  )
}
