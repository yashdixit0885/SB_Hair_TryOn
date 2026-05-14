// AR pipeline — color shift math (AR5). Pure functions, no DOM, no WebGL.
// Source-of-truth Lab representation; sRGB↔linear↔Lab conversions at the
// boundary. Story 1.7 (`ColorRender`) plugs the WebGL2 shader path
// (`./color-shift.glsl`) for per-pixel work; tests + the Canvas 2D fallback
// (`./canvas-2d-fallback`) call `shiftPixel` directly.

/** Color in CIE Lab space. L 0..100, a/b roughly -128..127. */
export interface ColorVector {
  l: number;
  a: number;
  b: number;
}

/** Per-pixel porosity hint. Type-4 hair tends to absorb more chroma than
 *  Type-1 hair; passing `type4Bias > 0` lifts the chroma weight on the shift
 *  so Type-4 renders read closer to the swatch. Story 1.5 callers pass
 *  `0` unconditionally; texture-aware wiring lands in a future story. */
export interface PorosityProfile {
  /** 0 = baseline (Type 1/2 straight); 1 = max (Type 4 coily). */
  type4Bias: number;
}

/** Threshold below which `<ColorRender>` (Story 1.7) routes the render to
 *  `<DemoFallbackPath>` (UX honesty pattern #2). Single source of truth —
 *  pure-math callers and the React component must both import from here.
 *  Tuned during demo dry-run; revisit once the Type-4 fixture set lands. */
export const RENDER_CONFIDENCE_THRESHOLD = 0.55;

// sRGB ↔ linear ----------------------------------------------------------

function srgbChannelToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearChannelToSrgb(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

// linear-RGB → CIE XYZ (D65) ---------------------------------------------

function linearRgbToXyz(r: number, g: number, b: number): [number, number, number] {
  return [
    r * 0.4124564 + g * 0.3575761 + b * 0.1804375,
    r * 0.2126729 + g * 0.7151522 + b * 0.072175,
    r * 0.0193339 + g * 0.119192 + b * 0.9503041,
  ];
}

function xyzToLinearRgb(x: number, y: number, z: number): [number, number, number] {
  return [
    x * 3.2404542 + y * -1.5371385 + z * -0.4985314,
    x * -0.969266 + y * 1.8760108 + z * 0.041556,
    x * 0.0556434 + y * -0.2040259 + z * 1.0572252,
  ];
}

// XYZ ↔ Lab (D65 reference white) ----------------------------------------

const XN = 0.95047;
const YN = 1.0;
const ZN = 1.08883;

function f(t: number): number {
  return t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
}

function fInverse(t: number): number {
  const t3 = t * t * t;
  return t3 > 0.008856 ? t3 : (t - 16 / 116) / 7.787;
}

function xyzToLab(x: number, y: number, z: number): ColorVector {
  const fx = f(x / XN);
  const fy = f(y / YN);
  const fz = f(z / ZN);
  return {
    l: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  };
}

function labToXyz(lab: ColorVector): [number, number, number] {
  const fy = (lab.l + 16) / 116;
  const fx = lab.a / 500 + fy;
  const fz = fy - lab.b / 200;
  return [XN * fInverse(fx), YN * fInverse(fy), ZN * fInverse(fz)];
}

// Public API -------------------------------------------------------------

/** Convert an sRGB pixel (0-255) to Lab. */
export function rgbToLab(rgb: { r: number; g: number; b: number }): ColorVector {
  const rLin = srgbChannelToLinear(rgb.r / 255);
  const gLin = srgbChannelToLinear(rgb.g / 255);
  const bLin = srgbChannelToLinear(rgb.b / 255);
  const [x, y, z] = linearRgbToXyz(rLin, gLin, bLin);
  return xyzToLab(x, y, z);
}

/** Convert Lab back to sRGB (0-255, clamped). */
export function labToRgb(lab: ColorVector): { r: number; g: number; b: number } {
  const [x, y, z] = labToXyz(lab);
  const [rLin, gLin, bLin] = xyzToLinearRgb(x, y, z);
  const r = clamp01(linearChannelToSrgb(rLin));
  const g = clamp01(linearChannelToSrgb(gLin));
  const b = clamp01(linearChannelToSrgb(bLin));
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function clamp01(v: number): number {
  // Treat NaN as 0 so a bad upstream value (negative-L Lab, NaN target,
  // NaN porosity) clamps to black rather than propagating NaN downstream
  // into ImageData writes (which coerce NaN to 0 but only after every
  // subsequent math op has also produced NaN — making bugs hard to locate).
  if (Number.isNaN(v)) return 0;
  return Math.min(1, Math.max(0, v));
}

/**
 * Shift one sRGB pixel toward a target Lab color, preserving the source's
 * luminance variation so the recolor reads as natural hair texture, not a
 * flat paint fill.
 *
 * The L channel of the source is retained verbatim; only a/b move toward
 * the target's a/b. With `porosity.type4Bias > 0`, the chroma component
 * receives extra weight (chroma = √(a² + b²)); Type-4 hair absorbs more
 * pigment, so the rendered chroma needs to push past the source's
 * unmodified chroma to read accurately on coily textures.
 */
export function shiftPixel(
  source: { r: number; g: number; b: number },
  target: ColorVector,
  porosity: PorosityProfile,
): { r: number; g: number; b: number } {
  const sourceLab = rgbToLab(source);

  // Base shift: keep source L, take target a/b directly.
  let a = target.a;
  let b = target.b;

  if (porosity.type4Bias > 0) {
    const targetChroma = Math.sqrt(target.a * target.a + target.b * target.b);
    const targetAngle = Math.atan2(target.b, target.a);
    // Push chroma 0..40% further along the target's hue axis at type4Bias=1.
    const lift = 1 + 0.4 * porosity.type4Bias;
    const newChroma = targetChroma * lift;
    a = Math.cos(targetAngle) * newChroma;
    b = Math.sin(targetAngle) * newChroma;
  }

  return labToRgb({ l: sourceLab.l, a, b });
}
