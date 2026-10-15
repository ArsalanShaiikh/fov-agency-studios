// The Loom: the home page's centrepiece. Bombay was a mill city before it
// was anything else; this weaves that history in code.
//
// - Warp: fine ivory threads hang the full height of the hero.
// - Swatch: inside a slot element (positioned by the page layout) oxblood,
//   brass and sand weft threads weave a 2/2 twill whose colours follow an
//   ikat diamond: feathered at the edges, slowly blooming outward.
// - Play: rows are woven bottom-up with a brass shuttle crossing each one.
// - Touch: moving across the threads plucks them; they spring back.
//
// Plain canvas 2D. Pauses off screen and in background tabs; reduced motion
// gets a single, fully woven, still frame.

// Bands from the centre out: oxblood field, a brass outline, a sand core.
const WEFT = ['#e5d3af', '#c9ab78', '#790d16', '#790d16', '#790d16', '#4c0a10', '#2a1f20', '#4c0a10', '#790d16', '#c9ab78']
const WARP = 'rgba(245, 239, 225, 0.5)'
const SWATCH_BG = '#1b1415'

// Cheap deterministic noise per row: the ikat "feathering".
const jitter = (r) => {
  const x = Math.sin(r * 127.1 + 31.7) * 43758.5453
  return x - Math.floor(x) - 0.5
}

