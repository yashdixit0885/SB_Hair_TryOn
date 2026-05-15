import type { ColorVector } from "./color-shift";

export interface ColorEntry {
  startColor: ColorVector; // fresh-from-salon
  endColor: ColorVector;   // fully faded (~90 days, 2 washes/week)
}

export const COLOR_CATALOG: Record<string, ColorEntry> = {
  "auburn":        { startColor: { l: 35, a: 20, b: 15 }, endColor: { l: 48, a: 10, b: 12 } },
  "bronde":        { startColor: { l: 40, a: 10, b: 18 }, endColor: { l: 52, a:  5, b: 14 } },
  "honey-blonde":  { startColor: { l: 65, a: 10, b: 35 }, endColor: { l: 72, a:  5, b: 22 } },
  "espresso":      { startColor: { l: 22, a:  8, b:  8 }, endColor: { l: 30, a:  4, b:  6 } },
  "warm-copper":   { startColor: { l: 42, a: 28, b: 22 }, endColor: { l: 54, a: 14, b: 16 } },
  "ash-brown":     { startColor: { l: 38, a:  2, b:  5 }, endColor: { l: 46, a:  1, b:  3 } },
  "vivid-red":     { startColor: { l: 38, a: 40, b: 25 }, endColor: { l: 48, a: 20, b: 15 } },
  "jet-black":     { startColor: { l: 12, a:  2, b:  2 }, endColor: { l: 18, a:  1, b:  1 } },
};

export function resolveColor(colorId: string): ColorEntry | null {
  return COLOR_CATALOG[colorId] ?? null;
}
