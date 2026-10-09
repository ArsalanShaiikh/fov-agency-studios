import { useEffect, useRef } from 'react'
import { X } from '@phosphor-icons/react'
import { CTA_LABEL, NAV } from '../lib/content'
import { setState, useStore } from '../lib/store'
import { scrollToTarget, startScroll, stopScroll } from '../animations/smoothScroll'
import { useShutter } from '../animations/overlays'
import MumbaiClock from './MumbaiClock'

const LINKS = [...NAV, { label: CTA_LABEL, href: '#contact' }]

export default function MenuOverlay() {
  const dialogRef = useRef(null)
  const open = useStore((s) => s.menuOpen)
  const { shutterOpen, shutterClose } = useShutter(dialogRef)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      stopScroll()
      shutterOpen()
    } else if (!open && dialog.open) {
      shutterClose(() => {
        dialog.close()
        startScroll()
      })
    }
  }, [open, shutterOpen, shutterClose])

  const go = (href) => {
    setState({ menuOpen: false })
    window.setTimeout(() => scrollToTarget(href), 350)
  }

  return (
    <dialog
      id="menu"
      ref={dialogRef}
      aria-label="Menu"
      data-lenis-prevent
      onCancel={(e) => {
        e.preventDefault()
        setState({ menuOpen: false })
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overscroll-contain bg-ink p-0 text-paper backdrop:bg-transparent"
    >
      <div className="frame flex h-full flex-col">
        <div className="flex h-(--nav-h) items-center justify-between">
          <span className="display text-[1.125rem] leading-none">FOV</span>
          <button
            type="button"
            onClick={() => setState({ menuOpen: false })}
            className="-mr-2 inline-flex h-10 items-center gap-2 px-2 text-[0.9375rem] font-medium"
            autoFocus
          >
            Close <X aria-hidden="true" size={16} weight="bold" />
          </button>
        </div>

        <nav aria-label="Menu" className="flex flex-1 flex-col justify-center">
          <ul className="flex flex-col gap-3">
            {LINKS.map((item) => (
              <li key={item.href} data-menu-item className="overflow-hidden">
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    go(item.href)
                  }}
                  className={`display block text-[clamp(2rem,9vw,4rem)] leading-[1.05] ${
                    item.href === '#contact' ? 'text-signal' : ''
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <MumbaiClock className="py-6 text-smoke" />
      </div>
    </dialog>
  )
}
