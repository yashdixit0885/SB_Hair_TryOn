// AR pipeline — fade interpolation (AR5).
// Story 1.8 (`FadeSimulator`) drives the slider (UX-DR4: 0-90 day timeline,
// 1/2/3/4 washes/week). This module ships the math; the React component
// owns scrub UX + 60fps performance budget (NFR2).

import type { ColorVector } from "./color-shift";

/** Decay constant tuned so `fadeFraction ≈ 0.6` at week 8 / 2 washes per week
 *  (the median Maya scenario; perceptually-meaningful UX-DR4 milestone). */
const FADE_DECAY_K = 18;

export interface FadeParams {
  /** Week 0: freshly-applied color. */
  startColor: ColorVector;
  /** Week 12: fully-faded color (brand-published when known, model-derived
   *  otherwise). */
  endColor: ColorVector;
  /** 0..90 (UX-DR4 calls for a day-granularity slider over a 90-day window;
   *  this module operates in weeks for simplicity — pass `day / 7`). */
  weekIndex: number;
  /** Discrete options per UX-DR4. */
  washesPerWeek: 1 | 2 | 3 | 4;
}

/**
 * Returns the Lab color at the requested week index, interpolating between
 * `startColor` and `endColor` along an exponential-decay shape. Pure and
 * cheap — a few floating-point ops per call. Story 1.8 calls this per
 * scrub-frame.
 */
export function blendAtWeek(params: FadeParams): ColorVector {
  // Coerce NaN to 0 so an upstream date-diff producing NaN doesn't render
  // hair as all-NaN (which downstream silently becomes black).
  const safeWeek = Number.isNaN(params.weekIndex) ? 0 : params.weekIndex;
  const cumulativeWashes = Math.max(0, safeWeek) * params.washesPerWeek;
  const fadeFraction = 1 - Math.exp(-cumulativeWashes / FADE_DECAY_K);
  return lerp(params.startColor, params.endColor, fadeFraction);
}

function lerp(a: ColorVector, b: ColorVector, t: number): ColorVector {
  return {
    l: a.l + (b.l - a.l) * t,
    a: a.a + (b.a - a.a) * t,
    b: a.b + (b.b - a.b) * t,
  };
}
