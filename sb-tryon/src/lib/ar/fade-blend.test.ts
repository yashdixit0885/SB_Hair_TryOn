import { describe, expect, it } from "vitest";
import type { ColorVector } from "./color-shift";
import { blendAtWeek } from "./fade-blend";

const startColor: ColorVector = { l: 55, a: 30, b: 45 };
const endColor: ColorVector = { l: 70, a: 5, b: 10 };

describe("blendAtWeek", () => {
  it("week 0 returns startColor exactly", () => {
    const out = blendAtWeek({ startColor, endColor, weekIndex: 0, washesPerWeek: 2 });
    expect(out.l).toBeCloseTo(startColor.l, 6);
    expect(out.a).toBeCloseTo(startColor.a, 6);
    expect(out.b).toBeCloseTo(startColor.b, 6);
  });

  it("week 90 with 4 washes/week is very close to endColor", () => {
    const out = blendAtWeek({ startColor, endColor, weekIndex: 90, washesPerWeek: 4 });
    expect(Math.abs(out.l - endColor.l)).toBeLessThan(0.001);
    expect(Math.abs(out.a - endColor.a)).toBeLessThan(0.001);
    expect(Math.abs(out.b - endColor.b)).toBeLessThan(0.001);
  });

  it("is monotonic in weekIndex (later week → closer to endColor)", () => {
    const distances = [0, 4, 8, 12, 24].map((w) => {
      const c = blendAtWeek({ startColor, endColor, weekIndex: w, washesPerWeek: 2 });
      return Math.sqrt(
        (c.l - endColor.l) ** 2 +
          (c.a - endColor.a) ** 2 +
          (c.b - endColor.b) ** 2,
      );
    });
    for (let i = 1; i < distances.length; i++) {
      expect(distances[i]).toBeLessThan(distances[i - 1]);
    }
  });

  it("is monotonic in washesPerWeek (more washes → faster fade)", () => {
    const week = 4;
    const distances = ([1, 2, 3, 4] as const).map((wpw) => {
      const c = blendAtWeek({
        startColor,
        endColor,
        weekIndex: week,
        washesPerWeek: wpw,
      });
      return Math.sqrt(
        (c.l - endColor.l) ** 2 +
          (c.a - endColor.a) ** 2 +
          (c.b - endColor.b) ** 2,
      );
    });
    for (let i = 1; i < distances.length; i++) {
      expect(distances[i]).toBeLessThan(distances[i - 1]);
    }
  });

  it("hits ~60% fade at week 8 with 2 washes/week (designer reference point)", () => {
    const out = blendAtWeek({ startColor, endColor, weekIndex: 8, washesPerWeek: 2 });
    // Compute fade fraction by inverse lerp on L channel (any one of the three works).
    const fraction = (out.l - startColor.l) / (endColor.l - startColor.l);
    expect(fraction).toBeGreaterThan(0.5);
    expect(fraction).toBeLessThan(0.75);
  });

  it("clamps negative weekIndex to 0 (returns startColor)", () => {
    const out = blendAtWeek({ startColor, endColor, weekIndex: -5, washesPerWeek: 2 });
    expect(out.l).toBeCloseTo(startColor.l, 6);
  });

  it("coerces NaN weekIndex to 0 (returns startColor, not NaN Lab)", () => {
    const out = blendAtWeek({ startColor, endColor, weekIndex: NaN, washesPerWeek: 2 });
    expect(out.l).toBeCloseTo(startColor.l, 6);
    expect(Number.isNaN(out.l)).toBe(false);
    expect(Number.isNaN(out.a)).toBe(false);
    expect(Number.isNaN(out.b)).toBe(false);
  });
});
