import { useEffect, useRef } from 'react'
import { IMAGES, VIDEOS } from '../lib/homeMedia'

/** A photo that fills its tile. */
export function PhotoTile({ name, className = '' }) {
  const p = IMAGES[name]
  return <img src={p.src} alt={p.alt} decoding="async" className={`absolute inset-0 size-full object-cover ${className}`} />
}

/**
 * A silent looping clip that fills its tile. Plays only while on screen and
 * never for reduced motion (the poster stays). `muted` is set on the element
 * itself because React does not render the attribute, and autoplay needs it.
 */
export function VideoTile({ name, className = '' }) {
  const v = VIDEOS[name]
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    el.muted = true
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) el.play().catch(() => {})
      else el.pause()
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      src={v.src}
      poster={v.poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      className={`absolute inset-0 size-full object-cover ${className}`}
    />
  )
}
