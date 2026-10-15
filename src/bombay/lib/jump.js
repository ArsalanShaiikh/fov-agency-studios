import { scrollToTarget } from '../../animations/smoothScroll'

/** Smooth-scroll to an in-page section and keep the URL hash in step. */
export function jump(event, id, after) {
  event.preventDefault()
  after?.()
  scrollToTarget(id === 'top' ? 0 : `#${id}`, { offset: -8 })
  history.replaceState(null, '', id === 'top' ? location.pathname : `#${id}`)
}
