import { useEffect, useRef, useState } from 'react'
import { gsap } from '../animations/gsap'
import { startScroll, stopScroll } from '../animations/smoothScroll'
import { markReady } from '../bombay/lib/ready'
import { createSand } from './sand'

// The studio's two lines, mixing Hindi, Marathi and English, each with a small
// English gloss underneath. About two and a half seconds each.
const LINES = [
  { text: 'ख़याल से Creation तक।', lang: 'hi', gloss: 'From a thought, all the way to creation.' },
  { text: 'विचार आपले. Vision Global.', lang: 'mr', gloss: 'The ideas are ours. The vision is global.' },
]
const HOLD = 1.3 // seconds each line rests, fully readable

/**
 * Lines, then sand. Each line's words rise out of a mask one by one while its
 * English gloss types itself underneath; the line lifts away before the next.
 * Then beach sand bursts out of the centre into the Bombay Craft wordmark, and
 * finally flies outward in every direction as the screen opens from the middle.
 */
export default function Preloader() {
  const root = useRef(null)
  const canvas = useRef(null)
  const [gone, setGone] = useState(false)
  const skipRef = useRef(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const el = root.current
    const sand = createSand(canvas.current)
    let cancelled = false
    const timers = []
    const wait = (ms) => new Promise((res) => timers.push(window.setTimeout(res, ms)))
    let tl

    // Lenis starts in App's effect, which runs after this one.
    const lock = requestAnimationFrame(() => stopScroll())

    const finish = () => {
      if (cancelled) return
      cancelled = true
      markReady()
      startScroll()
      setGone(true)
    }

    skipRef.current = () => {
      tl?.kill()
      timers.forEach(clearTimeout)
      gsap.to(el, { opacity: 0, duration: 0.35, onComplete: finish })
    }

    if (reduce) {
      gsap.set(el.querySelectorAll('[data-line]'), { autoAlpha: 0 })
      document.fonts.ready.then(() => {
        sand.refresh()
        sand.still()
        wait(1200).then(() => gsap.to(el, { opacity: 0, duration: 0.4, onComplete: finish }))
      })
      return () => {
        cancelAnimationFrame(lock)
        timers.forEach(clearTimeout)
        sand.stop()
      }
    }

    sand.start()

    // The lines, as one timeline: flip in, rest, flip over to the next.
    const [one, two] = [...el.querySelectorAll('[data-line]')]
    const words = (line) => line.querySelectorAll('[data-w]')
    const chars = (line) => line.querySelectorAll('[data-c]')
    const gloss = (line) => line.querySelector('[data-gloss]')
    const flipIn = { rotateX: 0, yPercent: 0, filter: 'blur(0px)', opacity: 1, duration: 0.85, ease: 'expo.out', stagger: 0.07 }
    const fromBelow = { rotateX: -95, yPercent: 35, filter: 'blur(8px)', opacity: 0 }

    tl = gsap.timeline({ delay: 0.25 })
    tl.set(one, { autoAlpha: 1 })
    tl.fromTo(words(one), fromBelow, flipIn)
    tl.fromTo(chars(one), { opacity: 0 }, { opacity: 1, duration: 0.01, stagger: 0.018 }, '<0.3')
    // The flip-board change: each word turns over and the next line's words
    // turn up behind it, overlapping, so the screen is never empty.
    tl.addLabel('change', `>${HOLD}`)
    tl.to(words(one), { rotateX: 95, yPercent: -35, filter: 'blur(8px)', opacity: 0, duration: 0.5, ease: 'power2.in', stagger: 0.05 }, 'change')
    tl.to(gloss(one), { opacity: 0, duration: 0.3 }, 'change')
    tl.set(two, { autoAlpha: 1 }, 'change+=0.2')
    tl.fromTo(words(two), fromBelow, flipIn, 'change+=0.25')
    tl.fromTo(chars(two), { opacity: 0 }, { opacity: 1, duration: 0.01, stagger: 0.018 }, '<0.3')
    tl.to({}, { duration: HOLD })

    const loaded = new Promise((res) => (document.readyState === 'complete' ? res() : window.addEventListener('load', res, { once: true })))
    const ready = Promise.race([Promise.all([loaded, document.fonts.ready]), wait(3000)])

    ;(async () => {
      await tl.then()
      await ready
      if (cancelled) return
      // The second line collapses into the centre, and the sand bursts out of it.
      const cx = window.innerWidth / 2
      gsap.to(words(two), {
        x: (_, w) => (cx - (w.getBoundingClientRect().left + w.offsetWidth / 2)) * 0.85,
        scale: 0.2,
        filter: 'blur(6px)',
        opacity: 0,
        duration: 0.45,
        ease: 'power3.in',
      })
      gsap.to(gloss(two), { opacity: 0, duration: 0.25 })
      sand.refresh()
      await wait(330)
      if (cancelled) return
      sand.form()
      await wait(2100)
      if (cancelled) return
      // The burst: sand flies outward while the screen opens from the middle.
      gsap.to(el.querySelector('[data-ui]'), { opacity: 0, duration: 0.3 })
      gsap.fromTo(el, { '--r': '-30vmax' }, { '--r': '120vmax', duration: 1.3, ease: 'power2.in', delay: 0.1 })
      window.setTimeout(markReady, 500)
      await sand.scatter()
      finish()
    })()

    return () => {
      cancelled = true
      cancelAnimationFrame(lock)
      timers.forEach(clearTimeout)
      tl?.kill()
      sand.stop()
    }
  }, [])

  if (gone) return null

  return (
    <div ref={root} data-preloader role="status" aria-label="Loading Bombay Craft" className="fixed inset-0 z-[100] overflow-hidden text-ivory [--r:-30vmax]">
      {/* The dark screen: opens from the middle as the sand bursts out (a growing circular mask) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-charcoal"
        style={{
          maskImage: 'radial-gradient(circle at 50% 45%, transparent var(--r), #000 calc(var(--r) + 30vmax))',
          WebkitMaskImage: 'radial-gradient(circle at 50% 45%, transparent var(--r), #000 calc(var(--r) + 30vmax))',
        }}
      />
      <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 size-full" />

      <div data-ui className="relative h-full">
        {/* The lines, stacked; the timeline shows one at a time. */}
        {LINES.map((line, i) => (
          <div
            key={i}
            data-line
            aria-hidden="true"
            className="invisible absolute inset-x-0 top-1/2 mx-auto w-full max-w-[min(92vw,62rem)] -translate-y-[60%] px-4 text-center"
          >
            <p
              lang={line.lang}
              className="display flex flex-wrap justify-center gap-x-[0.28em] [perspective:900px] text-[clamp(2rem,1rem+4.4vw,5.5rem)] leading-[1.1] [font-family:'General_Sans','Tiro_Devanagari_Marathi',sans-serif]"
            >
              {line.text.split(' ').map((word, k) => (
                <span key={k} className="inline-block">
                  <span data-w className="inline-block origin-center will-change-transform [backface-visibility:hidden]">
                    {word}
                  </span>
                </span>
              ))}
            </p>
            <p data-gloss className="mono mt-6 text-small text-ivory/65 uppercase">
              {line.gloss.split('').map((ch, k) => (
                <span key={k} data-c>
                  {ch}
                </span>
              ))}
            </p>
          </div>
        ))}

        <button
          type="button"
          onClick={() => skipRef.current?.()}
          className="mono absolute right-5 bottom-5 rounded-full px-4 py-2 text-small text-ivory/80 uppercase ring-1 ring-ivory/30 transition-colors hover:bg-ivory hover:text-charcoal md:right-8 md:bottom-8"
        >
          Skip intro
        </button>
      </div>
    </div>
  )
}
