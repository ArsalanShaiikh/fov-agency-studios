import { useRef } from 'react'
import { PROCESS } from '../lib/content'
import { useProcessMotion } from '../animations/sections/process'

// Process: "Pan". Desktop pans sideways through four verbs; the panel in the
// centre of frame racks into focus. Mobile stacks them (DESIGN.md §7.5).
export default function Process() {
  const root = useRef(null)
  useProcessMotion(root)

  return (
    <section id="process" ref={root} aria-labelledby="process-title" className="relative">
      <div
        data-process-stage
        className="relative py-(--section-pad) lg:motion-safe:flex lg:motion-safe:h-svh lg:motion-safe:min-h-160 lg:motion-safe:flex-col lg:motion-safe:overflow-hidden lg:motion-safe:py-0"
      >
        <div className="frame lg:motion-safe:pt-[calc(var(--nav-h)+clamp(1.5rem,4svh,3rem))]">
          <h2 id="process-title" data-reveal className="headline text-h2">
            How we work
          </h2>
        </div>

        <ol
          data-process-track
          className="frame mt-14 flex flex-col gap-16 md:gap-20 lg:motion-safe:mx-0 lg:motion-safe:mt-0 lg:motion-safe:w-max lg:motion-safe:flex-1 lg:motion-safe:flex-row lg:motion-safe:items-center lg:motion-safe:gap-0 lg:motion-safe:px-[calc(50vw-min(26vw,30rem))]"
        >
          {PROCESS.map((step) => (
            <li
              key={step.verb}
              data-step
              className="lg:motion-safe:w-[min(52vw,60rem)] lg:motion-safe:shrink-0 lg:motion-safe:px-[clamp(1.5rem,3vw,4rem)]"
            >
              <h3 className="display text-display">{step.verb}</h3>
              <p className="headline mt-5 max-w-[34ch] text-lead text-paper lg:motion-safe:mt-8">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
