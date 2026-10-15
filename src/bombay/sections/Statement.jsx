import { useRef } from 'react'
import { gsap, MQ, SplitText, useGSAP } from '../../animations/gsap'
import { PhotoTile, VideoTile } from '../components/media'
import { Button } from '../components/ui'
import { TOOLS } from '../lib/content'

/** A small picture (portrait or wide) set inline with the words. */
function Inline({ shape, children }) {
  const shapes = {
    portrait: 'w-[0.7em]',
    wide: 'w-[1.6em]',
  }
  return (
    <span
      data-inline
      aria-hidden="true"
      className={`relative mx-[0.1em] inline-block h-[0.9em] translate-y-[0.12em] overflow-hidden rounded-[0.12em] align-baseline ${shapes[shape]}`}
    >
      {children}
    </span>
  )
}

export default function Statement() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        // Words fill from grey to ink as you read down.
        const split = SplitText.create('[data-words]', { type: 'words', aria: 'none' })
        gsap.fromTo(
          split.words,
          { opacity: 0.14 },
          { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: '[data-words]', start: 'top 80%', end: 'bottom 55%', scrub: true } },
        )
        gsap.from('[data-inline]', {
          scale: 0,
          duration: 1,
          ease: 'back.out(1.7)',
          stagger: 0.15,
          scrollTrigger: { trigger: '[data-words]', start: 'top 70%', once: true },
        })
        gsap.from('[data-sign]', {
          stagger: 0.12,
          opacity: 0,
          y: 16,
          duration: 1,
          ease: 'lens',
          scrollTrigger: { trigger: '[data-sign]', start: 'top 90%', once: true },
        })
        return () => split.revert()
      })
    },
    { scope: root },
  )

  return (
    <section id="about" ref={root} aria-labelledby="statement-title" className="section-pad">
      <div className="frame flex flex-col items-center text-center">
        <p className="caption">( Bombay Craft · Digital-first creative & technology studio )</p>
        <h2
          id="statement-title"
          data-words
          className="display mt-8 max-w-[14ch] text-[clamp(2.75rem,1rem+6vw,8.5rem)] leading-[1] tracking-[-0.05em]"
        >
          Digital{' '}
          <Inline shape="wide">
            <VideoTile name="sunset" />
          </Inline>{' '}
          experiences. Thoughtfully{' '}
          <Inline shape="portrait">
            <PhotoTile name="archwayNight" />
          </Inline>{' '}
          crafted.
        </h2>
        <p data-sign className="mt-10 max-w-[56ch] text-lead text-dim">
          We design and build websites, digital products and business systems that help organisations work smarter and grow. From
          UI/UX and custom development to CRM and automation, Bombay Craft brings creativity and technology together under one roof.
        </p>
        <div data-sign className="mt-9 flex flex-wrap justify-center gap-3">
          <Button href="#contact">Start a project</Button>
          <Button href="#work" variant="ghost">
            Explore our work
          </Button>
        </div>
        <p data-sign className="mt-12 flex items-center gap-3 text-small text-dim">
          <span className="h-px w-8 bg-maroon" aria-hidden="true" />
          Born in Bombay. Crafted for the world.
          <span className="h-px w-8 bg-maroon" aria-hidden="true" />
        </p>
      </div>

      <div className="mt-20 md:mt-28">
        <p className="caption text-center">Tools we work with</p>
        <div className="marquee-mask mx-auto mt-6 max-w-4xl overflow-hidden">
          <ul aria-label="Tools we work with" className="flex w-max animate-marquee items-center">
            {[0, 1].map((copy) =>
              TOOLS.map((t) => (
                <li key={`${copy}${t}`}aria-hidden={copy ? true : undefined} className="flex items-center gap-2 pr-12 font-medium whitespace-nowrap text-dim">
                  <span className="grid size-5 place-items-center rounded-full border border-dim/50 text-[0.5625rem]">{t[0]}</span>
                  {t}
                </li>
              )),
            )}
          </ul>
        </div>
      </div>
    </section>
  )
}
