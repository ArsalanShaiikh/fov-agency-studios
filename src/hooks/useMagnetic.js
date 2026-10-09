import { useGSAP, gsap, MQ } from '../animations/gsap'

/**
 * Magnetic pull toward the pointer (fine pointers, motion allowed only).
 * Max travel `strength` px; released with the `lock` ease.
 */
export function useMagnetic(ref, strength = 8) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(`${MQ.fine} and ${MQ.motion}`, () => {
        const el = ref.current
        if (!el) return
        const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'lens' })
        const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'lens' })

        const move = (e) => {
          const r = el.getBoundingClientRect()
          const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
          const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
          xTo(gsap.utils.clamp(-1, 1, dx) * strength)
          yTo(gsap.utils.clamp(-1, 1, dy) * strength)
        }
        const leave = () => {
          gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'lock', overwrite: 'auto' })
        }

        el.addEventListener('pointermove', move)
        el.addEventListener('pointerleave', leave)
        return () => {
          el.removeEventListener('pointermove', move)
          el.removeEventListener('pointerleave', leave)
        }
      })
      return () => mm.revert()
    },
    { dependencies: [strength] },
  )
}
