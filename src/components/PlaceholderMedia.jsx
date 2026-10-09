// PLACEHOLDER media slot: our own frame motif at the project's ratio, clearly
// labelled, until real imagery is supplied (see content.js `image`).

const INSETS = [0.9, 0.72, 0.56, 0.42, 0.3, 0.2]

export default function PlaceholderMedia({ ratio = [16, 9], label = 'Image to come', className = '' }) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: `${ratio[0]} / ${ratio[1]}` }}
    >
      <div aria-hidden="true" data-media-art className="absolute inset-0 bg-ink-2 transition-opacity duration-500">
        {INSETS.map((s, i) => (
          <div
            key={s}
            className="absolute border"
            style={{
              inset: `${((1 - s) / 2) * 100}%`,
              borderColor: i === 3 ? 'rgb(233 196 64 / 0.7)' : `rgb(233 232 228 / ${0.08 + i * 0.05})`,
            }}
          />
        ))}
      </div>
      {/* PLACEHOLDER */}
      <span aria-hidden="true" className="mono-label absolute bottom-3 left-3 text-smoke">
        {label}
      </span>
    </div>
  )
}
