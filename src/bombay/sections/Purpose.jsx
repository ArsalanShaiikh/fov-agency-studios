import { useRef } from 'react'
import { gsap, MQ, useGSAP } from '../../animations/gsap'
import { revealLines } from '../../animations/reveal'
import { IMPACT, VALUES } from '../lib/content'

export default function Purpose() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        root.current.querySelectorAll('h2').forEach((h) => revealLines(h))
        gsap.from('[data-value]', {
          y: 24,
          opacity: 0,
          duration: 0.9,
          ease: 'lens',
          stagger: 0.06,
          scrollTrigger: { trigger: '[data-values]', start: 'top 85%', once: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="values" ref={root} aria-labelledby="values-title" className="px-1.5 pb-(--section-pad) md:px-2">
      <div className="rounded-[clamp(1rem,0.8rem+1vw,1.75rem)] bg-maroon text-cream section-pad">
        <div className="frame">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-(--gutter)">
            <div className="lg:col-span-7">
              <p className="caption text-cream/75!">( What we value )</p>
              <h2 id="values-title" className="display mt-4 text-h2">
                Build useful things. Craft them with care.
              </h2>
            </div>
            <p className="max-w-[40ch] text-cream/85 lg:col-span-4 lg:col-start-9">
              The standards we hold ourselves to with clients, with each other and with the communities around us.
            </p>
          </div>

          <ul data-values className="mt-12 grid border-t border-cream/20 sm:grid-cols-2 lg:grid-cols-4 md:mt-16">
            {VALUES.map((v, i) => (
              <li key={v.title} data-value className="border-b border-cream/20 py-6 sm:pr-6 lg:pr-8">
                <span className="text-small text-sand tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="heading mt-3 text-[1.375rem]">{v.title}</h3>
                <p className="mt-2 text-cream/80">{v.body}</p>
              </li>
            ))}
          </ul>

          {/* Impact: intentions only, never claims (docs/BRAND.md §7). */}
          <div id="impact" className="mt-20 grid gap-10 md:mt-28 lg:grid-cols-12 lg:gap-(--gutter)">
            <div className="lg:col-span-5">
              <p className="caption text-cream/75!">( Grow with purpose )</p>
              <h2 className="display mt-4 text-h2">Growth that gives back</h2>
              <p className="mt-6 max-w-[42ch] text-lead text-cream/85">
                We want Bombay Craft’s success to create opportunities beyond our own team. As the studio grows, this is what we intend
                to build.
              </p>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <ul className="border-t border-cream/20">
                {IMPACT.map((item) => (
                  <li key={item} className="flex gap-4 border-b border-cream/20 py-5 text-lead">
                    <span className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-sand" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-(--radius) bg-cream/10 p-5 text-small text-cream/90">
                These are commitments we’re working towards, not claims. We’ll share real initiatives and outcomes here once they are in
                place.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
