import { useRef } from 'react'
import { SERVICES } from '../lib/content'
import { fovFromFocal } from '../lib/cameraMath'
import { useServicesMotion } from '../animations/sections/services'

// Services: "Choose a lens". Each service is a focal length; scrolling through
// the pinned stage changes the 3D camera's lens (DESIGN.md §7.3).
export default function Services() {
  const root = useRef(null)
  useServicesMotion(root)

  return (
    <section id="services" ref={root} aria-labelledby="services-title" className="relative">
      <div
        data-services-stage
        data-active="0"
        className="frame relative py-(--section-pad) lg:motion-safe:flex lg:motion-safe:h-svh lg:motion-safe:min-h-160 lg:motion-safe:flex-col lg:motion-safe:justify-center lg:motion-safe:py-0"
      >
        <h2
          id="services-title"
          className="headline text-lead text-smoke lg:motion-safe:absolute lg:motion-safe:top-[calc(var(--nav-h)+clamp(1.5rem,4svh,3rem))] lg:motion-safe:left-0"
        >
          What we make
        </h2>

        <ol className="mt-10 flex flex-col gap-16 md:gap-20 lg:motion-safe:mt-0 lg:motion-safe:gap-[clamp(0.25rem,1.2svh,1rem)]">
          {SERVICES.map((service, i) => (
            <li key={service.id} data-service={i} className="lg:motion-safe:w-8/12">
              <h3 className="display text-display">{service.name}</h3>

              <div className="service-detail mt-6 max-w-[34rem] lg:motion-safe:absolute lg:motion-safe:right-0 lg:motion-safe:bottom-[clamp(5rem,12svh,8rem)] lg:motion-safe:mt-0 lg:motion-safe:w-[min(30rem,30vw)]">
                <p className="mono-label flex gap-4 text-signal">
                  <span>{service.lens}MM</span>
                  <span>{fovFromFocal(service.lens).toFixed(1)}°</span>
                </p>
                <p className="headline mt-4 text-lead text-paper">{service.body}</p>
                <ul className="mono-label mt-6 flex flex-col gap-1.5 text-smoke">
                  {service.caps.map((cap) => (
                    <li key={cap}>{cap}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
