// CSS-only version of the flat telephoto frame stack. Shown when WebGL is
// unavailable (and while the 3D chunk is still loading). Same composition,
// no canvas. Square corners only (shape lock).

const SCALES = [1.42, 1.18, 0.98, 0.82, 0.55, 0.46, 0.38, 0.31, 0.25, 0.2, 0.16, 0.13]

export default function FrameFallback({ visible = true }) {
  return (
    <div
      aria-hidden="true"
      data-frame-fallback
      className="pointer-events-none fixed inset-0 z-(--z-canvas) overflow-hidden transition-opacity duration-1000"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {SCALES.map((s, i) => {
        const subject = s === 0.55
        const behind = s < 0.55
        return (
          <div
            key={s}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border"
            style={{
              width: subject ? 'var(--subject-w)' : `calc(var(--subject-w) * ${s / 0.55})`,
              height: subject ? 'var(--subject-h)' : `calc(var(--subject-h) * ${s / 0.55})`,
              borderColor: subject
                ? 'var(--color-paper)'
                : `rgb(233 232 228 / ${behind ? 0.5 - i * 0.03 : 0.22 + i * 0.05})`,
              rotate: subject ? '0deg' : `${((i % 3) - 1) * 0.4}deg`,
            }}
          />
        )
      })}
    </div>
  )
}
