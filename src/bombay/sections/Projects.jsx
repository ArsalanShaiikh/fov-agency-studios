import { useRef } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import { gsap, MQ, SplitText, useGSAP } from '../../animations/gsap'
import { WORK } from '../lib/content'
import { CrmDemo, ReelDemo, WebDemo } from '../components/demos'

const COVERS = {
  web: () => <WebDemo title="On air now: Monsoon FM" />,
  crm: CrmDemo,
  app: () => <WebDemo tone="plum" title="Today: 42 deliveries" />,
  reel: ReelDemo,
}

export default function Projects() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        const split = SplitText.create(root.current.querySelector('h2'), { type: 'chars', mask: 'chars' })
        gsap.from(split.chars, {
          yPercent: 100,
          duration: 1.1,
          ease: 'lens',
          stagger: 0.03,
          scrollTrigger: { trigger: root.current.querySelector('h2'), start: 'top 85%', once: true },
        })
        return () => split.revert()
      })
      // A deck: each card settles back as the next slides over it.
      mm.add(`${MQ.motion} and ${MQ.desktop}`, () => {
        const cards = gsap.utils.toArray('[data-card]', root.current)
        cards.slice(0, -1).forEach((card, i) => {
          gsap.to(card, {
            scale: 0.9,
            yPercent: -4,
            filter: 'brightness(0.55)',
            ease: 'none',
            scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top 15%', scrub: true },
          })
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="work" ref={root} aria-labelledby="work-title" className="pb-(--section-pad)">
      <div className="frame">
        <div className="flex flex-col items-center text-center">
          <p className="caption">( Concept work, {String(WORK.length).padStart(2, '0')} )</p>
          <h2 id="work-title" className="display mt-4 text-giant">
            Selected work
          </h2>
          <p className="mt-5 max-w-[50ch] text-dim">
            Concept pieces that show the kind of work we do. Real case studies, with the challenge, our approach and the result, will
            appear here as client projects go live.
          </p>
        </div>

        <ol className="mt-12 flex flex-col gap-(--gutter) md:mt-16">
          {WORK.map((w, i) => {
            const Cover = COVERS[w.demo]
            return (
              <li key={w.title} className="lg:sticky" style={{ top: `calc(var(--nav-h) + ${i * 1.25}rem)` }}>
                <article data-card aria-labelledby={`work-${i}`} className="group relative origin-top overflow-hidden rounded-(--radius) bg-night text-cream">
                  <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-auto lg:h-[min(74svh,50rem)]">
                    <Cover />
                  </div>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-[linear-gradient(transparent,rgb(11_9_8/0.85))] pt-24" />
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 md:p-7">
                    <span className="rounded-full bg-night/75 px-3 py-1.5 text-small font-medium backdrop-blur-md">Concept</span>
                    <span className="rounded-full bg-night/75 px-3 py-1.5 text-small tabular-nums backdrop-blur-md">
                      {String(i + 1).padStart(2, '0')} / {String(WORK.length).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5 md:flex-row md:items-end md:justify-between md:p-7">
                    <h3 id={`work-${i}`} className="display text-h2">
                      {w.title}
                    </h3>
                    <p className="flex items-center gap-3 text-cream/85 md:pb-2">
                      {w.kind}
                      <span className="grid size-9 place-items-center rounded-full bg-cream text-night transition-transform duration-500 ease-(--ease-lens) group-hover:rotate-45">
                        <ArrowUpRight weight="bold" />
                      </span>
                    </p>
                  </div>
                </article>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
