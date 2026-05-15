// WebGL2 fragment shader for the AR color-shift pass (AR5).
// Story 1.7 (`ColorRender`) compiles this against the WebGL2 context returned
// by `./webgl-context`. Story 1.5 only ships the source as a string — full
// shader execution is exercised by browser-mode tests in Story 1.7.
//
// Uniforms:
//   uSource     : sampler2D — source RGB texture (the input photo)
//   uMask       : sampler2D — alpha mask (the segmentation output; 1.0 = hair)
//   uTargetLab  : vec3      — target color in Lab (L 0-100, a/b roughly -128..127)
//   uPorosity   : float     — 0..1, lifts chroma weight on Type-4 textures

export const COLOR_SHIFT_VERTEX_SHADER: string = /* glsl */ `#version 300 es
in vec2 aPosition;
out vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

export const COLOR_SHIFT_FRAGMENT_SHADER: string = /* glsl */ `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uSource;
uniform sampler2D uMask;
uniform vec3 uTargetLab;
uniform float uPorosity;

const mat3 RGB_TO_XYZ = mat3(
  0.4124564, 0.2126729, 0.0193339,
  0.3575761, 0.7151522, 0.119192,
  0.1804375, 0.072175,  0.9503041
);

const mat3 XYZ_TO_RGB = mat3(
   3.2404542, -0.969266,   0.0556434,
  -1.5371385,  1.8760108, -0.2040259,
  -0.4985314,  0.041556,   1.0572252
);

const vec3 D65 = vec3(0.95047, 1.0, 1.08883);

float srgbToLinearChannel(float c) {
  return c <= 0.04045 ? c / 12.92 : pow((c + 0.055) / 1.055, 2.4);
}

float linearToSrgbChannel(float c) {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * pow(c, 1.0 / 2.4) - 0.055;
}

vec3 srgbToLinear(vec3 c) {
  return vec3(srgbToLinearChannel(c.r), srgbToLinearChannel(c.g), srgbToLinearChannel(c.b));
}

vec3 linearToSrgb(vec3 c) {
  return vec3(linearToSrgbChannel(c.r), linearToSrgbChannel(c.g), linearToSrgbChannel(c.b));
}

float labF(float t) {
  return t > 0.008856 ? pow(t, 1.0 / 3.0) : 7.787 * t + 16.0 / 116.0;
}

float labFInverse(float t) {
  float t3 = t * t * t;
  return t3 > 0.008856 ? t3 : (t - 16.0 / 116.0) / 7.787;
}

vec3 rgbToLab(vec3 rgb) {
  vec3 lin = srgbToLinear(rgb);
  vec3 xyz = RGB_TO_XYZ * lin;
  vec3 f = vec3(labF(xyz.x / D65.x), labF(xyz.y / D65.y), labF(xyz.z / D65.z));
  return vec3(116.0 * f.y - 16.0, 500.0 * (f.x - f.y), 200.0 * (f.y - f.z));
}

vec3 labToRgb(vec3 lab) {
  float fy = (lab.x + 16.0) / 116.0;
  float fx = lab.y / 500.0 + fy;
  float fz = fy - lab.z / 200.0;
  vec3 xyz = vec3(D65.x * labFInverse(fx), D65.y * labFInverse(fy), D65.z * labFInverse(fz));
  vec3 lin = XYZ_TO_RGB * xyz;
  return clamp(linearToSrgb(lin), 0.0, 1.0);
}

void main() {
  vec4 source = texture(uSource, vUv);
  float maskAlpha = texture(uMask, vUv).r;

  vec3 sourceLab = rgbToLab(source.rgb);

  // Keep source L (luminance variation = hair texture); take target a/b.
  float a = uTargetLab.y;
  float b = uTargetLab.z;

  if (uPorosity > 0.0) {
    float chroma = length(vec2(a, b));
    float angle = atan(b, a);
    float lift = 1.0 + 0.4 * uPorosity;
    chroma *= lift;
    a = cos(angle) * chroma;
    b = sin(angle) * chroma;
  }

  vec3 shifted = labToRgb(vec3(sourceLab.x, a, b));

  // Blend shifted into source by the mask: hair pixels = recolored,
  // everything else = original pixel passes through.
  vec3 outColor = mix(source.rgb, shifted, maskAlpha);
  fragColor = vec4(outColor, source.a);
}
`;
