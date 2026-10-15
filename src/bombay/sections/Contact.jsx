import { useRef, useState } from 'react'
import { ArrowRight, EnvelopeSimple, WhatsappLogo } from '@phosphor-icons/react'
import { gsap, MQ, useGSAP } from '../../animations/gsap'
import { revealLines } from '../../animations/reveal'
import { NEEDS, STUDIO } from '../lib/content'

const field =
  'mt-2 w-full rounded-xl border border-cream/15 bg-night/40 px-4 py-3 text-cream outline-none transition-colors placeholder:text-cream/40 focus:border-sand'

export default function Contact() {
  const root = useRef(null)
  const [needs, setNeeds] = useState([])
  const [sent, setSent] = useState(false)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        revealLines(root.current.querySelector('h2'))
        gsap.from('[data-cta-glow]', {
          opacity: 0,
          yPercent: 30,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'center center', scrub: true },
        })
      })
    },
    { scope: root },
  )

  const toggle = (need) => setNeeds((n) => (n.includes(need) ? n.filter((x) => x !== need) : [...n, need]))

  const submit = (e) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const subject = `New project${needs.length ? `: ${needs.join(', ')}` : ''} from ${data.get('name')}`
    const body = [
      `Name: ${data.get('name')}`,
      `Email: ${data.get('email')}`,
      data.get('company') ? `Company: ${data.get('company')}` : null,
      needs.length ? `Looking for: ${needs.join(', ')}` : null,
      '',
      data.get('message'),
    ]
      .filter((l) => l !== null)
      .join('\n')
    window.location.href = `mailto:${STUDIO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <section id="contact" ref={root} aria-labelledby="contact-title" className="px-1.5 pb-1.5 md:px-2 md:pb-2">
      <div className="relative isolate overflow-hidden rounded-[clamp(1rem,0.8rem+1vw,1.75rem)] bg-night text-cream section-pad">
      {/* The sunset again, rising this time */}
      <div data-cta-glow aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -bottom-[40%] left-1/2 aspect-square w-[90vw] -translate-x-1/2 rounded-full bg-maroon/45 blur-[140px]" />
        <div className="absolute -right-[10%] -bottom-[30%] aspect-square w-[45vw] rounded-full bg-sky/35 blur-[120px]" />
      </div>

      <div className="frame grid gap-14 lg:grid-cols-12 lg:gap-(--gutter)">
        <div className="lg:col-span-5">
          <p className="caption text-cream/60!">( Start a project )</p>
          <h2 id="contact-title" className="display mt-5 text-h2">
            Your ideas, built for <span className="sunset-text">what comes next.</span>
          </h2>
          <p className="mt-6 max-w-[40ch] text-lead text-cream/80">
            Tell us about your business and what you need, from a first website to a custom CRM. We’ll come back with clear questions, an honest scope and a ballpark.
          </p>
          <ul className="mt-10 flex flex-col gap-4">
            <li>
              <a href={`mailto:${STUDIO.email}`} className="group inline-flex items-center gap-3 text-lead">
                <span className="grid size-11 place-items-center rounded-full border border-cream/15 transition-colors group-hover:border-sand group-hover:text-sand">
                  <EnvelopeSimple size={20} />
                </span>
                {STUDIO.email}
              </a>
            </li>
            {STUDIO.whatsapp && (
              <li>
                <a href={`https://wa.me/${STUDIO.whatsapp}`} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-3 text-lead">
                  <span className="grid size-11 place-items-center rounded-full border border-cream/15 transition-colors group-hover:border-sand group-hover:text-sand">
                    <WhatsappLogo size={20} />
                  </span>
                  WhatsApp us
                </a>
              </li>
            )}
          </ul>
        </div>

        <form onSubmit={submit} className="rounded-(--radius) bg-night-2/70 p-6 ring-1 ring-cream/10 backdrop-blur-xl md:p-10 lg:col-span-6 lg:col-start-7">
          <fieldset>
            <legend className="text-small text-cream/60">I’m interested in</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {NEEDS.map((need) => {
                const on = needs.includes(need)
                return (
                  <button
                    key={need}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(need)}
                    className={`rounded-full border px-4 py-2 text-small font-medium transition-colors duration-300 ${
                      on ? 'border-transparent bg-cream text-night' : 'border-cream/15 text-cream/85 hover:border-cream/50'
                    }`}
                  >
                    {need}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <label className="block text-small text-cream/60">
              Your name
              <input name="name" required autoComplete="name" className={field} />
            </label>
            <label className="block text-small text-cream/60">
              Email
              <input name="email" type="email" required autoComplete="email" className={field} />
            </label>
            <label className="block text-small text-cream/60 sm:col-span-2">
              Company (optional)
              <input name="company" autoComplete="organization" className={field} />
            </label>
            <label className="block text-small text-cream/60 sm:col-span-2">
              About the project
              <textarea name="message" required rows={4} className={`${field} resize-y`} placeholder="A new website, a customer portal, a CRM for our sales team…" />
            </label>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <button
              type="submit"
              className="group inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3.5 font-medium text-night transition-colors duration-300 hover:bg-sand"
            >
              Send enquiry
              <ArrowRight weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <p className="text-small text-cream/60" aria-live="polite">
              {sent ? `Your email app should open with this filled in. If not, write to ${STUDIO.email}.` : 'Opens your email app, ready to send.'}
            </p>
          </div>
        </form>
      </div>
      </div>
    </section>
  )
}
