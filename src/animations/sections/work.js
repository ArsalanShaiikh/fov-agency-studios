import { useGSAP, gsap, MQ, ScrollTrigger } from '../gsap'
import { rig } from '../../lib/rig'
import { setState } from '../../lib/store'
import { revealLines, fadeIn, insetTween } from '../reveal'
import { media } from '../../lib/mediaState'

/**
 * Work: the world dims so the pieces take the frame. Each piece is revealed
 * by a frame opening (clip-path) with a slow lens settle. On desktop the
 * media are also drawn as WebGL planes (three/WorkPlanes) that bend with
 * scroll velocity; this file owns the DOM side.
 */
export function useWorkMotion(root) {
  useGSAP(
    () => {
      const section = root.current
      const items = [...section.querySelectorAll('[data-project]')]

      gsap.fromTo(
        rig,
        { dim: 0 },
        { dim: 0.8, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'top 35%', scrub: true } },
      )
      gsap.fromTo(
        rig,
        { dim: 0.8 },
        {
          dim: 0.1,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: { trigger: section, start: 'bottom 75%', end: 'bottom top', scrub: true },
        },
      )
      ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        end: 'bottom 40%',
        onToggle: (self) => setState({ inWork: self.isActive }),
      })

      const mm = gsap.matchMedia()
      mm.add({ motion: MQ.motion }, (ctx) => {
        if (!ctx.conditions.motion) {
          Object.values(media).forEach((m) => (m.reveal = 1))
          fadeIn(section.querySelector('h2'), { trigger: section })
          items.forEach((item) => fadeIn(item, { trigger: item }))
          return
        }

        revealLines(section.querySelector('h2'), { trigger: section, start: 'top 75%' })

        items.forEach((item) => {
          const box = item.querySelector('[data-media]')
          const inner = box.firstElementChild
          const caption = item.querySelectorAll('h3, p')
          const state = media[item.dataset.project]
          gsap
            .timeline({ scrollTrigger: { trigger: item, start: 'top 88%', once: true } })
            .fromTo(state ?? {}, { reveal: 0 }, { reveal: 1, duration: 1.4, ease: 'lens' }, 0)
            .add(insetTween(box, [16, 12, 16, 12], [0, 0, 0, 0], { duration: 1.4, ease: 'lens', clear: true }), 0)
            .fromTo(inner, { scale: 1.2 }, { scale: 1, duration: 1.6, ease: 'lens', clearProps: 'transform' }, 0)
            .from(caption, { yPercent: 60, opacity: 0, duration: 0.9, ease: 'lens', stagger: 0.07 }, 0.3)
        })
      })

      return () => mm.revert()
    },
    { scope: root },
  )
}
