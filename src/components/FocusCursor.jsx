import { useRef } from 'react'
import { useGSAP, gsap } from '../animations/gsap'
import { useFinePointer, useReducedMotion } from '../hooks/useMediaQuery'
import { useStore } from '../lib/store'

const ARM = 9
const PAD = 7
const IDLE = 18

/**
 * Autofocus box: four corner brackets that trail the pointer and lock onto
 * anything marked [data-focus] (links, buttons, cards). Keyboard focus moves
 * the same box. The native cursor stays visible. Fine pointers only.
 */
export default function FocusCursor() {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  if (!fine || reduce) return null
  return <Box />
}

function Box() {
  const root = useRef(null)
  const signal = useStore((s) => s.endcard)

  useGSAP(
    () => {
      const corners = [...root.current.querySelectorAll('[data-corner]')]
      const to = corners.map((c) => ({
        x: gsap.quickTo(c, 'x', { duration: 0.5, ease: 'lens' }),
        y: gsap.quickTo(c, 'y', { duration: 0.5, ease: 'lens' }),
      }))
      const pointer = { x: -100, y: -100 }
      let target = null
      let visible = false

      const show = (on) => {
        if (on === visible) return
        visible = on
        gsap.to(root.current, { opacity: on ? 1 : 0, duration: 0.3, ease: 'none' })
      }
      const flash = () =>
        gsap.fromTo(corners, { borderColor: '#e9c440' }, { borderColor: 'currentColor', duration: 0.5, delay: 0.14, ease: 'none' })

      const update = () => {
        let x, y, w, h
        if (target?.isConnected) {
          const r = target.getBoundingClientRect()
          x = r.left - PAD
          y = r.top - PAD
          w = r.width + PAD * 2
          h = r.height + PAD * 2
        } else {
          x = pointer.x - IDLE / 2
          y = pointer.y - IDLE / 2
          w = h = IDLE
        }
        const pts = [
          [x, y],
          [x + w - ARM, y],
          [x, y + h - ARM],
          [x + w - ARM, y + h - ARM],
        ]
        to.forEach((t, i) => {
          t.x(pts[i][0])
          t.y(pts[i][1])
        })
      }

      const setTarget = (el) => {
        if (el === target) return
        target = el
        if (el) flash()
      }
      const onMove = (e) => {
        pointer.x = e.clientX
        pointer.y = e.clientY
        show(true)
      }
      const onOver = (e) => setTarget(e.target.closest?.('[data-focus]') ?? null)
      const onFocusIn = (e) => {
        if (!e.target.matches?.(':focus-visible')) return
        setTarget(e.target.closest('[data-focus]') ?? e.target)
        show(true)
      }
      const onFocusOut = () => setTarget(null)
      const onLeave = () => show(false)

      window.addEventListener('pointermove', onMove, { passive: true })
      document.addEventListener('pointerover', onOver, { passive: true })
      document.addEventListener('focusin', onFocusIn)
      document.addEventListener('focusout', onFocusOut)
      document.documentElement.addEventListener('pointerleave', onLeave)
      gsap.ticker.add(update)

      return () => {
        window.removeEventListener('pointermove', onMove)
        document.removeEventListener('pointerover', onOver)
        document.removeEventListener('focusin', onFocusIn)
        document.removeEventListener('focusout', onFocusOut)
        document.documentElement.removeEventListener('pointerleave', onLeave)
        gsap.ticker.remove(update)
      }
    },
    { scope: root },
  )

  return (
    <div
      ref={root}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-(--z-cursor) opacity-0 transition-colors duration-300 ${
        signal ? 'text-ink' : 'text-paper'
      }`}
    >
      {['border-t border-l', 'border-t border-r', 'border-b border-l', 'border-b border-r'].map((sides) => (
        <span
          key={sides}
          data-corner
          className={`absolute top-0 left-0 ${sides} border-current`}
          style={{ width: ARM, height: ARM }}
        />
      ))}
    </div>
  )
}
