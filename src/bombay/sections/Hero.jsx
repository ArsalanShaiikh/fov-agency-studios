import { useEffect, useRef } from 'react'
import { gsap, MQ, SplitText, useGSAP } from '../../animations/gsap'
import { scrollToTarget } from '../../animations/smoothScroll'
import { detectWebGL } from '../lib/webgl'
import { onReady } from '../lib/ready'
import { PhotoTile, VideoTile } from '../components/media'
import { Logo } from '../components/ui'

// What each 3D object stands for (toolkit order: cursor, play, heart,
// magnifier, linked rings, gem) and the service it opens (lib/content ids).
const OBJECTS = [
  { label: 'Website design & development', id: 'websites' },
  { label: 'Video, photography & production', id: 'production' },
  { label: 'Digital marketing', id: 'marketing' },
  { label: 'UI/UX & product design', id: 'product' },
  { label: 'CRM & business automation', id: 'crm' },
  { label: 'Branding & digital identity', id: 'branding' },
]
const LABELS = OBJECTS.map((o) => o.label)

/** One cell of the grid: a plain rounded rectangle or square. Grid placement comes from `className`. */
function Shape({ className = '', children }) {
  return (
    <div data-tile data-intro className={`relative overflow-hidden rounded-(--r) ${className}`}>
      {children}
    </div>
  )
}

/** A solid maroon brand tile with the mark in cream. */
const BrandTile = () => (
  <div className="absolute inset-0 grid place-items-center bg-maroon p-[12%]">
    <Logo label="" className="w-full text-cream" />
  </div>
)

