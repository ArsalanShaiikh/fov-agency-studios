import { useSyncExternalStore } from 'react'

// Tiny UI store for discrete app state (never for per-frame values; those
// live in lib/rig.js and are read imperatively).
let state = {
  progress: 0, // preloader, 0..1
  loaded: false, // preloader finished
  webgl: null, // true | false once detected
  tier: 'high', // 'high' | 'mid' | 'low'
  sceneRequested: false, // low tier waits for first interaction / idle
  sceneReady: false,
  project: null, // id of the open project overlay
  menuOpen: false,
  creditsOpen: false,
  demoFov: 30,
  inHero: true, // readout visibility on mobile
  inWork: false,
  endcard: false, // signal end card covers the view
  scenePaused: false,
}

const listeners = new Set()

export const getState = () => state

export function setState(partial) {
  const next = typeof partial === 'function' ? partial(state) : partial
  state = { ...state, ...next }
  listeners.forEach((l) => l())
}

export function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useStore(selector) {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(state),
  )
}
