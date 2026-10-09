import { gsap, SplitText } from './gsap'
import { DURATION, STAGGER } from './eases'

/**
 * Masked line reveal (SplitText lines inside overflow masks). Lines rise
 * 105% -> 0 with the `lens` ease. `autoSplit` re-splits on resize and font load.
 * Call inside a gsap.matchMedia() motion branch; use fadeIn() for reduced motion.
 */
export function revealLines(el, { trigger = el, start = 'top 85%', delay = 0, scrub = false, paused = false } = {}) {
  if (!el) return null
  return SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'split-line',
    autoSplit: true,
    // aria-label is prohibited on <p>; there the text simply stays readable as-is.
    aria: el.tagName === 'P' ? 'none' : 'auto',
    onSplit(self) {
      return gsap.from(self.lines, {
        yPercent: 105,
        duration: DURATION.reveal,
        ease: 'lens',
        stagger: { each: STAGGER.lines, amount: Math.min(0.5, STAGGER.lines * (self.lines.length - 1)) },
        delay,
        paused,
        scrollTrigger: paused ? undefined : { trigger, start, once: !scrub, scrub },
      })
    },
  })
}

/** Reduced-motion stand-in: a short opacity fade, no travel. */
export function fadeIn(targets, { trigger, start = 'top 85%', delay = 0 } = {}) {
  return gsap.from(targets, {
    opacity: 0,
    duration: 0.4,
    ease: 'none',
    delay,
    scrollTrigger: trigger ? { trigger, start, once: true } : undefined,
  })
}

/**
 * Tween a clip-path inset through an explicit 4-value proxy. Browsers
 * normalise inset(a b a b) to inset(a b), so tweening the CSS string directly
 * interpolates mismatched number lists. `from` / `to` are [top, right, bottom, left].
 */
export function insetTween(el, from, to, { clear = false, ...vars } = {}, unit = '%') {
  const box = { t: from[0], r: from[1], b: from[2], l: from[3] }
  const apply = () => {
    el.style.clipPath = `inset(${box.t}${unit} ${box.r}${unit} ${box.b}${unit} ${box.l}${unit})`
  }
  apply()
  return gsap.to(box, {
    t: to[0],
    r: to[1],
    b: to[2],
    l: to[3],
    ...vars,
    onUpdate: apply,
    onComplete: () => {
      if (clear) el.style.clipPath = ''
    },
  })
}
