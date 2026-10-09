import { useGSAP, gsap, MQ, ScrollTrigger } from '../gsap'
import { rig } from '../../lib/rig'
import { revealLines, fadeIn } from '../reveal'

/**
 * Services: each service is a lens (24 / 50 / 85mm). Desktop pins the stage
 * and scrubs rig.lens with holds between changes; smaller screens switch lens
 * as each block crosses the middle of the viewport.
 */
export function useServicesMotion(root) {
  useGSAP(
    () => {
      const section = root.current
      const stage = section.querySelector('[data-services-stage]')
      const items = [...section.querySelectorAll('[data-service]')]

      const mm = gsap.matchMedia()
      mm.add({ motion: MQ.motion, desktop: MQ.desktop }, (ctx) => {
        const { motion, desktop } = ctx.conditions

        if (!motion) {
          items.forEach((item, i) =>
            ScrollTrigger.create({
              trigger: item,
              start: 'top 60%',
              end: 'bottom 40%',
              onToggle: (self) => self.isActive && (rig.lens = i),
            }),
          )
          fadeIn(items, { trigger: section })
          return
        }

        if (desktop) {
          const setActive = (i) => {
            if (stage.dataset.active !== String(i)) stage.dataset.active = String(i)
          }
          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: stage,
              start: 'top top',
              end: '+=220%',
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
              onUpdate: (self) => setActive(self.progress < 0.3 ? 0 : self.progress < 0.67 ? 1 : 2),
            },
          })
          // Lens: hold 24mm, rack to 50mm, hold, rack to 85mm, hold.
          tl.fromTo(rig, { lens: 0 }, { lens: 0, duration: 0.18 }, 0)
            .to(rig, { lens: 1, duration: 0.2, ease: 'focus' }, 0.18)
            .to(rig, { lens: 2, duration: 0.2, ease: 'focus' }, 0.56)
            .to(rig, { lens: 2, duration: 0.24 }, 0.76)
          tl.fromTo(rig, { travelB: 0 }, { travelB: 1, duration: 1 }, 0)
          revealLines(section.querySelector('h2'), { trigger: stage, start: 'top 70%' })
          return
        }

        // Tablet / phone: lens follows the block in the middle of the screen.
        items.forEach((item, i) => {
          ScrollTrigger.create({
            trigger: item,
            start: 'top 60%',
            end: 'bottom 40%',
            onToggle: (self) =>
              self.isActive && gsap.to(rig, { lens: i, duration: 1.2, ease: 'focus', overwrite: 'auto' }),
          })
          revealLines(item.querySelector('h3'), { trigger: item, start: 'top 85%' })
        })
        gsap.fromTo(
          rig,
          { travelB: 0 },
          { travelB: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true } },
        )
      })

      // Created after the pin above so their positions include its spacer.
      // The lens takes over from the dolly as Services arrives, and lets go before Work.
      gsap.fromTo(
        rig,
        { lensMix: 0 },
        { lensMix: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top 75%', end: 'top top', scrub: true } },
      )
      gsap.fromTo(
        rig,
        { lensMix: 1 },
        {
          lensMix: 0,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: { trigger: section, start: 'bottom 70%', end: 'bottom top', scrub: true },
        },
      )

      return () => mm.revert()
    },
    { scope: root },
  )
}
