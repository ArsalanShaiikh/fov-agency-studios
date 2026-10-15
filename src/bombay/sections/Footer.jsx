import { ArrowUp } from '@phosphor-icons/react'
import { NAV, STUDIO } from '../lib/content'
import { jump } from '../lib/jump'
import { timeIn, useClock } from '../lib/useClock'

export default function Footer() {
  const now = useClock()
  return (
    <footer className="overflow-hidden pt-16 md:pt-20">
      <div className="frame">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-(--gutter)">
          <div className="lg:col-span-5">
            <p className="heading max-w-[20ch] text-h3">
              {STUDIO.guidingIdea.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <p className="mt-4 max-w-[36ch] text-dim">A digital-first creative and technology studio for websites, digital products and business systems.</p>
          </div>
          <nav aria-label="Footer" className="lg:col-span-2 lg:col-start-7">
            <p className="caption">( Explore )</p>
            <ul className="mt-4 flex flex-col gap-1.5">
              {[...NAV, { id: 'services', label: 'Services' }, { id: 'contact', label: 'Contact' }].map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} onClick={(e) => jump(e, n.id)} className="transition-colors hover:text-maroon">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="lg:col-span-3">
            <p className="caption">( Studio )</p>
            <p className="mt-4">{STUDIO.city}</p>
            <p className="text-dim tabular-nums">
              <time dateTime={now?.toISOString()}>{timeIn(now, 'Asia/Kolkata')}</time> IST
            </p>
            <a href={`mailto:${STUDIO.email}`} className="mt-3 inline-block underline decoration-ink/25 underline-offset-4 hover:text-maroon">
              {STUDIO.email}
            </a>
          </div>
          <div className="lg:col-span-1 lg:justify-self-end">
            <a
              href="#top"
              onClick={(e) => jump(e, 'top')}
              aria-label="Back to top"
              className="grid size-12 place-items-center rounded-full border border-line transition-colors hover:bg-ink hover:text-paper"
            >
              <ArrowUp weight="bold" />
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-line py-5 text-small text-dim">
          <p>
            © {new Date().getFullYear()} {STUDIO.name}
          </p>
          <p>{STUDIO.tagline}</p>
        </div>
      </div>

      <p aria-hidden="true" className="display -mb-[0.14em] text-center text-[15.8vw] leading-none whitespace-nowrap select-none">
        Bombay Craft
      </p>
    </footer>
  )
}
