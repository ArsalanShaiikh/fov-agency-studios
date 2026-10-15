import { useRef } from 'react'
import { gsap, MQ, useGSAP } from '../../animations/gsap'
import { revealLines } from '../../animations/reveal'
import { PROCESS } from '../lib/content'

export default function Process() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        revealLines(root.current.querySelector('h2'))
        gsap.from('[data-line]', {
          scaleX: 0,
          ease: 'none',
          scrollTrigger: { trigger: '[data-steps]', start: 'top 80%', end: 'bottom 60%', scrub: true },
        })
        gsap.from('[data-step]', {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: 'lens',
          stagger: 0.07,
          scrollTrigger: { trigger: '[data-steps]', start: 'top 80%', once: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="process" ref={root} aria-labelledby="process-title" className="pb-(--section-pad)">
      <div className="frame">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-(--gutter)">
          <div className="lg:col-span-7">
            <p className="caption">( How we work )</p>
            <h2 id="process-title" className="display mt-4 text-h2">
              You always know what happens next
            </h2>
          </div>
          <p className="max-w-[40ch] text-dim lg:col-span-4 lg:col-start-9">
            Six clear steps, adapted to the size of the project. Small site or full platform, the route stays the same.
          </p>
        </div>

        <div className="relative mt-12 md:mt-16">
          <div aria-hidden="true" className="absolute top-[22px] right-0 left-0 hidden h-px bg-line lg:block">
            <div data-line className="h-full origin-left bg-maroon" />
          </div>
          <ol data-steps className="grid gap-(--gutter) sm:grid-cols-2 lg:grid-cols-6">
            {PROCESS.map((p, i) => (
              <li key={p.title} data-step>
                <span className="relative grid size-11 place-items-center rounded-full bg-ink text-small text-paper tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="mt-6 h-[calc(100%-4.25rem)] rounded-(--radius) bg-paper-2 p-5 ring-1 ring-line">
                  <h3 className="heading text-[1.25rem]">{p.title}</h3>
                  <p className="mt-2 text-small text-dim">{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
