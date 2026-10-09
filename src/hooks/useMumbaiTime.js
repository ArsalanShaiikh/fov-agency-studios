import { useSyncExternalStore } from 'react'

const IST_OFFSET_MIN = 330 // UTC+5:30, no daylight saving

const timeFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kolkata',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

function describeOffset(now) {
  const visitorOffset = -now.getTimezoneOffset()
  const diff = IST_OFFSET_MIN - visitorOffset
  if (diff === 0) return 'Same time as you'
  const abs = Math.abs(diff)
  const h = Math.floor(abs / 60)
  const m = abs % 60
  const span = [h ? `${h}h` : null, m ? `${m}m` : null].filter(Boolean).join(' ')
  return diff > 0 ? `${span} ahead of you` : `${span} behind you`
}

function read() {
  const now = new Date()
  return { time: timeFormat.format(now), offset: describeOffset(now), iso: now.toISOString() }
}

// One shared minute ticker for every clock on the page.
let current = null
const listeners = new Set()
let timer = 0

function schedule() {
  timer = window.setTimeout(() => {
    current = read()
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
  if (!current || current.time !== timeFormat.format(new Date())) current = read()
  return current
}

// The prerendered HTML has no clock; it fills in on hydration (visitor's zone).
const SERVER = { time: '--:--', offset: '', iso: '' }
const getServerSnapshot = () => SERVER

/** Live Mumbai time, updated on the minute; SSR-safe. */
export function useMumbaiTime() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
