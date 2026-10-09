// Work media planes, drawn in pixel space exactly over their DOM boxes.
// Scroll velocity bows the plane and barrel-distorts the image like a lens
// under load; hover ripples from the pointer and splits RGB; when another
// piece is hovered this one racks out of focus. Without an image, the art is
// a procedural, endlessly zooming frame tunnel in the project's ratio.

export const mediaVertex = /* glsl */ `
uniform float uVelocity;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 p = position;
  p.y += sin(uv.x * 3.14159265) * uVelocity * 0.05;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`

export const mediaFragment = /* glsl */ `
uniform float uTime;
uniform float uVelocity;
uniform float uHover;
uniform float uOthers;
uniform float uReveal;
uniform float uRatio;
uniform float uSeed;
uniform float uHasMap;
uniform float uMapRatio;
uniform vec2 uMouse;
uniform vec2 uRes;
uniform sampler2D uMap;
uniform vec3 uInk;
uniform vec3 uPaper;
uniform vec3 uSignal;

varying vec2 vUv;

float ring(vec2 p, vec2 halfSize, float w, float soft) {
  vec2 d = abs(p) - halfSize;
  float dist = abs(max(d.x, d.y));
  return 1.0 - smoothstep(w, w + soft, dist);
}

vec3 art(vec2 uv, float soft) {
  vec2 p = (uv - 0.5) * vec2(uRatio, 1.0);
  vec3 col = uInk;
  float speed = 0.05 + uHover * 0.22;
  float clock = uTime * speed + uSeed * 0.37;
  float t = fract(clock);
  float base = floor(clock);
  for (int i = 0; i < 9; i++) {
    float k = float(i) - t;
    float s = pow(0.72, k);
    vec2 hs = 0.47 * s * vec2(uRatio, 1.0);
    float fade = smoothstep(0.0, 0.8, k) * smoothstep(9.0, 6.5, k);
    float idx = mod(float(i) + base, 9.0);
    vec3 lc = abs(idx - 3.0) < 0.5 ? uSignal : uPaper;
    float strength = (abs(idx - 3.0) < 0.5 ? 0.85 : 0.38) * (1.0 - uOthers * 0.45);
    col = mix(col, lc, ring(p, hs, 0.0018, soft) * fade * strength);
  }
  // The window at the end of the tunnel.
  float glow = exp(-length(p) * 9.0) * 0.12;
  return col + uPaper * glow;
}

vec2 cover(vec2 uv) {
  vec2 scale = vec2(min(1.0, uRatio / uMapRatio), min(1.0, uMapRatio / uRatio));
  return (uv - 0.5) * scale + 0.5;
}

vec3 sampleAt(vec2 uv, float soft) {
  if (uHasMap > 0.5) return texture2D(uMap, cover(uv), uOthers * 4.0).rgb;
  return art(uv, soft);
}

void main() {
  // Frame opening, mirroring the DOM clip-path reveal.
  vec2 inset = mix(vec2(0.12, 0.16), vec2(0.0), uReveal);
  if (vUv.x < inset.x || vUv.x > 1.0 - inset.x || vUv.y < inset.y || vUv.y > 1.0 - inset.y) discard;

  vec2 uv = (vUv - 0.5) / (mix(1.2, 1.0, uReveal) + uHover * 0.04) + 0.5;

  // Lens under load: barrel distortion from scroll velocity.
  vec2 c = uv - 0.5;
  uv = 0.5 + c * (1.0 - uVelocity * 0.7 * dot(c, c));

  // Hover ripple out from the pointer.
  vec2 toMouse = vUv - uMouse;
  float dm = length(toMouse * vec2(uRatio, 1.0));
  uv += normalize(toMouse + 1e-5) * sin(dm * 34.0 - uTime * 5.0) * exp(-dm * 5.0) * uHover * 0.006;

  float split = abs(uVelocity) * 0.014 + uHover * 0.0025;
  float soft = 0.0025 + uOthers * 0.02;
  vec3 col;
  col.r = sampleAt(uv + vec2(split, 0.0), soft).r;
  col.g = sampleAt(uv, soft).g;
  col.b = sampleAt(uv - vec2(split, 0.0), soft).b;

  col *= mix(1.0, 0.5, uOthers);
  float grain = fract(sin(dot(vUv * uRes + fract(uTime) * 91.0, vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - 0.5) * 0.03;

  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`
