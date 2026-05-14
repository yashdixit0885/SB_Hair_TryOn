// AR pipeline — Canvas 2D CPU fallback (AR5).
// Used by `<ColorRender>` (Story 1.7) when `getWebGL2Context` returns null.
// HSL-only color shift per AR5 (Lab path is WebGL-only — too slow per-pixel
// on CPU for the demo budget).

import type { ColorVector, PorosityProfile } from "./color-shift";
import { labToRgb } from "./color-shift";

interface CompositeArgs {
  source: ImageBitmap;
  alphaMask: Uint8ClampedArray;
  width: number;
  height: number;
  targetColor: ColorVector;
  porosity: PorosityProfile;
}

/**
 * Composites a recolored image on the CPU. Slower and lower-fidelity than
 * the WebGL2 path — used only when WebGL2 is unavailable. Returns an
 * off-screen canvas ready to be drawn into the visible canvas by
 * `<ColorRender>`.
 */
export function compositeHslOnly(args: CompositeArgs): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = args.width;
  canvas.height = args.height;
  // Mismatched mask vs canvas dims silently produced black output before
  // this guard — out-of-range Uint8ClampedArray writes are no-ops and the
  // downstream HSL conversion of `undefined` channels yields NaN → 0.
  if (args.alphaMask.length !== args.width * args.height) {
    console.warn(
      `[canvas-2d-fallback] alphaMask length ${args.alphaMask.length} does not match ${args.width}×${args.height} = ${args.width * args.height}; returning passthrough canvas.`,
    );
    return canvas;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    // Browsers without 2D contexts are not a real concern — but we don't
    // crash; the empty canvas is a visible "no render" failure mode that
    // `<ColorRender>` will catch via its onError flow.
    return canvas;
  }

  ctx.drawImage(args.source, 0, 0, args.width, args.height);
  const imageData = ctx.getImageData(0, 0, args.width, args.height);
  const data = imageData.data;

  // Convert target Lab → target HSL once (HSL is what we drive in the CPU path).
  const targetRgb = labToRgb(args.targetColor);
  const targetHsl = rgbToHsl(targetRgb);
  // Type-4 bias bumps saturation only (cheaper than the Lab chroma lift on CPU).
  const targetSaturation = clamp01(
    targetHsl.s * (1 + 0.4 * args.porosity.type4Bias),
  );

  for (let i = 0; i < args.alphaMask.length; i++) {
    if (args.alphaMask[i] !== 255) continue;
    const px = i * 4;
    const sourcePixel = { r: data[px], g: data[px + 1], b: data[px + 2] };
    const sourceHsl = rgbToHsl(sourcePixel);
    // Keep source lightness (texture variation); swap hue + saturation.
    const shifted = hslToRgb({
      h: targetHsl.h,
      s: targetSaturation,
      l: sourceHsl.l,
    });
    data[px] = shifted.r;
    data[px + 1] = shifted.g;
    data[px + 2] = shifted.b;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

interface Hsl {
  h: number; // 0..1
  s: number; // 0..1
  l: number; // 0..1
}

/** Exposed for unit testing under jsdom (where Canvas 2D is unreliable). */
export function rgbToHsl(rgb: { r: number; g: number; b: number }): Hsl {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  switch (max) {
    case r:
      h = (g - b) / d + (g < b ? 6 : 0);
      break;
    case g:
      h = (b - r) / d + 2;
      break;
    default:
      h = (r - g) / d + 4;
  }
  return { h: h / 6, s, l };
}

/** Exposed for unit testing under jsdom (where Canvas 2D is unreliable). */
export function hslToRgb(hsl: Hsl): { r: number; g: number; b: number } {
  const { h, s, l } = hsl;
  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: Math.round(hueToRgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hueToRgb(p, q, h) * 255),
    b: Math.round(hueToRgb(p, q, h - 1 / 3) * 255),
  };
}

function hueToRgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function clamp01(v: number): number {
  if (Number.isNaN(v)) return 0;
  return Math.min(1, Math.max(0, v));
}
