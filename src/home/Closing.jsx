import { useRef } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import { gsap, MQ, useGSAP } from '../animations/gsap'
import { STUDIO } from '../bombay/lib/content'
import { timeIn, useClock } from '../bombay/lib/useClock'

const subject = encodeURIComponent('A new project with Bombay Craft')

export default function Closing() {
  const root = useRef(null)
  const now = useClock()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        // Each line of the guiding idea lights up as it reaches the middle of the screen.
        gsap.utils.toArray('[data-idea]', root.current).forEach((line) => {
          gsap.fromTo(
            line,
            { opacity: 0.18, x: -24 },
            { opacity: 1, x: 0, ease: 'none', scrollTrigger: { trigger: line, start: 'top 85%', end: 'top 50%', scrub: true } },
          )
        })
        gsap.from('[data-cta] > *', {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: 'lens',
          stagger: 0.08,
          scrollTrigger: { trigger: '[data-cta]', start: 'top 85%', once: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="contact" ref={root} data-nav="dark" aria-labelledby="idea-title" className="bg-oxblood text-ivory">
      <div className="frame section-pad">
        <p className="label text-sand">( Our guiding idea )</p>
        <h2 id="idea-title" className="display mt-6 text-mega">
          <span data-idea className="block">
            Build useful things.
          </span>
          <span data-idea className="block">
            Craft them with <span className="accent text-sand">care.</span>
          </span>
          <span data-idea className="block">
            Grow with purpose.
          </span>
        </h2>

        <div data-cta className="mt-20 grid gap-10 border-t border-ivory/20 pt-10 md:mt-28 lg:grid-cols-12 lg:gap-(--gutter)">
          <div className="lg:col-span-5">
            <p className="label text-sand">( Start a project )</p>
            <p className="mt-4 max-w-[34ch] text-lead text-ivory/90">
              From a first website to a custom CRM, tell us what you’re building. We’ll come back with clear questions, an honest
              scope and a ballpark.
            </p>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-7 lg:items-end">
            <a
              href={`mailto:${STUDIO.email}?subject=${subject}`}
              className="group display inline-flex items-center gap-4 text-[clamp(1.75rem,1rem+2.6vw,3.75rem)] leading-none"
            >
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 ease-(--ease-lens) group-hover:bg-[length:100%_2px]">
                {STUDIO.email}
              </span>
              <span className="grid size-[1.1em] shrink-0 place-items-center rounded-full bg-ivory text-oxblood transition-transform duration-500 ease-(--ease-lens) group-hover:rotate-45">
                <ArrowUpRight weight="bold" className="size-[0.5em]" />
              </span>
            </a>
          </div>
        </div>
      </div>

      <footer className="frame flex flex-col gap-3 border-t border-ivory/20 py-6 text-small text-ivory/75 md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {STUDIO.name} · <span lang="mr">बॉम्बे क्राफ्ट</span>
        </p>
        <p>{STUDIO.tagline}</p>
        <p className="tabular-nums">
          Mumbai <time dateTime={now?.toISOString()}>{timeIn(now, 'Asia/Kolkata')}</time> IST
        </p>
      </footer>
    </section>
  )
}
