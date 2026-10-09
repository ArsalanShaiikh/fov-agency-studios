// Single place where GSAP and its plugins are registered (DESIGN.md §5).
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'
import { useGSAP } from '@gsap/react'
import { registerEases } from './eases'

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP)
registerEases()

gsap.defaults({ ease: 'lens', duration: 0.9 })
ScrollTrigger.config({ ignoreMobileResize: true })

/** Media conditions shared by every gsap.matchMedia() in the app. */
export const MQ = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
  desktop: '(min-width: 64rem)',
  mobile: '(max-width: 63.999rem)',
  fine: '(pointer: fine)',
  portrait: '(orientation: portrait)',
}

export { gsap, ScrollTrigger, SplitText, CustomEase, useGSAP }
