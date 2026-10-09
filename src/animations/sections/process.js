import { useGSAP, gsap, MQ, ScrollTrigger } from '../gsap'
import { rig } from '../../lib/rig'
import { revealLines, fadeIn } from '../reveal'

/**
 * Process: a camera pan. Desktop pins the stage and pans the track sideways;
 * the panel crossing the centre racks into focus, the others sit soft. The 3D
 * camera trucks at a matched rate so world and type move as one shot.
 */
export function useProcessMotion(root) {
  useGSAP(
    () => {
      const section = root.current
      const stage = section.querySelector('[data-process-stage]')
      const track = section.querySelector('[data-process-track]')
      const steps = [...section.querySelectorAll('[data-step]')]

      const mm = gsap.matchMedia()
      mm.add({ motion: MQ.motion, desktop: MQ.desktop }, (ctx) => {
        const { motion, desktop } = ctx.conditions

        if (!motion) {
          fadeIn(section.querySelector('h2'), { trigger: section })
          steps.forEach((s) => fadeIn(s, { trigger: s }))
          return
        }

        revealLines(section.querySelector('h2'), { trigger: section, start: 'top 75%' })

        if (desktop) {
          const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)
          let active = false
          const clear = () => steps.forEach((s) => (s.style.filter = s.style.opacity = ''))
          const focus = () => {
            if (!active) return
            const cx = window.innerWidth / 2
            for (const s of steps) {
              const r = s.getBoundingClientRect()
              const d = Math.abs(r.left + r.width / 2 - cx) / window.innerWidth
              s.style.filter = `blur(${Math.min(9, d * 20).toFixed(2)}px)`
              s.style.opacity = (1 - Math.min(0.78, d * 1.7)).toFixed(3)
            }
          }

          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            onUpdate: focus,
            scrollTrigger: {
              trigger: stage,
              start: 'top top',
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onRefresh: focus,
            },
          })
          tl.fromTo(track, { x: 0 }, { x: () => -distance() }, 0)
          tl.fromTo(rig, { truck: 0 }, { truck: 1 }, 0)
          // Panels are only softened while the section is on screen.
          ScrollTrigger.create({
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            onToggle: (self) => {
              active = self.isActive
              if (active) focus()
              else clear()
            },
          })
          return clear
        }

        // Phones / tablets: each panel brightens as it reaches the middle.
        steps.forEach((s) =>
          gsap.fromTo(
            s,
            { opacity: 0.25 },
            {
              opacity: 1,
              ease: 'none',
              immediateRender: false,
              scrollTrigger: {
                trigger: s,
                start: 'top bottom',
                end: 'top 50%',
                scrub: true,
                onLeaveBack: () => gsap.set(s, { clearProps: 'opacity' }),
              },
            },
          ),
        )
        gsap.fromTo(
          rig,
          { truck: 0 },
          { truck: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true } },
        )
      })

      return () => mm.revert()
    },
    { scope: root },
  )
}
