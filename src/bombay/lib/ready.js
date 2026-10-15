// "The page is revealed": fired once, when the preloader has cleared (or at
// once when it is skipped). Hero intros wait on this instead of page load.
let ready = false
const waiting = []

export function onReady(cb) {
  if (ready) cb()
  else waiting.push(cb)
}

export function markReady() {
  if (ready) return
  ready = true
  waiting.splice(0).forEach((cb) => cb())
}
