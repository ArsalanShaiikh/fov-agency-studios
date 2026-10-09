import { useEffect, useRef } from 'react'
import { X } from '@phosphor-icons/react'
import { CREDITS } from '../lib/content'
import { setState, useStore } from '../lib/store'

function Group({ title, items }) {
  return (
    <div>
      <h3 className="mono-label text-smoke">{title}</h3>
      <ul className="mt-3 flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.name}>
            <a href={item.href} target="_blank" rel="noreferrer" className="font-medium underline decoration-1 underline-offset-4">
              {item.name}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <span className="text-smoke">
              {' '}
              by {item.by}. {item.license}.
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function CreditsDialog() {
  const ref = useRef(null)
  const open = useStore((s) => s.creditsOpen)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby="credits-title"
      onClose={() => setState({ creditsOpen: false })}
      className="m-auto w-[min(92vw,40rem)] bg-ink-2 p-0 text-paper backdrop:bg-ink/70"
    >
      <div className="flex flex-col gap-8 p-[clamp(1.5rem,4vw,2.5rem)]">
        <div className="flex items-start justify-between gap-6">
          <h2 id="credits-title" className="headline text-[clamp(1.5rem,1rem+1.4vw,2.25rem)]">
            Credits
          </h2>
          <button
            type="button"
            onClick={() => setState({ creditsOpen: false })}
            className="-mt-1 -mr-2 inline-flex h-10 items-center gap-2 px-2 text-[0.9375rem] font-medium"
            autoFocus
          >
            Close <X aria-hidden="true" size={16} weight="bold" />
          </button>
        </div>
        <Group title="Typefaces" items={CREDITS.fonts} />
        <Group title="3D models" items={CREDITS.models} />
        <p className="text-smoke">
          Everything else on this site, including the 3D world, the shaders and the type layout, is made in house.
        </p>
      </div>
    </dialog>
  )
}
