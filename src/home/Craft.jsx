import { useRef } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import { gsap, MQ, useGSAP } from '../animations/gsap'
import { revealLines } from '../animations/reveal'
import { SERVICES, SUPPORTING } from '../bombay/lib/content'
import { jump } from '../bombay/lib/jump'

// Short names for the big index; full titles stay in content.js.
const INDEX = {
  websites: 'Websites',
  product: 'Digital products',
  apps: 'Web applications',
  crm: 'CRM & automation',
}

export default function Craft() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        revealLines(root.current.querySelector('h2'))
        gsap.utils.toArray('[data-row]', root.current).forEach((row) => {
          gsap.from(row.querySelector('[data-rule]'), { scaleX: 0, duration: 1.2, ease: 'lens', scrollTrigger: { trigger: row, start: 'top 90%', once: true } })
          gsap.from(row.querySelectorAll('[data-rise]'), {
            yPercent: 100,
            opacity: 0,
            duration: 1.1,
            ease: 'lens',
            stagger: 0.06,
            scrollTrigger: { trigger: row, start: 'top 88%', once: true },
          })
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="craft" ref={root} data-nav="light" aria-labelledby="craft-title" className="bg-ivory text-charcoal section-pad">
      <div className="frame">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-(--gutter)">
          <div className="lg:col-span-8">
            <p className="label text-mute-dark">( What we craft )</p>
            <h2 id="craft-title" className="display mt-5 text-h2">
              Technology first. <span className="accent text-oxblood">Crafted</span> throughout.
            </h2>
          </div>
          <p className="max-w-[40ch] text-mute-dark lg:col-span-4">
            Our services are broad, but the priority is clear: websites, digital products and business systems, built around real
            business needs.
          </p>
        </div>

        <ol className="mt-16 md:mt-24">
          {SERVICES.map((s, i) => (
            <li key={s.id} data-row className="group relative">
              <div data-rule aria-hidden="true" className="h-px origin-left bg-charcoal/20" />
              <div className="relative overflow-hidden">
                {/* Hover: oxblood rises through the row like dye */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 translate-y-full bg-oxblood transition-transform duration-700 ease-(--ease-lens) group-hover:translate-y-0 max-lg:hidden"
                />
                <div className="relative grid gap-x-(--gutter) gap-y-4 py-7 transition-colors duration-500 group-hover:text-ivory md:py-9 lg:grid-cols-12 lg:items-center lg:px-4">
                  <span data-rise className="label text-mute-dark transition-colors duration-500 group-hover:text-sand lg:col-span-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 data-rise className="display text-[clamp(2.25rem,1rem+4.2vw,6rem)] leading-none lg:col-span-6">
                    {INDEX[s.id]}
                  </h3>
                  <div data-rise className="lg:col-span-5">
                    <p className="max-w-[42ch] text-mute-dark transition-colors duration-500 group-hover:text-ivory/85">{s.body}</p>
                    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-small text-charcoal/70 transition-colors duration-500 group-hover:text-sand" aria-label={`${s.title} includes`}>
                      {s.tags.slice(0, 4).map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          ))}
          <li aria-hidden="true" className="h-px bg-charcoal/20" />
        </ol>

        <div className="mt-12 flex flex-col gap-6 md:mt-16 md:flex-row md:items-center md:justify-between">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-mute-dark">
            <span className="label">Supported by</span>
            {SUPPORTING.map((s) => (
              <span key={s.id} className="rounded-full px-3.5 py-1.5 text-small text-charcoal ring-1 ring-charcoal/20">
                {s.title}
              </span>
            ))}
          </p>
          <a href="#contact" onClick={(e) => jump(e, 'contact')} className="group inline-flex items-center gap-2 font-medium text-oxblood">
            Not sure what you need? Ask us
            <ArrowUpRight weight="bold" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  )
}
