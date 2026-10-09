import { useGSAP, gsap, MQ } from '../gsap'
import { rig } from '../../lib/rig'
import { revealLines, fadeIn } from '../reveal'

/** Open: tiles settle in on a short stagger; the world dims behind the bento. */
export function useOpenMotion(root) {
  useGSAP(
    () => {
      const section = root.current
      const tiles = [...section.querySelectorAll('[data-tile]')]
      const reveals = [...section.querySelectorAll('[data-reveal]')]

      gsap.fromTo(
        rig,
        { dim: 0.1 },
        {
          dim: 0.6,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'top 40%', scrub: true },
        },
      )

      const mm = gsap.matchMedia()
      mm.add({ motion: MQ.motion }, (ctx) => {
        if (!ctx.conditions.motion) {
          fadeIn(reveals, { trigger: section })
          fadeIn(tiles, { trigger: tiles[0] })
          return
        }
        reveals.forEach((el, i) => revealLines(el, { trigger: section, start: 'top 75%', delay: i * 0.12 }))
        gsap.from(tiles, {
          y: 70,
          opacity: 0,
          duration: 1.1,
          ease: 'lens',
          stagger: 0.1,
          scrollTrigger: { trigger: tiles[0], start: 'top 88%', once: true },
        })
      })

      return () => mm.revert()
    },
    { scope: root },
  )
}
