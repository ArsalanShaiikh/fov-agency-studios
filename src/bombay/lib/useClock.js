import { useSyncExternalStore } from 'react'

// One shared minute ticker for every clock on the page.
let now = null
const listeners = new Set()
let timer = 0

function schedule() {
  timer = window.setTimeout(() => {
    now = new Date()
    listeners.forEach((l) => l())
    schedule()
  }, 60_000 - (Date.now() % 60_000) + 50)
}

function subscribe(listener) {
  listeners.add(listener)
  if (listeners.size === 1) schedule()
  return () => {
    listeners.delete(listener)
    if (!listeners.size) window.clearTimeout(timer)
  }
}

function getSnapshot() {
  if (!now || now.getMinutes() !== new Date().getMinutes()) now = new Date()
  return now
}

/** Current time, updated on the minute. Null during prerender. */
export function useClock() {
  return useSyncExternalStore(subscribe, getSnapshot, () => null)
}

const formats = new Map()
export function timeIn(date, timeZone) {
  if (!date) return '--:--'
  if (!formats.has(timeZone)) {
    formats.set(timeZone, new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', hour12: false }))
  }
  return formats.get(timeZone).format(date)
}

/** "+4h 30m" style offset of a zone relative to Bombay. */
export function offsetFromBombay(date, timeZone) {
  if (!date) return ''
  const minutes = (zone) => {
    const [h, m] = timeIn(date, zone).split(':').map(Number)
    return h * 60 + m
  }
  let diff = minutes(timeZone) - minutes('Asia/Kolkata')
  if (diff > 720) diff -= 1440
  if (diff < -720) diff += 1440
  if (diff === 0) return 'IST'
  const abs = Math.abs(diff)
  const span = [Math.floor(abs / 60) ? `${Math.floor(abs / 60)}h` : '', abs % 60 ? `${abs % 60}m` : ''].filter(Boolean).join(' ')
  return `${diff > 0 ? '+' : '−'}${span}`
}