export function startLoom(canvas, slot, { reduceMotion = false } = {}) {
  const ctx = canvas.getContext('2d')
  const g = { w: 0, h: 0, dpr: 1, s: 9, cols: 0, swatch: { x: 0, y: 0, w: 0, h: 0, c0: 0, cn: 0, rn: 0 } }
  let strings = []

  const layout = () => {
    const rect = canvas.getBoundingClientRect()
    g.dpr = Math.min(window.devicePixelRatio || 1, 2)
    g.w = rect.width
    g.h = rect.height
    canvas.width = Math.round(g.w * g.dpr)
    canvas.height = Math.round(g.h * g.dpr)
    ctx.setTransform(g.dpr, 0, 0, g.dpr, 0, 0)

    // Thread pitch: finer on large screens, never fussier than 7px.
    g.s = Math.max(7, Math.min(11, g.w / 150))
    g.cols = Math.ceil(g.w / g.s) + 1
    const offset = (g.w - (g.cols - 1) * g.s) / 2

    // Snap the swatch to the thread grid so the cloth and the warp line up.
    const sr = slot.getBoundingClientRect()
    const x0 = sr.left - rect.left
    const y0 = sr.top - rect.top
    const c0 = Math.max(0, Math.round((x0 - offset) / g.s))
    const cn = Math.max(4, Math.min(g.cols - c0, Math.round(sr.width / g.s)))
    const rn = Math.max(4, Math.round(sr.height / g.s))
    g.swatch = { x: offset + c0 * g.s - g.s / 2, y: y0, w: cn * g.s, h: rn * g.s, c0, cn, rn, offset }

    strings = Array.from({ length: g.cols }, (_, i) => strings[i] ?? { d: 0, v: 0, y: g.h / 2 })
    strings.length = g.cols
  }

  // Pointer plucks: horizontal speed becomes string velocity near the pointer.
  const pointer = { x: -999, y: -999, px: -999, active: false }
  const onMove = (e) => {
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    if (pointer.active && !reduceMotion) {
      const vx = x - pointer.px
      const R = 70
      const from = Math.max(0, Math.floor((Math.min(x, pointer.px) - R - g.swatch.offset) / g.s))
      const to = Math.min(g.cols - 1, Math.ceil((Math.max(x, pointer.px) + R - g.swatch.offset) / g.s))
      for (let c = from; c <= to; c++) {
        const cx = g.swatch.offset + c * g.s
        const dist = Math.abs(cx - x)
        if (dist < R) {
          const st = strings[c]
          st.v += vx * 0.09 * (1 - dist / R)
          st.y += (y - st.y) * 0.5
        }
      }
    }
    pointer.px = x
    pointer.x = x
    pointer.y = y
    pointer.active = true
  }
  // On the window: the hero's type sits above the canvas but should not block a pluck.
  window.addEventListener('pointermove', onMove, { passive: true })

  // Weaving progress: rows woven so far (float), started by play().
  let woven = reduceMotion ? Infinity : 0
  let weaving = false
  let wovenAt = 0

  const disp = (c, y) => {
    const st = strings[c]
    if (!st || Math.abs(st.d) < 0.05) return 0
    const k = (y - st.y) / 150
    return st.d * Math.exp(-k * k)
  }

  function draw(t) {
    const { w, h, s, cols, swatch: sw } = g
    ctx.clearRect(0, 0, w, h)

    // Warp threads, full height; brighter where they leave the cloth.
    ctx.lineWidth = 1
    for (let c = 0; c < cols; c++) {
      const x = sw.offset + c * s
      const inCloth = c >= sw.c0 && c < sw.c0 + sw.cn
      ctx.strokeStyle = inCloth ? 'rgba(245, 239, 225, 0.12)' : 'rgba(245, 239, 225, 0.035)'
      ctx.beginPath()
      for (let y = 0; y <= h + 24; y += 24) {
        const sway = reduceMotion ? 0 : Math.sin(t * 0.7 + c * 0.13 + y * 0.004) * 0.6
        const xx = x + disp(c, y) + sway
        if (y === 0) ctx.moveTo(xx, y)
        else ctx.lineTo(xx, y)
      }
      ctx.stroke()
    }

    // The cloth.
    ctx.fillStyle = SWATCH_BG
    ctx.fillRect(sw.x, sw.y, sw.w, sw.h)

    const rowsDone = Math.min(sw.rn, Math.floor(woven))
    const bloom = reduceMotion ? 0 : t * 0.05
    const halfC = sw.cn / 2
    const halfR = sw.rn / 2
    const period = Math.max(10, Math.min(sw.cn, sw.rn) / 2.1)
    const warpW = s * 0.42
    const weftH = s * 0.86

    for (let r = 0; r < rowsDone; r++) {
      const rowIdx = sw.rn - 1 - r // weave from the bottom up
      const y = sw.y + rowIdx * s
      const feather = jitter(rowIdx) * 3.2
      for (let i = 0; i < sw.cn; i++) {
        const c = sw.c0 + i
        const x = sw.offset + c * s + disp(c, y + s / 2)
        // Ikat diamond: Manhattan distance from the centre, feathered per row.
        const v = (Math.abs(i - halfC + feather) + Math.abs(rowIdx - halfR)) / period - bloom
        const band = ((v % 1) + 1) % 1
        const col = WEFT[Math.floor(band * WEFT.length)]
        const warpOver = (i + rowIdx) % 4 === 0 // 3/1 twill: weft-faced, so the ikat reads
        // Weft first, then the warp segment on top where the warp floats over.
        ctx.fillStyle = col
        ctx.fillRect(x - s / 2, y + (s - weftH) / 2, s + 0.5, weftH)
        if (warpOver) {
          ctx.fillStyle = WARP
          ctx.fillRect(x - warpW / 2, y, warpW, s + 0.5)
        }
      }
    }

    // Unwoven rows above: bare warp across the cloth.
    if (rowsDone < sw.rn) {
      ctx.fillStyle = 'rgba(245, 239, 225, 0.55)'
      const bareH = (sw.rn - rowsDone) * s
      for (let i = 0; i < sw.cn; i++) {
        const c = sw.c0 + i
        ctx.fillRect(sw.offset + c * s - 0.5 + disp(c, sw.y + bareH / 2), sw.y, 1, bareH)
      }
      // The shuttle, crossing the row being woven.
      const frac = woven - Math.floor(woven)
      const rowY = sw.y + (sw.rn - 1 - rowsDone) * s
      const dir = rowsDone % 2 ? -1 : 1
      const sx = dir > 0 ? sw.x + frac * sw.w : sw.x + sw.w - frac * sw.w
      ctx.fillStyle = '#c9ab78'
      ctx.fillRect(sx - s * 1.6, rowY + s * 0.18, s * 3.2, s * 0.64)
    }

    // A hairline selvedge.
    ctx.strokeStyle = 'rgba(201, 171, 120, 0.35)'
    ctx.strokeRect(sw.x - 0.5, sw.y - 0.5, sw.w + 1, sw.h + 1)
  }

  // Physics + clock.
  let raf = 0
  let visible = true
  let last = performance.now()
  const start = last

  function frame(now) {
    raf = 0
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    const t = (now - start) / 1000

    for (const st of strings) {
      st.v += -st.d * 140 * dt
      st.v *= 1 - 3.2 * dt
      st.d += st.v * dt * 6
      if (Math.abs(st.d) > 40) st.d = Math.sign(st.d) * 40
    }

    if (weaving && woven < g.swatch.rn) {
      // About 2.4s for the whole cloth, quick at first, settling at the end.
      const p = Math.min(1, (now - wovenAt) / 2400)
      woven = (1 - Math.pow(1 - p, 2.2)) * g.swatch.rn
    }

    draw(t)
    if (visible && !document.hidden && !reduceMotion) raf = requestAnimationFrame(frame)
  }

  const kick = () => {
    if (!raf) {
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }
  }

  const ro = new ResizeObserver(() => {
    layout()
    kick()
  })
  ro.observe(canvas)
  ro.observe(slot)
  layout()

  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting
    if (visible) kick()
  })
  io.observe(canvas)
  const onVisibility = () => !document.hidden && visible && kick()
  document.addEventListener('visibilitychange', onVisibility)
  kick()

  return {
    play() {
      if (reduceMotion || weaving) return
      weaving = true
      wovenAt = performance.now()
      kick()
    },
    stop() {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', onVisibility)
    },
  }
}
