// Beach sand for the preloader, drawn on a 2D canvas.
//   hidden    grains wait, unseen, at the centre while the lines play
//   form()    they burst out of the centre, swirling into the wordmark
//   scatter() they blow outward in every direction and fade
//
// To read as sand rather than particles: tens of thousands of tiny grains
// (1-2px), scattered at random inside the letters so they clump naturally,
// in eight tones from pale dry sand to damp brown, with a rare glint.
//
// Speed: grains live in typed arrays and are written straight into a pixel
// buffer (one putImageData per frame), at CSS-pixel resolution.

const TONES = [0xf4e7c9, 0xead9b4, 0xe0cb9f, 0xd4bb8b, 0xc6a977, 0xb39363, 0x9b7c51, 0x7d6340]
// Weighted so most grains are mid-tones, like real sand.
const TONE_WEIGHTS = [0.06, 0.13, 0.2, 0.22, 0.18, 0.11, 0.07, 0.03]
const GLINT = 0xfffaf0

const ease = (t) => {
  const x = t < 0 ? 0 : t > 1 ? 1 : t
  return 1 - (1 - x) * (1 - x) * (1 - x)
}

function pickTone() {
  if (Math.random() < 0.012) return GLINT
  let r = Math.random()
  for (let i = 0; i < TONE_WEIGHTS.length; i++) {
    r -= TONE_WEIGHTS[i]
    if (r <= 0) return TONES[i]
  }
  return TONES[3]
}

// 0xRRGGBB + alpha -> a little-endian RGBA pixel (0xAABBGGRR).
const pixel = (rgb, a = 255) => ((a << 24) | ((rgb & 0xff) << 16) | (rgb & 0xff00) | ((rgb >> 16) & 0xff)) >>> 0