export default function Hero() {
  const root = useRef(null)
  const canvas = useRef(null)
  const tip = useRef(null)

  // The toolkit (three.js) arrives in its own chunk after first paint.
  useEffect(() => {
    if (!detectWebGL()) return
    let stop
    let cancelled = false
    const onHover = (label, pos) => {
      const el = tip.current
      if (!el) return
      el.dataset.show = label ? 'true' : 'false'
      if (!label) return
      el.querySelector('[data-label]').textContent = label
      el.style.transform = `translate(${pos.x + 18}px, ${pos.y + 18}px)`
    }
    const onPick = (index) => {
      const { id } = OBJECTS[index]
      window.dispatchEvent(new CustomEvent('bc:service', { detail: id }))
      requestAnimationFrame(() => scrollToTarget(`#svc-${id}`, { offset: -160 }))
    }
    import('../lib/toolkit').then(({ startToolkit }) => {
      if (cancelled) return
      stop = startToolkit(canvas.current, {
        reduceMotion: window.matchMedia(MQ.reduce).matches,
        labels: LABELS,
        onHover,
        onPick,
        fit: 'tile',
      })
    })
    return () => {
      cancelled = true
      stop?.()
    }
  }, [])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      const intro = root.current.querySelectorAll('[data-intro]')
      mm.add(MQ.motion, () => {
        // Hidden until the preloader lifts, then the intro plays.
        gsap.set(intro, { opacity: 1 })
        const split = SplitText.create('[data-word]', { type: 'chars', mask: 'chars', aria: 'hidden' })
        const tl = gsap.timeline({ defaults: { ease: 'lens' }, paused: true })
        tl.from('[data-stage]', { clipPath: 'inset(22% 22% 22% 22% round 2rem)', scale: 1.06, duration: 1.6 })
        tl.from('[data-tile]', { scale: 0.6, opacity: 0, duration: 1.2, stagger: { each: 0.06, from: 'center' } }, 0.15)
        tl.from(split.chars, { yPercent: 110, duration: 1.2, stagger: 0.035 }, 0.5)
        tl.from('[data-fade]', { opacity: 0, y: 10, duration: 0.9 }, 1)
        onReady(() => tl.play())

        gsap.to('[data-wordmark]', {
          yPercent: 40,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
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
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-night [--hh:max(40rem,min(100svh,72rem))] [--r:clamp(0.625rem,0.4rem+0.6vw,1rem)]"
    >
      <div className="grid h-(--hh) grid-rows-[minmax(0,1fr)_auto] gap-2 p-2 lg:grid-cols-[1fr_1fr_calc((var(--hh)-1rem)*9/16)_1fr_1fr] lg:grid-rows-[1.2fr_0.8fr_1fr]">
        {/* Left grid (desktop) */}
        <Shape className="hidden lg:col-start-1 lg:row-start-1 lg:block">
          <PhotoTile name="archwayNight" />
        </Shape>
        <Shape className="hidden lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:block">
          <VideoTile name="heritageStreet" />
        </Shape>
        <Shape className="hidden lg:col-start-1 lg:row-start-2 lg:block">
          <PhotoTile name="artStudioNight" />
        </Shape>
        <Shape className="hidden lg:col-span-2 lg:col-start-1 lg:row-start-3 lg:block">
          <VideoTile name="crossing" />
        </Shape>

        {/* The stage: Marine Drive at sunset, with the toolkit floating over it. */}
        <div data-stage data-intro className="relative overflow-hidden rounded-[clamp(0.75rem,0.5rem+0.8vw,1.25rem)] bg-night-2 lg:col-start-3 lg:row-span-3 lg:row-start-1">
          <VideoTile name="sunset" />
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgb(11_9_8/0.05),rgb(11_9_8/0.45))]" />
          <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 size-full touch-pan-y" />
          <p data-fade data-intro className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 rounded-full bg-night/45 px-3 py-1.5 text-[0.6875rem] whitespace-nowrap text-cream/85 backdrop-blur-md lg:top-auto lg:bottom-4">
            Hover the toolkit · each object is a service
          </p>
        </div>

        {/* Right grid (desktop) */}
        <Shape className="hidden lg:col-start-4 lg:row-span-2 lg:row-start-1 lg:block">
          <VideoTile name="trees" />
        </Shape>
        <Shape className="hidden lg:col-start-5 lg:row-start-1 lg:block">
          <PhotoTile name="nightTraffic" />
        </Shape>
        <Shape className="hidden lg:col-start-5 lg:row-start-2 lg:block">
          <PhotoTile name="redHouse" />
        </Shape>
        <Shape className="hidden lg:col-start-4 lg:row-start-3 lg:block">
          <PhotoTile name="storefront" />
        </Shape>
        <Shape className="hidden lg:col-start-5 lg:row-start-3 lg:block">
          <BrandTile />
        </Shape>

        {/* Phones and tablets: one still row of tiles under the stage */}
        <div aria-hidden="true" className="grid h-[clamp(9rem,22svh,15rem)] grid-cols-3 gap-2 md:grid-cols-5 lg:hidden">
          <Shape>
            <PhotoTile name="archwayNight" />
          </Shape>
          <Shape>
            <VideoTile name="heritageStreet" />
          </Shape>
          <Shape>
            <PhotoTile name="nightTraffic" />
          </Shape>
          <Shape className="hidden md:block">
            <PhotoTile name="redHouse" />
          </Shape>
          <Shape className="hidden md:block">
            <PhotoTile name="storefront" />
          </Shape>
        </div>
      </div>

      {/* Soft shades keep the nav and wordmark readable over any frame. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(rgb(11_9_8/0.6),transparent)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[40%] bg-[linear-gradient(transparent,rgb(11_9_8/0.7))] lg:block" />

      <div
        data-wordmark
        className="pointer-events-none absolute inset-x-0 bottom-[calc(clamp(9rem,22svh,15rem)+1.5rem)] z-10 px-4 text-cream md:px-6 lg:bottom-0 lg:pb-3"
      >
        <h1
          id="hero-title"
          aria-label="Bombay Craft"
          className="display flex flex-col text-[23vw] leading-[0.82] whitespace-nowrap drop-shadow-[0_4px_30px_rgb(0_0_0/0.4)] md:text-[15vw] lg:flex-row lg:justify-between lg:text-[min(8.6vw,16svh)]"
        >
          <span data-word data-intro className="block">
            Bombay
          </span>
          <span data-word data-intro className="block">
            Craft
          </span>
        </h1>
      </div>

      {/* Hover label that follows the pointer */}
      <div
        ref={tip}
        data-show="false"
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-40 flex items-center gap-2 rounded-full bg-cream py-1.5 pr-3 pl-1.5 text-small font-medium text-night opacity-0 shadow-lg transition-opacity duration-200 data-[show=true]:opacity-100"
      >
        <span className="size-5 rounded-full bg-[image:var(--sunset)]" />
        <span data-label />
        <span className="text-night/50">· explore</span>
      </div>
    </section>
  )
}
