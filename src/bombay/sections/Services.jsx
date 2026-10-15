import { useEffect, useRef, useState } from 'react'
import { Plus } from '@phosphor-icons/react'
import { gsap, MQ, useGSAP } from '../../animations/gsap'
import { revealLines } from '../../animations/reveal'
import { SERVICES, SUPPORTING } from '../lib/content'
import { Button } from '../components/ui'

export default function Services() {
  const root = useRef(null)
  const [open, setOpen] = useState(SERVICES[0].id)
  const [flash, setFlash] = useState(null)

  // Clicking an object in the hero toolkit opens (or highlights) its service.
  useEffect(() => {
    let timer = 0
    const onPick = (e) => {
      if (SERVICES.some((s) => s.id === e.detail)) setOpen(e.detail)
      else {
        setFlash(e.detail)
        window.clearTimeout(timer)
        timer = window.setTimeout(() => setFlash(null), 2200)
      }
    }
    window.addEventListener('bc:service', onPick)
    return () => {
      window.removeEventListener('bc:service', onPick)
      window.clearTimeout(timer)
    }
  }, [])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        revealLines(root.current.querySelector('h2'))
        gsap.from('[data-service]', {
          y: 24,
          opacity: 0,
          duration: 0.9,
          ease: 'lens',
          stagger: 0.07,
          scrollTrigger: { trigger: '[data-services]', start: 'top 85%', once: true },
        })
        gsap.from('[data-support]', {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: 'lens',
          stagger: 0.1,
          scrollTrigger: { trigger: '[data-supporting]', start: 'top 85%', once: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="services" ref={root} aria-labelledby="services-title" className="pb-(--section-pad)">
      <div className="frame">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-(--gutter)">
          <div className="lg:col-span-8">
            <p className="caption">( What we do )</p>
            <h2 id="services-title" className="display mt-4 text-h2">
              Websites and technology, built around your business
            </h2>
          </div>
          <p className="max-w-[38ch] text-dim lg:col-span-4">
            Our services are broad, but the priority is clear. Websites, digital products and business systems come first.
          </p>
        </div>

        <p className="caption mt-14 md:mt-20">Core services</p>
        <ul data-services className="mt-4 border-b border-line">
          {SERVICES.map((s, i) => {
            const isOpen = open === s.id
            return (
              <li key={s.id} data-service className="group border-t border-line">
                <h3>
                  <button
                    type="button"
                    id={`svc-${s.id}`}
                    aria-expanded={isOpen}
                    aria-controls={`svc-panel-${s.id}`}
                    onClick={() => setOpen(isOpen ? null : s.id)}
                    className="flex w-full items-center gap-5 py-6 text-left md:gap-10 md:py-7"
                  >
                    <span className="w-8 shrink-0 text-small text-dim tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                    <span
                      className={`heading flex-1 text-h3 transition-[color,translate] duration-500 ease-(--ease-lens) group-hover:translate-x-2 ${
                        isOpen ? 'text-ink' : 'text-ink/60'
                      }`}
                    >
                      {s.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`grid size-10 shrink-0 place-items-center rounded-full transition-all duration-500 ease-(--ease-lens) ${
                        isOpen ? 'rotate-45 bg-maroon text-cream' : 'border border-line'
                      }`}
                    >
                      <Plus weight="bold" />
                    </span>
                  </button>
                </h3>
                <div
                  id={`svc-panel-${s.id}`}
                  role="region"
                  aria-labelledby={`svc-${s.id}`}
                  className={`grid transition-[grid-template-rows] duration-700 ease-(--ease-lens) ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                  <div className="overflow-hidden" inert={!isOpen || undefined}>
                    <div className="grid gap-6 pb-8 pl-[3.25rem] md:grid-cols-2 md:gap-10 md:pr-20 md:pl-[4.5rem]">
                      <p className="max-w-[46ch] text-lead text-dim">{s.body}</p>
                      <ul className="flex flex-wrap content-start gap-2" aria-label={`${s.title} includes`}>
                        {s.tags.map((t) => (
                          <li key={t} className="rounded-full bg-paper-2 px-3.5 py-1.5 text-small ring-1 ring-line">
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        <div data-supporting className="mt-16 md:mt-20">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <p className="caption">Supporting services</p>
            <p className="max-w-[46ch] text-small text-dim md:text-right">They bring the digital experience to life and help it reach the right people.</p>
          </div>
          <ul className="mt-5 grid gap-(--gutter) md:grid-cols-3">
            {SUPPORTING.map((s) => (
              <li
                key={s.id}
                id={`svc-${s.id}`}
                data-support
                className={`rounded-(--radius) p-6 ring-1 transition-[background-color,box-shadow] duration-700 md:p-7 ${
                  flash === s.id ? 'bg-sand ring-maroon/40' : 'bg-paper-2 ring-line'
                }`}
              >
                <h3 className="heading text-[1.375rem]">{s.title}</h3>
                <p className="mt-2 text-dim">{s.body}</p>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Button href="#contact" variant="ghost" size="sm">
              Not sure which you need? Ask us
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
