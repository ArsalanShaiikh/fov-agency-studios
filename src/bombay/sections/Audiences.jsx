import { useRef } from 'react'
import { gsap, MQ, useGSAP } from '../../animations/gsap'
import { revealLines } from '../../animations/reveal'
import { AUDIENCES, DIFFERENCE } from '../lib/content'

export default function Audiences() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        revealLines(root.current.querySelector('h2'))
        revealLines(root.current.querySelector('blockquote p'))
        gsap.from('[data-row]', {
          y: 20,
          opacity: 0,
          duration: 0.9,
          ease: 'lens',
          stagger: 0.07,
          scrollTrigger: { trigger: '[data-rows]', start: 'top 85%', once: true },
        })
        gsap.from('[data-diff]', {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: 'lens',
          stagger: 0.08,
          scrollTrigger: { trigger: '[data-diffs]', start: 'top 85%', once: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="clients" ref={root} aria-labelledby="clients-title" className="pb-(--section-pad)">
      <div className="frame">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-(--gutter)">
          <div className="lg:col-span-5">
            <p className="caption">( Who we serve )</p>
            <h2 id="clients-title" className="display mt-4 text-h2">
              Every stage of growth
            </h2>
            <blockquote className="mt-8 border-l-2 border-maroon pl-5">
              <p className="heading max-w-[26ch] text-lead">We don’t believe a smaller business deserves less thoughtful work.</p>
            </blockquote>
          </div>

          <ol data-rows className="border-b border-line lg:col-span-7">
            {AUDIENCES.map((a, i) => (
              <li key={a.title} data-row className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-t border-line py-5 md:grid-cols-[3rem_1fr_1fr] md:items-baseline md:py-6">
                <span className="text-small text-dim tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="heading text-[1.375rem]">{a.title}</h3>
                <p className="col-start-2 mt-1 text-dim md:col-start-3 md:mt-0">{a.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <div data-diffs className="mt-20 md:mt-28">
          <p className="caption">( Why Bombay Craft )</p>
          <ul className="mt-5 grid gap-(--gutter) sm:grid-cols-2 lg:grid-cols-4">
            {DIFFERENCE.map((d, i) => (
              <li key={d.title} data-diff className="flex flex-col justify-between gap-10 rounded-(--radius) bg-paper-2 p-6 ring-1 ring-line md:p-7">
                <span className="text-small text-maroon tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="heading text-[1.375rem]">{d.title}</h3>
                  <p className="mt-2 text-dim">{d.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
