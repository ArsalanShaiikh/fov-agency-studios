import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { ArrowsClockwise, Eraser } from '@phosphor-icons/react'
import { gsap, MQ, useGSAP } from '../animations/gsap'
import { revealLines } from '../animations/reveal'
import { drawWeave } from './weave'

const ROWS = 8
const MAX_COLS = 20

// Patterns as functions of (row, column): true = punched (warp lifts).
const PRESETS = {
  Ikat: (r, c) => Math.round(Math.abs((c % 10) - 4.5) + Math.abs(r - 3.5)) % 4 < 2,
  Twill: (r, c) => (c + r) % 4 < 2,
  Checks: (r, c) => ((c >> 1) + (r >> 1)) % 2 === 0,
  Stripes: (_, c) => c % 4 < 2,
}

const WEFTS = {
  Oxblood: { base: '#790d16', shade: '#650a12' },
  Brass: { base: '#b8955c', shade: '#a6844e' },
  Charcoal: { base: '#2a2122', shade: '#221a1b' },
}

const fill = (fn) => Array.from({ length: ROWS }, (_, r) => Array.from({ length: MAX_COLS }, (_, c) => fn(r, c)))

function useWide() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia('(min-width: 48rem)')
      m.addEventListener('change', cb)
      return () => m.removeEventListener('change', cb)
    },
    () => window.matchMedia('(min-width: 48rem)').matches,
    () => true,
  )
}

/** A short, stable "pattern number" for the readout. */
function patternNo(card, cols) {
  let h = 7
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < cols; c++) if (card[r][c]) h = (h * 31 + r * 97 + c * 13) % 9973
  return String(h).padStart(4, '0')
}

