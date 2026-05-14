// AR pipeline — lighting post-process (AR5 + UX FR4).
// Story 1.9 (`LightingToggle`) caches `(color × lighting) → vector` pairs to
// stay under NFR3's ≤100ms toggle response budget; this module ships the
// math + calibration table only.

import {
  type ColorVector,
  labToRgb,
  rgbToLab,
} from "./color-shift";

export type LightingPreset = "indoor" | "daylight" | "salon";

interface LightingCalibration {
  /** Color temperature in Kelvin — drives the white-balance offset shape. */
  colorTempK: number;
  /** Additive RGB offset (each channel -1..1 in normalized space). Small. */
  whiteBalanceOffset: { r: number; g: number; b: number };
  /** Gamma curve applied after WB. 1.0 = identity. */
  gamma: number;
}

/** Calibration table — starting values from standard photography color
 *  temperatures. Designer review during Story 1.9 polishes the perceptually-
 *  right calibration; for Story 1.5 we ship a defensible default. */
export const LIGHTING_CALIBRATION: Record<LightingPreset, LightingCalibration> = {
  // Indoor incandescent ~3200K — warm, slight gamma compression.
  indoor: {
    colorTempK: 3200,
    whiteBalanceOffset: { r: 0.06, g: 0.01, b: -0.05 },
    gamma: 0.95,
  },
  // Daylight ~5500K — neutral baseline.
  daylight: {
    colorTempK: 5500,
    whiteBalanceOffset: { r: 0.0, g: 0.0, b: 0.0 },
    gamma: 1.0,
  },
  // Salon overhead ~4500K — slightly cool, slight gamma stretch.
  salon: {
    colorTempK: 4500,
    whiteBalanceOffset: { r: -0.04, g: 0.0, b: 0.05 },
    gamma: 1.05,
  },
};

/**
 * Applies the named preset to a Lab source color, returning a new Lab
 * vector. Pure — Story 1.9 caches results, not this function.
 *
 * `daylight` is the neutral baseline (5500K, zero WB offset, gamma 1.0) and
 * is fast-pathed to return `source` unchanged so it round-trip-exactly,
 * not approximately. Without this fast path, the Lab→RGB→Lab pipeline +
 * `Math.round` quantization drifts ±1 channel even with identity calibration,
 * which would visibly differ between "no toggle" and "daylight selected" in
 * Story 1.9's cached output.
 */
export function applyLightingPreset(
  source: ColorVector,
  preset: LightingPreset,
): ColorVector {
  if (preset === "daylight") return source;
  const calibration = LIGHTING_CALIBRATION[preset];
  // Convert Lab → sRGB, apply WB + gamma in sRGB space, convert back to Lab.
  // Story 1.5 ships the math; full per-pixel WebGL shader stays in Story 1.9.
  const rgb = labToRgb(source);
  const wb = {
    r: clamp01(rgb.r / 255 + calibration.whiteBalanceOffset.r),
    g: clamp01(rgb.g / 255 + calibration.whiteBalanceOffset.g),
    b: clamp01(rgb.b / 255 + calibration.whiteBalanceOffset.b),
  };
  const corrected = {
    r: Math.round(Math.pow(wb.r, calibration.gamma) * 255),
    g: Math.round(Math.pow(wb.g, calibration.gamma) * 255),
    b: Math.round(Math.pow(wb.b, calibration.gamma) * 255),
  };
  return rgbToLab(corrected);
}

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}
