// DOM <-> WebGL bridge for the Work media. The Work section registers each
// media box; three/WorkPlanes draws a shader plane exactly over it and reads
// these values every frame. Plain mutable objects: no React re-renders.

export const media = {}

export function registerMedia(id, el, extra = {}) {
  // The state object stays stable across re-renders (ref callbacks detach and
  // re-attach); tweens hold a reference to it, so it is never replaced.
  const m = (media[id] ??= { reveal: 0, hover: 0, mouseX: 0.5, mouseY: 0.5, seed: Object.keys(media).length })
  m.el = el
  if (el) Object.assign(m, extra)
}

/** True while any media box is hovered (the others rack out of focus). */
export const anyHover = () => Object.values(media).some((m) => m.hover > 0.5)