export function createSand(canvas) {
  const ctx = canvas.getContext('2d')
  let w = 0
  let h = 0
  let image = null
  let buf = null
  let n = 0
  let G = null // grain arrays
  let mode = 'hidden'
  let t0 = performance.now()
  let raf = 0
  let onBlown = null

  const size = () => {
    w = Math.max(1, Math.round(canvas.clientWidth))
    h = Math.max(1, Math.round(canvas.clientHeight))
    canvas.width = w
    canvas.height = h
    image = ctx.createImageData(w, h)
    buf = new Uint32Array(image.data.buffer)
  }
  size()

  // Every pixel inside the wordmark, rasterised off screen.
  const insidePixels = () => {
    const off = document.createElement('canvas')
    off.width = w
    off.height = h
    const o = off.getContext('2d', { willReadFrequently: true })
    const narrow = w < 640
    const fs = narrow ? Math.min(w * 0.22, h * 0.15) : Math.min(w * 0.135, h * 0.26)
    o.fillStyle = '#000'
    o.textAlign = 'center'
    o.textBaseline = 'middle'
    o.font = `600 ${fs}px "General Sans", Arial, sans-serif`
    if ('letterSpacing' in o) o.letterSpacing = `${-0.05 * fs}px`
    if (narrow) {
      o.fillText('Bombay', w / 2, h * 0.44 - fs * 0.5)
      o.fillText('Craft', w / 2, h * 0.44 + fs * 0.5)
    } else {
      o.fillText('Bombay Craft', w / 2, h * 0.45)
    }
    const data = o.getImageData(0, 0, w, h).data
    const px = []
    for (let i = 3, k = 0; i < data.length; i += 4, k++) if (data[i] > 110) px.push(k)
    return px
  }

  const prepare = () => {
    const px = insidePixels()
    const cap = w < 640 ? 24000 : 60000
    n = px.length ? Math.min(cap, Math.round(px.length / 1.2)) : 0
    G = {
      sx: new Float32Array(n),
      sy: new Float32Array(n),
      tx: new Float32Array(n),
      ty: new Float32Array(n),
      qx: new Float32Array(n),
      qy: new Float32Array(n),
      x: new Float32Array(n),
      y: new Float32Array(n),
      d: new Float32Array(n),
      vx: new Float32Array(n),
      vy: new Float32Array(n),
      s: new Uint8Array(n), // grain size in px: 1 or 2
      c: new Uint32Array(n), // colour, 0xRRGGBB
      moving: new Uint8Array(n),
    }
    const cx = w / 2
    const cy = h * 0.45
    const R = Math.hypot(w, h) * 0.5
    for (let i = 0; i < n; i++) {
      const p = px[(Math.random() * px.length) | 0]
      const tx = (p % w) + Math.random() - 0.5
      const ty = ((p / w) | 0) + Math.random() - 0.5
      // Start in a small knot at the centre of the screen.
      const a = Math.random() * Math.PI * 2
      const r = Math.random() ** 2 * 14
      const sx = cx + Math.cos(a) * r
      const sy = cy + Math.sin(a) * r
      // Curve the path: every grain swirls the same way, like a gust.
      const swirl = 0.18 + Math.random() * 0.2
      G.sx[i] = sx
      G.sy[i] = sy
      G.tx[i] = tx
      G.ty[i] = ty
      G.qx[i] = (sx + tx) / 2 - (ty - sy) * swirl
      G.qy[i] = (sy + ty) / 2 + (tx - sx) * swirl
      G.x[i] = sx
      G.y[i] = sy
      // Nearer letters fill first, so the name grows outward from the middle.
      G.d[i] = (Math.hypot(tx - cx, ty - cy) / R) * 0.5 + Math.random() * 0.2
      G.s[i] = Math.random() < 0.18 ? 2 : 1
      G.c[i] = pickTone()
    }
  }
  prepare()

  // Write every grain into the pixel buffer. Lifted grains fade by `fade`.
  const draw = (fade = 1) => {
    buf.fill(0)
    const movingAlpha = Math.max(0, Math.min(255, Math.round(fade * 255)))
    for (let i = 0; i < n; i++) {
      const moving = G.moving[i]
      if (moving && movingAlpha === 0) continue
      const x = G.x[i] | 0
      const y = G.y[i] | 0
      const s = G.s[i]
      if (x < 0 || y < 0 || x + s > w || y + s > h) continue
      const col = pixel(G.c[i], moving ? movingAlpha : 255)
      const o = y * w + x
      buf[o] = col
      if (s === 2) {
        buf[o + 1] = col
        buf[o + w] = col
        buf[o + w + 1] = col
      }
    }
    ctx.putImageData(image, 0, 0)
  }

  function frame(now) {
    raf = requestAnimationFrame(frame)
    const t = (now - t0) / 1000
    if (mode === 'hidden') return

    if (mode === 'form') {
      const p = t / 1.35
      for (let i = 0; i < n; i++) {
        const k = ease((p - G.d[i]) / 0.7)
        const u = 1 - k
        // Quadratic curve from the start, round the swirl point, into place.
        G.x[i] = u * u * G.sx[i] + 2 * u * k * G.qx[i] + k * k * G.tx[i]
        G.y[i] = u * u * G.sy[i] + 2 * u * k * G.qy[i] + k * k * G.ty[i]
      }
      draw()
    } else if (mode === 'scatter') {
      // Every grain flies straight out from the centre, gathering speed, and fades.
      const cx = w / 2
      const cy = h * 0.45
      const dt = 1 / 60
      for (let i = 0; i < n; i++) {
        if (!G.moving[i]) {
          G.moving[i] = 1
          const dx = G.x[i] - cx + (Math.random() - 0.5) * 40
          const dy = G.y[i] - cy + (Math.random() - 0.5) * 40
          const len = Math.hypot(dx, dy) || 1
          const sp = 160 + Math.random() * 520
          G.vx[i] = (dx / len) * sp
          G.vy[i] = (dy / len) * sp
        }
        G.vx[i] *= 1.045
        G.vy[i] *= 1.045
        G.x[i] += G.vx[i] * dt
        G.y[i] += G.vy[i] * dt
      }
      draw(1 - t / 1.3)
      if (t > 1.4) {
        cancelAnimationFrame(raf)
        raf = 0
        onBlown?.()
      }
    }
  }

  return {
    start() {
      t0 = performance.now()
      raf = requestAnimationFrame(frame)
    },
    /** Rebuild the wordmark targets once fonts are in (General Sans). */
    refresh() {
      size()
      prepare()
    },
    form() {
      mode = 'form'
      t0 = performance.now()
    },
    scatter() {
      return new Promise((resolve) => {
        onBlown = resolve
        mode = 'scatter'
        t0 = performance.now()
      })
    },
    /** A still wordmark for reduced motion. */
    still() {
      for (let i = 0; i < n; i++) {
        G.x[i] = G.tx[i]
        G.y[i] = G.ty[i]
      }
      draw()
    },
    stop() {
      cancelAnimationFrame(raf)
      raf = 0
    },
  }
}
