import { useEffect, useRef } from 'react'
import { ArrowDown, ArrowUpRight } from '@phosphor-icons/react'
import { gsap, MQ, SplitText, useGSAP } from '../animations/gsap'
import { jump } from '../bombay/lib/jump'
import { onReady } from '../bombay/lib/ready'
import { startLoom } from './loom'

export default function Hero() {
  const root = useRef(null)
  const canvas = useRef(null)
  const slot = useRef(null)

  // The loom draws its warp at once and starts weaving when the page is revealed.
  useEffect(() => {
    const loom = startLoom(canvas.current, slot.current, { reduceMotion: window.matchMedia(MQ.reduce).matches })
    onReady(() => loom.play())
    return () => loom.stop()
  }, [])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      const intro = root.current.querySelectorAll('[data-intro]')
      mm.add(MQ.motion, () => {
        gsap.set(intro, { opacity: 1 })
        const split = SplitText.create('[data-line]', { type: 'lines,chars', mask: 'lines', linesClass: 'split-line', aria: 'none' })
        const tl = gsap.timeline({ defaults: { ease: 'lens' }, paused: true })
        tl.from(split.chars, { yPercent: 110, duration: 1.3, stagger: 0.022 })
        tl.from('[data-fade]', { opacity: 0, y: 14, duration: 1, stagger: 0.08 }, 0.5)
        // The mill label swings in on its thread, then keeps a gentle sway.
        tl.from('[data-tag]', { rotate: -50, opacity: 0, duration: 1.6, ease: 'elastic.out(1, 0.45)' }, 1.4)
        tl.to('[data-tag]', { rotate: -2, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 })
        onReady(() => tl.play())

        // As the page moves on, the two lines drift apart and the cloth recedes.
        const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
        gsap.to('[data-line="1"]', { xPercent: -8, ease: 'none', scrollTrigger: st })
        gsap.to('[data-line="2"]', { xPercent: 8, ease: 'none', scrollTrigger: st })
        gsap.to(canvas.current, { opacity: 0.25, ease: 'none', scrollTrigger: st })
        return () => split.revert()
      })
      mm.add(MQ.reduce, () => gsap.set(intro, { opacity: 1 }))
    },
    { scope: root },
  )

  return (
    <section
      id="top"
      ref={root}
      data-nav="dark"
      aria-labelledby="hero-title"
      className="relative h-svh max-h-[72rem] min-h-[40rem] overflow-hidden bg-charcoal"
    >
      <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 size-full" />

      <div className="pointer-events-none frame relative flex h-full flex-col pt-[calc(var(--nav-h)+1.5vh)] pb-5 md:pb-7">
        <h1 id="hero-title" className="sr-only">
          Digital experiences. Thoughtfully crafted.
        </h1>

        <p data-line="1" data-intro aria-hidden="true" className="display text-mega">
          Digital experiences.
        </p>

        {/* The loom's swatch is woven inside this slot. */}
        <div ref={slot} aria-hidden="true" className="relative mx-auto my-[2.2vh] min-h-32 w-[min(84vw,30rem)] flex-1 md:w-[min(60vw,34rem)] lg:w-[30vw]">
          {/* A mill label, hanging off the cloth by a thread */}
          <div data-tag data-intro className="absolute top-[18%] -right-[8.5rem] hidden origin-top-left -rotate-6 lg:block">
            <span className="absolute top-3 -left-6 h-px w-7 bg-brass/70" />
            <div className="mono relative w-32 rounded-[3px] bg-ivory px-3 pt-5 pb-3 text-[0.625rem] leading-[1.45] text-charcoal uppercase shadow-[0_18px_30px_-14px_rgb(0_0_0/0.7)]">
              <span className="absolute top-2 left-1/2 size-2 -translate-x-1/2 rounded-full bg-charcoal ring-2 ring-brass/60" />
              <span className="block font-medium">Bombay Craft</span>
              <span className="mt-1 block border-t border-charcoal/20 pt-1">Pattern no. 001</span>
              <span className="block">Ikat · 3/1 twill</span>
              <span className="block text-oxblood">Woven in code</span>
              <span className="block text-charcoal/60">Mumbai, IN</span>
            </div>
          </div>
        </div>

        <p data-line="2" data-intro aria-hidden="true" className="display text-right text-mega">
          Thoughtfully <span className="accent text-brass">crafted.</span>
        </p>

        <div className="mt-[3vh] grid items-end gap-5 md:grid-cols-[1fr_auto_1fr]">
          <p data-fade data-intro className="max-w-[36ch] text-ivory/75">
            We design and build websites, digital products and business systems that help organisations work smarter and grow.
          </p>
          <p data-fade data-intro className="label hidden text-center text-mute md:block">
            Move across the threads
          </p>
          <div data-fade data-intro className="pointer-events-auto flex flex-wrap items-center gap-3 md:justify-end">
            <a
              href="#contact"
              onClick={(e) => jump(e, 'contact')}
              className="group inline-flex items-center gap-3 rounded-full bg-ivory py-2 pr-2 pl-5 font-medium text-charcoal transition-colors duration-300 hover:bg-brass"
            >
              Start a project
              <span className="grid size-9 place-items-center rounded-full bg-oxblood text-ivory transition-transform duration-500 ease-(--ease-lens) group-hover:rotate-45">
                <ArrowUpRight weight="bold" />
              </span>
            </a>
            <a href="#craft" onClick={(e) => jump(e, 'craft')} className="inline-flex items-center gap-2 px-3 py-2 text-ivory/80 transition-colors hover:text-ivory">
              What we craft <ArrowDown />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
