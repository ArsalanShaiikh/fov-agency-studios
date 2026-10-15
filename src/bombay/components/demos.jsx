// Tiny looping scenes of the agency's work, used as "images" in the hero
// mosaic and on project cards. Each fills its parent (position it relative).
// Loops pause off screen: App observes every [data-demo].
import { Cursor, Heart, MagnifyingGlass, Play } from '@phosphor-icons/react'
import { Logo } from './ui'

const loop = (name, duration, delay = '0s') => ({ animation: `${name} ${duration} var(--ease-lens) ${delay} infinite` })

export function FilmDemo({ caption = 'Brand film' }) {
  return (
    <div data-demo className="absolute inset-0 overflow-hidden bg-night">
      {/* A sunset sky, slowly breathing */}
      <div
        className="absolute -inset-[20%] bg-[radial-gradient(circle_at_35%_95%,var(--color-cream),var(--color-sand)_14%,#b4554f_30%,var(--color-maroon)_50%,#3d0a10_72%,var(--color-night))]"
        style={{ animation: 'drift 12s ease-in-out infinite alternate' }}
      />
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-[linear-gradient(transparent,rgb(11_9_8/0.85))]" />
      <span className="absolute top-4 right-4 hidden items-center gap-1.5 rounded-full bg-night/50 sm:flex px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wider text-cream backdrop-blur">
        <span className="size-1.5 rounded-full bg-[#ff3b30]" style={{ animation: 'blink 1.2s steps(1) infinite' }} /> REC
      </span>
      <span className="absolute top-1/2 left-1/2 grid size-14 -translate-1/2 place-items-center rounded-full bg-cream/90 text-night">
        <Play weight="fill" size={20} />
      </span>
      <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 text-[0.6875rem] text-cream/80 tabular-nums">
        <span>{caption}</span>
        <span className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-cream/20">
          <span className="absolute inset-0 origin-left bg-cream" style={{ animation: 'progress 9s linear infinite' }} />
        </span>
        <span>0:30</span>
      </div>
    </div>
  )
}

