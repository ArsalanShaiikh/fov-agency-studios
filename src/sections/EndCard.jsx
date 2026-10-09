import { useRef, useState } from 'react'
import { ArrowUp } from '@phosphor-icons/react'
import { CONTACT, END_CARD, SOCIALS } from '../lib/content'
import { setState } from '../lib/store'
import { scrollToTarget } from '../animations/smoothScroll'
import { useMagnetic } from '../hooks/useMagnetic'
import { useEndCardMotion } from '../animations/sections/endcard'
import MumbaiClock from '../components/MumbaiClock'

// End card: Contact + Footer. "Lights on": the innermost frame floods signal
// yellow and expands to full bleed (DESIGN.md §7.7). The page's one colour flip.
export default function EndCard() {
  const root = useRef(null)
  const emailRef = useRef(null)
  const copyTimer = useRef(0)
  const [copyState, setCopyState] = useState('idle')
  useMagnetic(emailRef, 10)
  useEndCardMotion(root)

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(CONTACT.email)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
    window.clearTimeout(copyTimer.current)
    copyTimer.current = window.setTimeout(() => setCopyState('idle'), 2400)
  }

  return (
    <div ref={root} data-endcard-wrap className="relative">
      {/* Bookend: room for the camera to pull back and the frame to flood. */}
      <div data-bookend aria-hidden="true" className="h-0 motion-safe:h-[180svh]" />
      <div
        data-flood
        aria-hidden="true"
        className="pointer-events-none invisible fixed inset-0 bg-signal opacity-0 motion-reduce:hidden"
      />
      <div data-endcard className="relative flex min-h-svh flex-col bg-signal text-ink">
        <section
          id="contact"
          aria-labelledby="contact-title"
          tabIndex={-1}
          className="frame flex-1 pt-[calc(var(--nav-h)+clamp(3rem,10svh,9rem))] pb-[clamp(4rem,10svh,8rem)] outline-none"
        >
          <h2 id="contact-title" data-endcard-reveal className="display max-w-[16ch] text-display">
            {END_CARD.headline}
          </h2>
          <p data-endcard-reveal className="headline mt-8 max-w-[38ch] text-lead">
            {/* PLACEHOLDER */}
            {END_CARD.body}
          </p>

          <div data-endcard-reveal className="mt-[clamp(2.5rem,6svh,4.5rem)] flex flex-col items-start gap-5">
            {/* PLACEHOLDER: temporary address */}
            <a
              ref={emailRef}
              href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(CONTACT.subject)}`}
              className="headline inline-block text-[clamp(1.75rem,1rem+4.2vw,6rem)] leading-none underline decoration-1 underline-offset-[0.14em] transition-[text-decoration-color] duration-300 hover:decoration-transparent"
              data-focus
            >
              {CONTACT.email}
            </a>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={copyEmail}
                className="mono-label h-11 border border-ink px-5 transition-colors duration-300 hover:bg-ink hover:text-signal active:translate-y-px"
                data-focus
              >
                {copyState === 'copied' ? END_CARD.copied : END_CARD.copy}
              </button>
              <p role="status" className="mono-label text-signal-soft normal-case">
                {copyState === 'failed' ? END_CARD.copyFailed : ''}
              </p>
            </div>
          </div>

          {/* PLACEHOLDER: temporary social links */}
          <ul data-endcard-reveal className="mt-[clamp(3rem,8svh,6rem)] flex flex-wrap gap-x-8 gap-y-3">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block py-1.5 text-[1.0625rem] font-medium underline decoration-1 underline-offset-4 transition-[text-decoration-color] duration-300 hover:decoration-transparent"
                  data-focus
                >
                  {s.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <footer className="frame grid gap-4 border-t border-ink/25 py-6 md:grid-cols-[1fr_auto_auto_auto] md:items-center md:gap-10">
          <MumbaiClock />
          <p className="mono-label">© {new Date().getFullYear()} FOV</p>
          <button
            type="button"
            className="mono-label -my-2 justify-self-start py-2 underline decoration-1 underline-offset-4"
            onClick={() => setState({ creditsOpen: true })}
            aria-haspopup="dialog"
            data-focus
          >
            Credits
          </button>
          <a
            href="#top"
            className="mono-label -my-2 inline-flex items-center gap-2 justify-self-start py-2"
            onClick={(e) => {
              e.preventDefault()
              scrollToTarget(0)
              document.querySelector('#main')?.focus({ preventScroll: true })
            }}
            data-focus
          >
            Back to top <ArrowUp aria-hidden="true" size={14} weight="bold" />
          </a>
        </footer>
      </div>
    </div>
  )
}
