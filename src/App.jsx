import { useEffect } from 'react'
import { ScrollTrigger } from './animations/gsap'
import { initSmoothScroll } from './animations/smoothScroll'
import Nav from './home/Nav'
import Hero from './home/Hero'
import Craft from './home/Craft'
import PatternLab from './home/PatternLab'
import Closing from './home/Closing'
import Preloader from './home/Preloader'

// Home, phase 1: preloader + four sections (docs/BRAND.md). Further pages and
// sections wait until this direction is signed off.
export default function App() {
  useEffect(() => initSmoothScroll(), [])

  useEffect(() => {
    document.fonts.ready.then(() => ScrollTrigger.refresh())
  }, [])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-ivory focus:px-5 focus:py-3 focus:text-charcoal"
      >
        Skip to content
      </a>

      <Nav />

      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Craft />
        <PatternLab />
        <Closing />
      </main>

      <Preloader />
    </>
  )
}