export default function PatternLab() {
  const root = useRef(null)
  const canvas = useRef(null)
  const wide = useWide()
  const cols = wide ? MAX_COLS : 12
  const [card, setCard] = useState(() => fill(PRESETS.Ikat))
  const [preset, setPreset] = useState('Ikat')
  const [weft, setWeft] = useState('Oxblood')
  const [focus, setFocus] = useState({ r: 0, c: 0 })
  const paint = useRef(null) // the value a drag is punching (true) or filling (false)
  const reveal = useRef({ v: 1 })

  const redraw = useCallback(() => {
    if (canvas.current) drawWeave(canvas.current, card, cols, WEFTS[weft], { repeatX: 3, reveal: reveal.current.v })
  }, [card, cols, weft])

  // Re-weave from the top whenever the card or the thread changes.
  useEffect(() => {
    const reduce = window.matchMedia(MQ.reduce).matches
    reveal.current.v = reduce ? 1 : 0
    const tween = gsap.to(reveal.current, { v: 1, duration: reduce ? 0 : 0.7, ease: 'power2.out', onUpdate: redraw, onComplete: redraw })
    return () => tween.kill()
  }, [redraw])

  useEffect(() => {
    const ro = new ResizeObserver(redraw)
    ro.observe(canvas.current)
    return () => ro.disconnect()
  }, [redraw])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        revealLines(root.current.querySelector('h2'))
        gsap.from('[data-lab]', {
          y: 40,
          opacity: 0,
          duration: 1.1,
          ease: 'lens',
          stagger: 0.1,
          scrollTrigger: { trigger: '[data-labs]', start: 'top 80%', once: true },
        })
      })
    },
    { scope: root },
  )

  const set = (r, c, v) =>
    setCard((prev) => {
      if (prev[r][c] === v) return prev
      const next = prev.map((row) => row.slice())
      next[r][c] = v
      return next
    })

  const applyPreset = (name) => {
    setPreset(name)
    setCard(fill(PRESETS[name]))
  }

  const onKeyDown = (e) => {
    const moves = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }
    const m = moves[e.key]
    if (!m) return
    e.preventDefault()
    const r = Math.max(0, Math.min(ROWS - 1, focus.r + m[0]))
    const c = Math.max(0, Math.min(cols - 1, focus.c + m[1]))
    setFocus({ r, c })
    root.current.querySelector(`[data-hole="${r}-${c}"]`)?.focus()
  }

  const punched = useMemo(() => card.reduce((n, row) => n + row.slice(0, cols).filter(Boolean).length, 0), [card, cols])

  return (
    <section id="lab" ref={root} data-nav="dark" aria-labelledby="lab-title" className="overflow-hidden bg-charcoal section-pad">
      <div className="frame">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-(--gutter)">
          <div className="lg:col-span-5">
            <p className="label text-brass">( The pattern lab · since 1804 )</p>
            <h2 id="lab-title" className="display mt-5 text-h2">
              The first code was <span className="accent text-brass">woven.</span>
            </h2>
            <p className="mt-6 max-w-[44ch] text-lead text-ivory/80">
              In 1804, Joseph-Marie Jacquard built a loom that read punched cards: every hole told a thread to lift. The same idea
              later fed the first computers. We still work that way. Careful logic in, something beautiful out.
            </p>
            <p className="mono mt-8 text-small text-ivory/60 uppercase">Punch the card. Watch it weave.</p>

            {/* Controls */}
            <div className="mt-6 flex flex-col gap-5">
              <div>
                <p className="label text-ivory/55">Pattern</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Object.keys(PRESETS).map((name) => (
                    <button
                      key={name}
                      type="button"
                      aria-pressed={preset === name}
                      onClick={() => applyPreset(name)}
                      className={`mono rounded-full px-3.5 py-1.5 text-small ring-1 transition-colors ${
                        preset === name ? 'bg-ivory text-charcoal ring-ivory' : 'text-ivory/85 ring-ivory/25 hover:ring-ivory/60'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setPreset(null)
                      setCard(fill(() => Math.random() < 0.45))
                    }}
                    className="mono inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-small text-ivory/85 ring-1 ring-ivory/25 hover:ring-ivory/60"
                  >
                    <ArrowsClockwise /> Shuffle
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPreset(null)
                      setCard(fill(() => false))
                    }}
                    className="mono inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-small text-ivory/85 ring-1 ring-ivory/25 hover:ring-ivory/60"
                  >
                    <Eraser /> Clear
                  </button>
                </div>
              </div>
              <div>
                <p className="label text-ivory/55">Weft thread</p>
                <div className="mt-2 flex gap-2">
                  {Object.entries(WEFTS).map(([name, w]) => (
                    <button
                      key={name}
                      type="button"
                      aria-pressed={weft === name}
                      onClick={() => setWeft(name)}
                      className={`mono flex items-center gap-2 rounded-full py-1.5 pr-3.5 pl-1.5 text-small ring-1 transition-colors ${
                        weft === name ? 'text-ivory ring-ivory' : 'text-ivory/80 ring-ivory/25 hover:ring-ivory/60'
                      }`}
                    >
                      <span className="size-5 rounded-full ring-1 ring-ivory/30" style={{ background: w.base }} />
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div data-labs className="flex flex-col gap-4 lg:col-span-7">
            {/* The card */}
            <div
              data-lab
              className="rounded-[0.6rem] bg-ivory p-4 text-charcoal shadow-[0_40px_80px_-40px_rgb(0_0_0/0.9)] [clip-path:polygon(5%_0,100%_0,100%_100%,0_100%,0_14%)] md:p-5"
            >
              <div className="mono flex justify-between pl-[4%] text-[0.6875rem] text-charcoal/60 uppercase">
                <span>Bombay Craft · Jacquard card</span>
                <span>No. {patternNo(card, cols)}</span>
              </div>
              <div
                role="grid"
                aria-label="Punch card. Each hole lifts a warp thread."
                aria-describedby="lab-help"
                onKeyDown={onKeyDown}
                onPointerUp={() => (paint.current = null)}
                onPointerLeave={() => (paint.current = null)}
                className="mt-3 grid gap-y-1.5 touch-none select-none"
              >
                {card.map((row, r) => (
                  <div key={r} role="row" className="grid gap-x-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
                    {row.slice(0, cols).map((on, c) => (
                      <span key={c} role="gridcell">
                        <button
                          type="button"
                          data-hole={`${r}-${c}`}
                          tabIndex={focus.r === r && focus.c === c ? 0 : -1}
                          aria-pressed={on}
                          aria-label={`Row ${r + 1}, column ${c + 1}`}
                          onFocus={() => setFocus({ r, c })}
                          onPointerDown={(e) => {
                            e.preventDefault()
                            paint.current = !on
                            set(r, c, !on)
                          }}
                          onPointerEnter={() => paint.current !== null && set(r, c, paint.current)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              set(r, c, !on)
                            }
                          }}
                          className="mono group grid h-7 w-full place-items-center rounded-[3px] text-[0.625rem] text-charcoal/35 transition-colors hover:bg-charcoal/8 md:h-8"
                        >
                          {on ? (
                            <span className="h-[70%] w-[46%] rounded-[2px] bg-charcoal transition-transform duration-200 group-active:scale-90" />
                          ) : (
                            r + 1
                          )}
                        </button>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* What the loom weaves from it */}
            <div data-lab className="relative">
              <canvas ref={canvas} aria-hidden="true" className="block h-56 w-full rounded-[0.5rem] md:h-64" />
              <div className="mono pointer-events-none absolute inset-x-3 bottom-3 flex justify-between text-[0.6875rem] text-ivory uppercase">
                <span className="rounded-full bg-charcoal/75 px-2.5 py-1 backdrop-blur">
                  Warp {cols * 3} · Picks repeat every {ROWS}
                </span>
                <span className="rounded-full bg-charcoal/75 px-2.5 py-1 backdrop-blur">{punched} holes</span>
              </div>
            </div>
            <p id="lab-help" className="mono text-[0.6875rem] text-ivory/55 uppercase">
              Click or drag to punch. Arrow keys move, Space punches.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
