import { useEffect, useRef } from 'react'
import { ArrowRight, X } from '@phosphor-icons/react'
import { PROJECTS } from '../lib/content'
import { setState, useStore } from '../lib/store'
import { startScroll, stopScroll } from '../animations/smoothScroll'
import { useProjectOverlayMotion } from '../animations/overlays'
import PlaceholderMedia from './PlaceholderMedia'

const HASH = /^#work\/([\w-]+)$/

/** Project view. Linkable via #work/<id>; Esc, Close and Back all close it. */
export default function ProjectOverlay() {
  const dialogRef = useRef(null)
  const id = useStore((s) => s.project)
  const project = PROJECTS.find((p) => p.id === id)
  const index = PROJECTS.findIndex((p) => p.id === id)
  const next = PROJECTS[(index + 1) % PROJECTS.length]
  const { animateOpen, animateClose } = useProjectOverlayMotion(dialogRef)

  // Deep links: open from the hash on load, and follow back/forward.
  useEffect(() => {
    const sync = () => {
      const match = window.location.hash.match(HASH)
      setState({ project: match && PROJECTS.some((p) => p.id === match[1]) ? match[1] : null })
    }
    sync()
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (project && !dialog.open) {
      if (!HASH.test(window.location.hash)) history.pushState({ project: project.id }, '', `#work/${project.id}`)
      dialog.showModal()
      stopScroll()
      animateOpen()
    } else if (!project && dialog.open) {
      animateClose(() => {
        dialog.close()
        startScroll()
      })
    }
  }, [project, animateOpen, animateClose])

  const close = () => {
    if (HASH.test(window.location.hash)) {
      history.replaceState(null, '', '#work')
    }
    setState({ project: null })
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="project-title"
      data-lenis-prevent
      onCancel={(e) => {
        e.preventDefault()
        close()
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain bg-ink p-0 text-paper backdrop:bg-transparent"
    >
      {project && (
        <article className="min-h-full">
          <div className="frame flex h-(--nav-h) items-center justify-between">
            <p className="mono-label text-smoke">
              {project.discipline} · {project.year}
            </p>
            <button
              type="button"
              onClick={close}
              className="-mr-2 inline-flex h-10 items-center gap-2 px-2 text-[0.9375rem] font-medium"
              data-focus
              autoFocus
            >
              Close <X aria-hidden="true" size={16} weight="bold" />
            </button>
          </div>

          <div data-overlay-media className="frame">
            {project.image ? (
              <img
                src={project.image}
                alt=""
                className="max-h-[72svh] w-full object-cover"
                style={{ aspectRatio: `${project.ratio[0]} / ${project.ratio[1]}` }}
              />
            ) : (
              <PlaceholderMedia ratio={project.ratio} className="mx-auto max-h-[72svh] max-w-full" />
            )}
          </div>

          <div className="frame grid-frame gap-y-8 py-[clamp(2.5rem,6vw,6rem)]">
            <h2
              id="project-title"
              data-overlay-reveal
              className="headline col-span-full text-h2 lg:col-span-6"
            >
              {/* PLACEHOLDER */}
              {project.title}
            </h2>
            <div data-overlay-reveal className="col-span-full lg:col-span-5 lg:col-start-8">
              <p className="headline text-lead">{project.summary}</p>
              <ul className="mono-label mt-6 flex flex-wrap gap-x-5 gap-y-1 text-smoke">
                {project.roles.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              {/* PLACEHOLDER */}
              <p className="mt-6 text-smoke">Full case study coming soon.</p>
              <button
                type="button"
                onClick={() => {
                  history.replaceState({ project: next.id }, '', `#work/${next.id}`)
                  setState({ project: next.id })
                }}
                className="group mt-10 inline-flex items-center gap-3 border-b border-paper pb-1 text-[0.9375rem] font-medium"
                data-focus
              >
                Next project: {next.title}
                <ArrowRight
                  aria-hidden="true"
                  size={16}
                  weight="bold"
                  className="motion-travel transition-transform duration-500 ease-lens group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>
        </article>
      )}
    </dialog>
  )
}