export function BrandDemo() {
  return (
    <div data-demo className="absolute inset-0 overflow-hidden bg-maroon text-cream">
      <div className="absolute -right-[25%] -bottom-[40%] aspect-square w-[90%] rounded-full border-[1.5rem] border-cream/15" style={{ animation: 'spin-slow 40s linear infinite' }} />
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        <span className="text-[0.6875rem] font-semibold tracking-wider text-night uppercase">Identity system</span>
        <Logo className="w-[min(70%,18rem)]" label="" />
        <div className="flex gap-2">
          {['#790d16', '#e5d3af', '#f5efe1', '#aec4d4'].map((c) => (
            <span key={c} className="size-6 rounded-full ring-1 ring-cream/40" style={{ background: c }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function ReelDemo() {
  return (
    <div data-demo className="absolute inset-0 flex items-center justify-center overflow-hidden bg-sky">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,var(--color-sand),transparent_60%)]" />
      <div className="relative aspect-[9/16] h-[78%] overflow-hidden rounded-[1.25rem] border-4 border-night bg-[linear-gradient(160deg,#a8323b,var(--color-maroon)_75%)] shadow-2xl">
        <div className="absolute inset-x-3 bottom-3 grid gap-1.5">
          <span className="h-1.5 w-3/4 rounded-full bg-cream/85" />
          <span className="h-1.5 w-1/2 rounded-full bg-cream/55" />
        </div>
        <div className="absolute right-2 bottom-10 flex flex-col items-center text-cream">
          <Heart weight="fill" size={18} />
          <span className="text-[0.5625rem] font-semibold">12.4k</span>
        </div>
        {[0, 1, 2, 3].map((i) => (
          <Heart
            key={i}
            weight="fill"
            className="absolute right-2.5 bottom-14 size-3.5 text-cream"
            style={{ animation: `float-up 3.2s ease-out ${i * 0.8}s infinite`, marginRight: `${(i % 2) * 8}px` }}
          />
        ))}
      </div>
    </div>
  )
}

export function WebDemo({ tone = 'sand', title = 'Your brand, live.' }) {
  const bg = { sand: 'bg-sand', plum: 'bg-[linear-gradient(140deg,var(--color-maroon),#3d0a10)]', cream: 'bg-cream' }[tone]
  return (
    <div data-demo className={`absolute inset-0 overflow-hidden ${bg}`}>
      <div className="absolute inset-[8%] overflow-hidden rounded-xl bg-night shadow-2xl">
        <div className="flex items-center gap-1.5 border-b border-cream/10 px-3 py-2.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-2 rounded-full bg-cream/20" />
          ))}
          <span className="ml-3 h-3.5 flex-1 rounded-full bg-cream/5" />
        </div>
        <div className="grid gap-3 p-4">
          <div className="flex h-16 origin-left items-end rounded-lg bg-[image:var(--sunset)] p-3 md:h-24 lg:h-[34%]" style={loop('build-in', '7s')}>
            <span className="text-[clamp(0.875rem,0.5rem+1.4vw,2.5rem)] leading-none font-semibold tracking-tight text-night">{title}</span>
          </div>
          <div className="h-2.5 w-2/3 origin-left rounded-full bg-cream/30" style={loop('build-in', '7s', '0.3s')} />
          <div className="h-2.5 w-1/2 origin-left rounded-full bg-cream/15" style={loop('build-in', '7s', '0.45s')} />
          <div className="mt-1 grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="aspect-[4/3] rounded-lg bg-night-3 ring-1 ring-cream/10" style={i === 1 ? loop('lift', '7s') : undefined} />
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0" style={{ animation: 'cursor-path 7s ease-in-out infinite' }}>
          <Cursor weight="fill" className="size-5 text-cream drop-shadow" />
        </div>
      </div>
    </div>
  )
}

export function SeoDemo() {
  const row = 'absolute inset-x-0 top-0 flex h-1/3 items-center gap-2 bg-night px-3'
  return (
    <div data-demo className="absolute inset-0 flex flex-col justify-center gap-3 overflow-hidden bg-sand p-[8%]">
      <div className="flex items-center gap-2 rounded-full bg-night px-3 py-2 text-[0.75rem] text-cream/80">
        <MagnifyingGlass /> creative agency near me
      </div>
      <div className="relative h-28 overflow-hidden rounded-xl bg-night">
        <div className={row} style={loop('rank-1', '7s')}>
          <span className="h-2 w-1/2 rounded-full bg-cream/15" />
        </div>
        <div className={row} style={loop('rank-2', '7s')}>
          <span className="h-2 w-2/5 rounded-full bg-cream/10" />
        </div>
        <div className={`${row} z-10 bg-night-2!`} style={loop('rank-ours', '7s')}>
          <span className="grid size-5 place-items-center rounded-full bg-[image:var(--sunset)] text-[0.625rem] font-bold text-night">1</span>
          <span className="text-[0.75rem] font-medium text-cream">yourbrand.com</span>
        </div>
      </div>
      <svg viewBox="0 0 200 60" className="h-12 w-full rounded-lg bg-night p-2" aria-hidden="true">
        <defs>
          <linearGradient id="seo-line" x1="0" x2="1">
            <stop offset="0" stopColor="#e5d3af" />
            <stop offset="1" stopColor="#aec4d4" />
          </linearGradient>
        </defs>
        <path
          d="M0 55 C30 52 45 48 70 40 S110 34 130 22 S175 8 200 4"
          fill="none"
          stroke="url(#seo-line)"
          strokeWidth="2.5"
          strokeLinecap="round"
          pathLength="1"
          strokeDasharray="1"
          style={{ animation: 'draw 7s var(--ease-lens) infinite' }}
        />
      </svg>
    </div>
  )
}

export function CrmDemo() {
  const cols = ['New', 'Contacted', 'Won']
  return (
    <div data-demo className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_85%_100%,rgb(121_13_22/0.7),transparent_55%),radial-gradient(circle_at_20%_120%,rgb(174_196_212/0.3),transparent_50%)] bg-night p-[7%]">
      <div className="grid grid-cols-3 text-[0.625rem] font-medium tracking-wider text-cream/55 uppercase">
        {cols.map((c) => (
          <span key={c} className="px-1.5 pb-2">
            {c}
          </span>
        ))}
      </div>
      <div className="relative grid h-[calc(100%-1.5rem)] grid-cols-3">
        {cols.map((c, i) => (
          <div key={c} className="px-1.5">
            <div
              className="h-full rounded-lg p-1.5 ring-1 ring-cream/10"
              style={i === 2 ? { animation: 'won-glow 6s var(--ease-lens) infinite' } : { background: 'rgb(245 239 232 / 0.03)' }}
            >
              {Array.from({ length: i === 2 ? 1 : 2 }, (_, k) => (
                <div key={k} className="mb-1.5 h-7 rounded-md bg-cream/6" style={{ marginTop: k === 0 ? 36 : 0 }} />
              ))}
            </div>
          </div>
        ))}
        <div className="absolute top-1.5 left-0 w-1/3 px-3" style={loop('lead-move', '6s')}>
          <div className="flex h-7 items-center gap-1.5 rounded-md bg-cream px-2 text-[0.625rem] font-semibold text-night">
            <span className="size-3.5 rounded-full bg-[image:var(--sunset)]" />
            New lead
          </div>
        </div>
      </div>
    </div>
  )
}
