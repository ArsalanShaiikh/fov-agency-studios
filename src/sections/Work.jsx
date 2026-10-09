import { useRef } from 'react'
import { PROJECTS } from '../lib/content'
import { setState } from '../lib/store'
import PlaceholderMedia from '../components/PlaceholderMedia'
import { useWorkMotion } from '../animations/sections/work'
import { overlaySource } from '../animations/overlays'
import { media, registerMedia } from '../lib/mediaState'

// Desktop placement per project: four ratios, four positions (DESIGN.md §7.4).
const LAYOUT = [
  'md:col-span-8 lg:col-span-8 lg:col-start-1',
  'md:col-span-5 md:col-start-4 lg:col-span-4 lg:col-start-9 lg:mt-[14vw]',
  'md:col-span-5 md:col-start-1 lg:col-span-5 lg:col-start-2 lg:mt-[6vw]',
  'md:col-span-8 lg:col-span-6 lg:col-start-7 lg:self-end',
]

function openProject(id, sourceEl) {
  overlaySource.el = sourceEl ?? null
  setState({ project: id })
}

export default function Work() {
  const root = useRef(null)
  useWorkMotion(root)

  return (
    <section id="work" ref={root} aria-labelledby="work-title" className="relative section-pad">
      <div className="frame">
        <h2 id="work-title" data-reveal className="headline text-h2">
          Selected work
        </h2>
      </div>

      <ul data-work-list className="frame grid-frame mt-[clamp(3rem,6vw,7rem)] gap-y-[clamp(3.5rem,7vw,9rem)]">
        {PROJECTS.map((project, i) => (
          <li key={project.id} className={`col-span-full ${LAYOUT[i]}`} data-project={project.id}>
            <a
              href={`#work/${project.id}`}
              className="group block"
              data-focus
              onClick={(e) => {
                e.preventDefault()
                openProject(project.id, e.currentTarget.querySelector('[data-media]'))
              }}
              onPointerEnter={() => media[project.id] && (media[project.id].hover = 1)}
              onPointerLeave={() => media[project.id] && (media[project.id].hover = 0)}
              onPointerMove={(e) => {
                const m = media[project.id]
                if (!m?.el) return
                const r = m.el.getBoundingClientRect()
                m.mouseX = (e.clientX - r.left) / r.width
                m.mouseY = 1 - (e.clientY - r.top) / r.height
              }}
            >
              <div
                data-media
                ref={(el) => registerMedia(project.id, el, { ratio: project.ratio, image: project.image })}
                className="relative overflow-hidden"
              >
                {project.image ? (
                  <img
                    src={project.image}
                    alt=""
                    className="aspect-(--r) w-full object-cover"
                    style={{ '--r': `${project.ratio[0]} / ${project.ratio[1]}` }}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <PlaceholderMedia
                    ratio={project.ratio}
                    className="transition-transform duration-1000 ease-lens group-hover:scale-[1.03] motion-travel"
                  />
                )}
              </div>

              <div className="mt-5 grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1">
                <h3 className="headline text-[clamp(1.375rem,1rem+1vw,2.25rem)] leading-tight">
                  {/* PLACEHOLDER */}
                  {project.title}
                </h3>
                <p className="mono-label text-smoke">
                  {project.discipline} · {project.year}
                </p>
                <p className="col-span-2 text-smoke">{project.line}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
