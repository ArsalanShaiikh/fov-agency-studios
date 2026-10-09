import { useRef } from 'react'
import { NAV, CTA_LABEL } from '../lib/content'
import { setState, useStore } from '../lib/store'
import { scrollToTarget } from '../animations/smoothScroll'
import { useMagnetic } from '../hooks/useMagnetic'

function onAnchor(e, href) {
  if (!href.startsWith('#')) return
  e.preventDefault()
  scrollToTarget(href === '#top' ? 0 : href)
  const target = href === '#top' ? document.querySelector('#main') : document.querySelector(href)
  target?.focus?.({ preventScroll: true })
}

export default function Nav() {
  const ctaRef = useRef(null)
  const menuOpen = useStore((s) => s.menuOpen)
  const scrolled = useStore((s) => s.loaded && !s.inHero)
  const signal = useStore((s) => s.endcard)
  useMagnetic(ctaRef, 6)

  return (
    <header
      data-nav
      data-nav-theme={signal ? 'signal' : 'ink'}
      className="fixed inset-x-0 top-0 z-(--z-nav) text-(--nav-fg) transition-colors duration-500"
    >
      {/* Scrim so copy scrolling underneath never collides with the nav. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[calc(var(--nav-h)+2rem)] bg-linear-to-b from-(--nav-scrim) from-40% to-transparent transition-opacity duration-500"
        style={{ opacity: scrolled ? 1 : 0 }}
      />
      <nav aria-label="Primary" className="frame relative flex h-(--nav-h) items-center justify-between">
        <a
          href="#top"
          onClick={(e) => onAnchor(e, '#top')}
          className="display -my-2 py-2 text-[1.125rem] leading-none"
          aria-label="FOV, back to top"
          translate="no"
          data-focus
        >
          FOV
        </a>

        <div className="flex items-center gap-5 lg:gap-8">
          <ul className="hidden items-center gap-7 lg:flex">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(e) => onAnchor(e, item.href)}
                  className="group relative py-2 text-[0.9375rem] font-medium"
                  data-focus
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-1 h-px origin-right scale-x-0 bg-current transition-transform duration-500 ease-lens group-hover:origin-left group-hover:scale-x-100"
                  />
                </a>
              </li>
            ))}
          </ul>

          <a
            ref={ctaRef}
            href="#contact"
            onClick={(e) => onAnchor(e, '#contact')}
            className="hidden h-10 items-center border border-current px-4 text-[0.9375rem] font-medium transition-colors duration-300 hover:border-(--nav-bg-hover) hover:bg-(--nav-bg-hover) hover:text-(--nav-fg-hover) active:translate-y-px sm:inline-flex"
            data-focus
          >
            {CTA_LABEL}
          </a>

          <button
            type="button"
            className="-mr-2 h-10 px-2 text-[0.9375rem] font-medium lg:hidden"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls="menu"
            onClick={() => setState({ menuOpen: true })}
            data-focus
          >
            Menu
          </button>
        </div>
      </nav>
    </header>
  )
}
