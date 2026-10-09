// Projector dust. Each mote computes a circle of confusion against the focus
// distance: in focus it is a pin-point, out of focus it opens into a soft
// bokeh disc with a faint rim, with brightness spread over the larger area.
// Motes part around the pointer.

export const dustVertex = /* glsl */ `
attribute float aSeed;
attribute float aScale;

uniform float uTime;
uniform float uWorldPerPixel;
uniform float uFocusDist;
uniform float uAperture;
uniform float uPixelRatio;
uniform float uTanHalf;
uniform float uAspect;
uniform float uPointerActive;
uniform vec2 uPointer;

varying float vAlpha;
varying float vCoc;
varying float vDepth;

void main() {
  vec3 p = position;
  p.x += sin(uTime * 0.13 + aSeed * 40.0) * 0.09;
  p.y += sin(uTime * 0.1 + aSeed * 23.0) * 0.07 + uTime * 0.012 * (0.4 + aSeed);
  p.y = mod(p.y + 2.2, 4.4) - 2.2;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float depth = max(0.05, -mv.z);
  float halfH = depth * uTanHalf;

  vec2 ph = uPointer * vec2(halfH * uAspect, halfH);
  vec2 dv = mv.xy - ph;
  float r = length(dv) / halfH;
  float push = (1.0 - smoothstep(0.0, 0.32, r)) * uPointerActive;
  mv.xy += normalize(dv + 1e-5) * push * 0.14 * halfH;

  float wpp = depth * uWorldPerPixel;
  float coc = clamp(abs(depth - uFocusDist) * uAperture, 0.0, 1.0);
  float basePx = max(aScale / wpp, 1.2);
  float sizePx = clamp(basePx + coc * 16.0, 1.2, 40.0);

  gl_PointSize = sizePx * uPixelRatio;
  vAlpha = clamp(pow(basePx / sizePx, 1.15), 0.03, 1.0) * 0.6;
  vCoc = coc;
  vDepth = depth;
  gl_Position = projectionMatrix * mv;
}
`

export const dustFragment = /* glsl */ `
uniform vec3 uColor;
uniform float uFogNear;
uniform float uFogFar;
uniform float uDim;
uniform float uIntro;

varying float vAlpha;
varying float vCoc;
varying float vDepth;

void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  float r = length(c);
  float core = 1.0 - smoothstep(0.0, 1.0, r);
  float disc = (1.0 - smoothstep(0.84, 1.0, r)) * (0.65 + 0.35 * smoothstep(0.55, 0.95, r));
  float shape = mix(core, disc, smoothstep(0.08, 0.5, vCoc));
  float fog = 1.0 - smoothstep(uFogNear, uFogFar, vDepth);
  float a = shape * vAlpha * fog * (1.0 - uDim * 0.85) * uIntro;
  if (a < 0.003) discard;
  gl_FragColor = vec4(uColor, a);
  #include <colorspace_fragment>
}
`

// The "place" at the end of the tunnel: a warm window with a soft glow.
export const windowVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const windowFragment = /* glsl */ `
uniform vec3 uColor;
uniform float uIntro;
uniform float uDim;
uniform float uAspect;
varying vec2 vUv;

float sdBox(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

void main() {
  vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
  float d = sdBox(p, vec2(0.05 * uAspect, 0.05));
  float core = 1.0 - smoothstep(0.0, 0.004, d);
  float glow = exp(-max(d, 0.0) * 16.0) * 0.32;
  float a = (core + glow) * uIntro * (1.0 - uDim * 0.92);
  gl_FragColor = vec4(uColor * (core * 1.6 + glow), a);
  #include <colorspace_fragment>
}
`
