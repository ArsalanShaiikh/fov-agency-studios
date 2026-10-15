import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../animations/gsap'
import { startScroll, stopScroll } from '../../animations/smoothScroll'
import { markReady } from '../lib/ready'
import { Logo } from './ui'

const WORDS = ['websites', 'films', 'campaigns', 'brands', 'stories']
const STRIPS = 5

/**
 * "Filling the mark": on a maroon screen the Bombay Craft mark fills with cream
 * from the bottom up while a counter runs 000 to 100, then the screen lifts
 * away in five strips (echoing the hero's columns). Shown once per session;
 * index.html hides it before paint on repeat visits (html.bc-seen).
 */
export default function Preloader() {
  const root = useRef(null)
  // Prerender always includes it; repeat visits are hidden by CSS and skip the run.
  const [seen] = useState(() => typeof document !== 'undefined' && document.documentElement.classList.contains('bc-seen'))
  const [done, setDone] = useState(false)
  const [word, setWord] = useState(0)

  useEffect(() => {
    if (seen) {
      markReady()
      return
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const el = root.current
    const counter = el.querySelector('[data-count]')
    const progress = { p: 0 }
    const render = () => {
      el.style.setProperty('--p', progress.p / 100)
      counter.textContent = String(Math.round(progress.p)).padStart(3, '0')
    }

    // Lenis starts in App's effect, which runs after this one.
    const lock = requestAnimationFrame(() => stopScroll())
    const words = reduce ? 0 : window.setInterval(() => setWord((w) => (w + 1) % WORDS.length), 420)

    // Climb to 80 on a timer, then finish once fonts and images are in.
    const climb = gsap.to(progress, { p: 80, duration: reduce ? 0.3 : 1.8, ease: 'power2.out', onUpdate: render })
    const loaded = new Promise((res) => (document.readyState === 'complete' ? res() : window.addEventListener('load', res, { once: true })))
    const cap = new Promise((res) => window.setTimeout(res, 4500))
    let exit
    Promise.race([Promise.all([loaded, document.fonts.ready]), cap])
      .then(() => climb.then())
      .then(() => {
        window.clearInterval(words)
        exit = gsap.timeline({
          onComplete: () => {
            try {
              sessionStorage.setItem('bc-loaded', '1')
            } catch {
              /* private mode: show it again next time, harmlessly */
            }
            startScroll()
            setDone(true)
          },
        })
        exit.to(progress, { p: 100, duration: reduce ? 0.2 : 0.6, ease: 'power2.inOut', onUpdate: render })
        if (reduce) {
          exit.to(el, { opacity: 0, duration: 0.4 }).call(markReady, null, '<')
          return
        }
        exit.to('[data-pre-content]', { yPercent: -8, opacity: 0, duration: 0.7, ease: 'power3.in' }, '+=0.15')
        exit.to(el.querySelectorAll('[data-strip]'), { yPercent: -100, duration: 1, ease: 'expo.inOut', stagger: { each: 0.07, from: 'center' } }, '-=0.2')
        // The hero starts its own intro while the strips are still lifting.
        exit.call(markReady, null, '-=0.75')
      })

    return () => {
      cancelAnimationFrame(lock)
      window.clearInterval(words)
      climb.kill()
      exit?.kill()
    }
  }, [seen])

  // Repeat visits keep the (CSS-hidden) node so hydration matches the prerender.
  if (done) return null

  return (
    <div ref={root} data-preloader role="status" aria-label="Loading Bombay Craft" className="fixed inset-0 z-[100] [--p:0]">
      {/* The curtain: five strips that lift away on exit */}
      <div aria-hidden="true" className="absolute inset-0 flex">
        {Array.from({ length: STRIPS }, (_, i) => (
          <div key={i} data-strip className="-mr-px h-full flex-1 bg-maroon" />
        ))}
      </div>

      <div data-pre-content aria-hidden="true" className="relative flex h-full flex-col justify-between p-5 text-cream md:p-8">
        <div className="flex justify-between text-small text-cream/75">
          <span>( Bombay Craft )</span>
          <span>Creative & technology agency</span>
        </div>

        <div className="flex flex-col items-center">
          {/* The mark: a faint outline, filled with cream from the bottom up */}
          <div className="relative w-[min(78vw,36rem)]">
            <Logo label="" className="w-full text-cream/15" />
            <div className="absolute inset-0" style={{ clipPath: 'inset(calc((1 - var(--p)) * 100%) 0 0 0)' }}>
              <Logo label="" className="w-full" style={{ background: 'linear-gradient(0deg, var(--color-sand), var(--color-cream) 60%)' }} />
            </div>
          </div>
          <p className="mt-8 flex items-baseline gap-2 text-lead text-cream/80">
            Crafting
            <span className="relative inline-block min-w-[6.5ch] overflow-hidden text-cream">
              <span key={word} className="block animate-[word-in_0.42s_var(--ease-lens)]">
                {WORDS[word]}
              </span>
            </span>
          </p>
        </div>

        <div className="flex items-end justify-between gap-6">
          <p className="display text-[clamp(3.5rem,2rem+6vw,8rem)] leading-[0.8] tabular-nums">
            <span data-count>000</span>
          </p>
          <div className="text-right text-small text-cream/75">
            <p>Mumbai, India</p>
            <p className="tabular-nums">18.9220° N, 72.8347° E</p>
          </div>
        </div>
      </div>
    </div>
  )
}
