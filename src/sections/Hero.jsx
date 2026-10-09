import { useRef } from 'react'
import { VISION } from '../lib/content'
import { useHeroMotion } from '../animations/sections/hero'

// Hero: "Widen". The DOM wordmark sits inside the 3D subject frame and holds
// still while the camera performs the dolly zoom behind it (DESIGN.md §7.1).
export default function Hero() {
  const root = useRef(null)
  useHeroMotion(root)

  return (
    <section id="top" ref={root} aria-labelledby="hero-title" className="relative">
      <div data-hero-stage className="stage relative overflow-hidden">
        <h1 id="hero-title" className="absolute inset-0 grid place-items-center">
          <span className="sr-only">FOV, a studio for 3D websites, motion and video</span>
          <span aria-hidden="true" translate="no" data-wordmark className="wordmark text-center text-paper">
            <span data-char>F</span>
            <span data-char>O</span>
            <span data-char>V</span>
          </span>
        </h1>

        <p
          data-vision
          className="headline absolute right-(--margin) bottom-[calc(clamp(18px,3.6svh,44px)+2.25rem)] left-(--margin) max-w-[30ch] text-lead text-paper lg:right-auto lg:bottom-[clamp(18px,3.6svh,44px)]"
        >
          {VISION}
        </p>
      </div>
    </section>
  )
}
