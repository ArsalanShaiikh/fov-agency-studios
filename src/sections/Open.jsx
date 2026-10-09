import { useId, useRef } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import { OPEN } from '../lib/content'
import { focalFromFov } from '../lib/cameraMath'
import { setState, useStore } from '../lib/store'
import { useOpenMotion } from '../animations/sections/open'

const [DOLLY, FOCUS, CODE, NOTES] = OPEN.tiles

function TileLink({ tile, tone = 'paper' }) {
  const external = tile.href.startsWith('http')
  return (
    <a
      href={tile.href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className={`group mt-6 inline-flex items-center gap-2 border-b pb-1 text-[0.9375rem] font-medium ${
        tone === 'ink' ? 'border-ink' : 'border-paper'
      }`}
      data-focus
    >
      {tile.cta}
      <ArrowUpRight
        aria-hidden="true"
        size={16}
        weight="bold"
        className="transition-transform duration-500 ease-lens group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-travel"
      />
      {external && <span className="sr-only">(opens in a new tab)</span>}
    </a>
  )
}

function TileMeta({ children, tone = 'smoke' }) {
  return <p className={`mono-label ${tone === 'ink' ? 'text-signal-soft' : 'text-smoke'}`}>{children}</p>
}

/** CSS stand-in for the live demo until (or if) WebGL takes over the window. */
function DollyWindowFallback({ fov, demo = false }) {
  const t = (fov - 8) / 70
  return (
    <div aria-hidden="true" className="absolute inset-0" {...(demo ? { 'data-dolly-fallback': '' } : {})}>
      {[1.5, 1.2, 1, 0.82, 0.64, 0.5, 0.4, 0.31].map((s, i) => {
        const depth = s < 1 ? (1 - s) * (0.6 + t * 2.4) : (s - 1) * (1 + t * 3)
        const scale = s < 1 ? Math.max(0.04, 1 - depth) : 1 + depth
        return (
          <div
            key={s}
            className="absolute top-1/2 left-1/2 border"
            style={{
              width: '46%',
              height: '46%',
              translate: '-50% -50%',
              scale: `${scale}`,
              borderColor: s === 1 ? 'var(--color-signal)' : `rgb(233 232 228 / ${0.18 + (i % 4) * 0.08})`,
            }}
          />
        )
      })}
    </div>
  )
}

export default function Open() {
  const root = useRef(null)
  const sliderId = useId()
  const fov = useStore((s) => s.demoFov)
  useOpenMotion(root)

  return (
    <section id="open" ref={root} aria-labelledby="open-title" className="relative section-pad">
      <div className="frame">
        <h2 id="open-title" data-reveal className="headline text-h2">
          {OPEN.title}
        </h2>
        <p data-reveal className="headline mt-6 max-w-[44ch] text-lead text-paper">
          {OPEN.intro}
        </p>
      </div>

      <div className="frame mt-[clamp(3rem,6vw,6rem)] grid gap-(--gutter) lg:grid-cols-12">
        {/* A. Live breakdown of our own dolly zoom */}
        <article data-tile data-dolly-tile className="flex flex-col bg-ink-2 p-[clamp(1.25rem,2vw,2.5rem)] lg:col-span-7">
          <TileMeta>{DOLLY.kind}</TileMeta>
          <div
            data-dolly-view
            className="relative mt-5 aspect-16/10 w-full overflow-hidden bg-ink"
          >
            <DollyWindowFallback fov={fov} demo />
            <span
              aria-hidden="true"
              className="display pointer-events-none absolute inset-0 grid place-items-center text-[clamp(1.25rem,3.4vw,3.25rem)] leading-none text-paper"
            >
              FOV
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <label htmlFor={sliderId} className="mono-label flex justify-between text-paper">
              <span>Lens angle</span>
              <output htmlFor={sliderId} className="text-signal">
                {fov.toFixed(1)}° · {Math.round(focalFromFov(fov))}MM
              </output>
            </label>
            <input
              id={sliderId}
              type="range"
              min="8"
              max="78"
              step="0.5"
              value={fov}
              onChange={(e) => setState({ demoFov: Number(e.target.value) })}
              className="lens-range"
              data-focus
            />
          </div>

          <h3 className="headline mt-8 text-[clamp(1.5rem,1rem+1.4vw,2.75rem)] leading-tight">{DOLLY.title}</h3>
          <p className="mt-3 max-w-[48ch] text-smoke">{DOLLY.body}</p>
          <p className="mono-label mt-5 text-paper normal-case">d = h / (2 · k · tan(θ / 2))</p>
          <div className="mt-auto">
            {/* PLACEHOLDER */}
            <TileLink tile={DOLLY} />
          </div>
        </article>

        {/* Mobile: B, C, D sit in a horizontal snap rail. Desktop: bento. */}
        <div className="rail -mx-(--margin) flex gap-(--gutter) overflow-x-auto px-(--margin) lg:col-span-5 lg:mx-0 lg:grid lg:overflow-visible lg:px-0">
          {/* B. Experiment: rack focus on hover */}
          <article
            data-tile
            tabIndex={0}
            aria-label={`${FOCUS.kind}: ${FOCUS.title}`}
            className="group flex w-[82vw] shrink-0 flex-col bg-ink-2 p-[clamp(1.25rem,2vw,2.5rem)] focus-visible:outline-2 sm:w-[60vw] lg:w-auto"
          >
            <TileMeta>{FOCUS.kind}</TileMeta>
            <p
              aria-hidden="true"
              className="display mt-6 text-[clamp(2.5rem,1.5rem+3vw,5.5rem)] leading-none text-paper blur-[10px] transition-[filter,color] duration-700 ease-focus group-hover:text-signal group-hover:blur-none group-focus-visible:text-signal group-focus-visible:blur-none"
            >
              Focus
            </p>
            <h3 className="headline mt-8 text-[clamp(1.25rem,1rem+0.8vw,1.875rem)] leading-tight">{FOCUS.title}</h3>
            <p className="mt-3 text-smoke">{FOCUS.body}</p>
            <div className="mt-auto">
              {/* PLACEHOLDER */}
              <TileLink tile={FOCUS} />
            </div>
          </article>

          {/* C. Open code (the one signal tile) */}
          <article
            data-tile
            className="flex w-[82vw] shrink-0 flex-col bg-signal p-[clamp(1.25rem,2vw,2.5rem)] text-ink sm:w-[60vw] lg:w-auto"
          >
            <TileMeta tone="ink">{CODE.kind}</TileMeta>
            <pre className="mono-label mt-6 break-all whitespace-pre-wrap text-ink normal-case">
              {`const d = h / (2 * k * Math.tan(fov / 2))\ncamera.fov = fov\ncamera.position.z = d`}
            </pre>
            <h3 className="headline mt-8 text-[clamp(1.25rem,1rem+0.8vw,1.875rem)] leading-tight">{CODE.title}</h3>
            <p className="mt-3 text-signal-soft">{CODE.body}</p>
            <div className="mt-auto">
              {/* PLACEHOLDER */}
              <TileLink tile={CODE} tone="ink" />
            </div>
          </article>
        </div>

        {/* D. Notes: wide strip */}
        <article
          data-tile
          className="grid gap-6 bg-ink-2 p-[clamp(1.25rem,2vw,2.5rem)] md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-end lg:col-span-12"
        >
          <div className="relative aspect-4/3 overflow-hidden bg-ink md:aspect-21/9">
            <DollyWindowFallback fov={64} />
            {/* PLACEHOLDER */}
            <span className="mono-label absolute bottom-3 left-3 text-smoke">Image to come</span>
          </div>
          <div className="flex flex-col">
            <TileMeta>{NOTES.kind}</TileMeta>
            <h3 className="headline mt-4 text-[clamp(1.5rem,1rem+1.4vw,2.75rem)] leading-tight">{NOTES.title}</h3>
            <p className="mt-3 max-w-[44ch] text-smoke">{NOTES.body}</p>
            <div>
              {/* PLACEHOLDER */}
              <TileLink tile={NOTES} />
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
