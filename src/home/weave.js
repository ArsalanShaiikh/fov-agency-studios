// Draws cloth from a punch card, the way a Jacquard loom reads it: each card
// row is one pick (weft pass); a hole lifts that column's warp thread so it
// shows on the face, otherwise the weft covers it. The card repeats across
// and down to fill the canvas. `reveal` (0-1) weaves rows in from the top.

const WARP = '#efe6d2'
const WARP_SHADE = '#d9cdb4'

export function drawWeave(canvas, card, cols, weft, { repeatX = 2, reveal = 1 } = {}) {
  const ctx = canvas.getContext('2d')
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const w = canvas.clientWidth
  const h = canvas.clientHeight
  if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, w, h)

  const warps = cols * repeatX
  const s = w / warps
  const picks = Math.ceil(h / s)
  const rows = card.length
  const shown = Math.floor(picks * reveal)

  ctx.fillStyle = '#1b1415'
  ctx.fillRect(0, 0, w, h)

  for (let p = 0; p < shown; p++) {
    const y = p * s
    const row = card[p % rows]
    // Alternate the weft shade pick to pick: it reads as real yarn.
    const weftColor = p % 2 ? weft.shade : weft.base
    for (let x = 0; x < warps; x++) {
      const lifted = row[x % cols]
      const px = x * s
      if (lifted) {
        // Warp face: a vertical float with the weft barely peeking at the edges.
        ctx.fillStyle = weftColor
        ctx.fillRect(px, y + s * 0.15, s, s * 0.7)
        ctx.fillStyle = x % 2 ? WARP_SHADE : WARP
        ctx.fillRect(px + s * 0.12, y - 0.5, s * 0.76, s + 1)
      } else {
        // Weft face: a horizontal float with a thin warp line underneath.
        ctx.fillStyle = 'rgba(239, 230, 210, 0.18)'
        ctx.fillRect(px + s * 0.45, y, s * 0.1, s)
        ctx.fillStyle = weftColor
        ctx.fillRect(px - 0.5, y + s * 0.1, s + 1, s * 0.8)
      }
    }
  }
}
