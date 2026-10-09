// Frame rings: every screen format we make work for, drawn as anti-aliased
// line bands. Geometry is only the border band (8 verts per frame), so the
// fragment cost stays tiny at 4K. Depth of field is a per-frame circle of
// confusion that widens the band's soft edge (no post-processing DOF pass).

export const frameVertex = /* glsl */ `
attribute vec2 aCorner;   // +-0.5 corner of the unit frame
attribute float aSide;    // 0 = outer edge of the band, 1 = inner edge
attribute vec3 aCenter;   // instance: frame centre
attribute vec2 aSize;     // instance: frame width / height
attribute vec3 aJitter;   // instance: z-rotation, x / y offset
attribute float aSeed;    // instance: 0..1
attribute float aSubject; // instance: 1 for the subject frame

uniform float uTime;
uniform float uIntro;
uniform float uSpread;
uniform float uWave;
uniform float uAlign;
uniform float uWorldPerPixel;
uniform float uBaseWidth;
uniform float uFocusDist;
uniform float uAperture;
uniform vec2 uPointer;

varying float vD;
varying float vHalf;
varying float vAA;
varying float vDepth;
varying float vSubject;
varying float vIntro;
varying float vEnergy;

mat2 rot2(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, s, -s, c);
}

void main() {
  float other = 1.0 - aSubject;

  // Video lens: frames align into a cinema strip. 3D Websites lens: frames
  // widen into a room around the camera.
  vec2 size = mix(aSize, vec2(aSize.y * 2.39, aSize.y) * 0.92, uAlign * other);
  size *= 1.0 + uSpread * (0.9 + aSeed * 0.8) * other;

  // Intro: the tunnel assembles itself, frames flying in from depth.
  float t = clamp(uIntro * 1.4 - aSeed * 0.4, 0.0, 1.0);
  float e = 1.0 - pow(1.0 - t, 3.0);
  vec3 center = aCenter;
  center.z = mix(aCenter.z - 26.0 - aSeed * 30.0, aCenter.z, e);
  center.xy += aJitter.yz * (1.0 - uAlign);

  // Motion lens: a staggered wave travels down the tunnel.
  float phase = aCenter.z * 0.38 - uTime * 1.5;
  float angle = aJitter.x * (1.0 - uAlign) + sin(phase) * 0.6 * uWave * other;
  center.z += sin(phase) * 0.45 * uWave * other;
  center.y += cos(phase) * 0.08 * uWave * other;

  vec4 centerMV = modelViewMatrix * vec4(center, 1.0);
  float depth = max(0.04, -centerMV.z);
  float wpp = depth * uWorldPerPixel;
  float coc = clamp(abs(depth - uFocusDist) * uAperture, 0.0, 1.0);
  float halfW = max(uBaseWidth, 0.6 * wpp);
  float aa = wpp * (0.9 + coc * 30.0);
  float band = halfW + aa;
  float off = aSide < 0.5 ? band : -band;

  vec2 local = aCorner * size + sign(aCorner) * off;
  local = rot2(angle) * local;
  float lean = (local.x * uPointer.x + local.y * uPointer.y) * 0.06 * other;

  vD = off;
  vHalf = halfW;
  vAA = aa;
  vDepth = depth;
  vSubject = aSubject;
  vIntro = e;
  vEnergy = halfW / (halfW + coc * aa * 0.35);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(center + vec3(local, lean), 1.0);
}
`

export const frameFragment = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uSignal;
uniform float uLock;
uniform float uDim;
uniform float uFogNear;
uniform float uFogFar;

varying float vD;
varying float vHalf;
varying float vAA;
varying float vDepth;
varying float vSubject;
varying float vIntro;
varying float vEnergy;

void main() {
  float a = 1.0 - smoothstep(vHalf - vAA * 0.35, vHalf + vAA, abs(vD));
  a *= vEnergy;
  a *= 1.0 - smoothstep(uFogNear, uFogFar, vDepth);
  a *= smoothstep(0.08, 0.7, vDepth);
  a *= vIntro * mix(0.8, 1.0, vSubject) * (1.0 - uDim * 0.82);
  if (a < 0.004) discard;
  gl_FragColor = vec4(mix(uColor, uSignal, vSubject * uLock), a);
  #include <colorspace_fragment>
}
`
