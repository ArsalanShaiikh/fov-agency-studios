import { useRef } from 'react'
import { MISSION, MISSION_EMPHASIS } from '../lib/content'
import { useManifestoMotion } from '../animations/sections/manifesto'

// Manifesto: "Focus". The mission, verbatim, racks into focus word by word
// while the 3D world racks out (DESIGN.md §7.2).
export default function Manifesto() {
  const root = useRef(null)
  useManifestoMotion(root)

  const [before, after] = MISSION.split(MISSION_EMPHASIS)

  return (
    <section
      id="manifesto"
      ref={root}
      aria-labelledby="manifesto-title"
      className="relative flex min-h-[100svh] items-center section-pad"
    >
      <h2 id="manifesto-title" className="sr-only">
        Our mission
      </h2>
      <div className="frame grid-frame">
        <p
          data-manifesto
          className="headline col-span-full text-manifesto text-paper lg:col-span-10 lg:col-start-2"
        >
          {before}
          <span data-emphasis className="transition-colors duration-700">
            {MISSION_EMPHASIS}
          </span>
          {after}
        </p>
      </div>
    </section>
  )
}
