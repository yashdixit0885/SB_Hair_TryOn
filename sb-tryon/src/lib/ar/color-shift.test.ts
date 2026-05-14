import { describe, expect, it } from "vitest";
import {
  type ColorVector,
  RENDER_CONFIDENCE_THRESHOLD,
  labToRgb,
  rgbToLab,
  shiftPixel,
} from "./color-shift";

describe("color-shift", () => {
  describe("rgbToLab / labToRgb round trip", () => {
    it("mid-gray round trips within 1 channel unit", () => {
      const mid = { r: 128, g: 128, b: 128 };
      const lab = rgbToLab(mid);
      const back = labToRgb(lab);
      expect(Math.abs(back.r - mid.r)).toBeLessThanOrEqual(1);
      expect(Math.abs(back.g - mid.g)).toBeLessThanOrEqual(1);
      expect(Math.abs(back.b - mid.b)).toBeLessThanOrEqual(1);
    });

    it("pure red has high a* and near-zero b deviation toward red axis", () => {
      const lab = rgbToLab({ r: 255, g: 0, b: 0 });
      expect(lab.a).toBeGreaterThan(70);
      expect(lab.l).toBeGreaterThan(40);
      expect(lab.l).toBeLessThan(60);
    });
  });

  describe("shiftPixel", () => {
    const neutralTarget: ColorVector = rgbToLab({ r: 128, g: 128, b: 128 });

    it("identity-shift: mid-gray toward mid-gray target returns near-source", () => {
      const out = shiftPixel(
        { r: 128, g: 128, b: 128 },
        neutralTarget,
        { type4Bias: 0 },
      );
      expect(Math.abs(out.r - 128)).toBeLessThanOrEqual(2);
      expect(Math.abs(out.g - 128)).toBeLessThanOrEqual(2);
      expect(Math.abs(out.b - 128)).toBeLessThanOrEqual(2);
    });

    it("mid-gray shifted toward warm copper produces a copper-ish output", () => {
      // Copper: roughly L=55, a=+30, b=+45 (orange-warm)
      const copper: ColorVector = { l: 55, a: 30, b: 45 };
      const out = shiftPixel(
        { r: 128, g: 128, b: 128 },
        copper,
        { type4Bias: 0 },
      );
      // R should be strongly highest channel for a warm shift.
      expect(out.r).toBeGreaterThan(out.g);
      expect(out.g).toBeGreaterThan(out.b);
    });

    it("type4Bias=1 produces a measurably different output than type4Bias=0", () => {
      // Pick a non-neutral target so chroma lift is observable.
      const copper: ColorVector = { l: 55, a: 30, b: 45 };
      const source = { r: 128, g: 128, b: 128 };
      const noBias = shiftPixel(source, copper, { type4Bias: 0 });
      const fullBias = shiftPixel(source, copper, { type4Bias: 1 });
      const distance = Math.sqrt(
        (noBias.r - fullBias.r) ** 2 +
          (noBias.g - fullBias.g) ** 2 +
          (noBias.b - fullBias.b) ** 2,
      );
      expect(distance).toBeGreaterThan(5);
    });

    it("preserves source luminance variation (darker source → darker output)", () => {
      const copper: ColorVector = { l: 55, a: 30, b: 45 };
      const dark = shiftPixel({ r: 60, g: 60, b: 60 }, copper, { type4Bias: 0 });
      const light = shiftPixel({ r: 200, g: 200, b: 200 }, copper, { type4Bias: 0 });
      // Average channel value should track source brightness.
      const avg = (px: { r: number; g: number; b: number }) =>
        (px.r + px.g + px.b) / 3;
      expect(avg(dark)).toBeLessThan(avg(light));
    });
  });

  describe("NaN guards", () => {
    it("NaN target Lab → returns clamped/zero output, not NaN", () => {
      const out = shiftPixel(
        { r: 128, g: 128, b: 128 },
        { l: NaN, a: NaN, b: NaN },
        { type4Bias: 0 },
      );
      expect(Number.isNaN(out.r)).toBe(false);
      expect(Number.isNaN(out.g)).toBe(false);
      expect(Number.isNaN(out.b)).toBe(false);
    });

    it("low-L Lab (L=0) does not produce NaN", () => {
      const rgb = labToRgb({ l: 0, a: 0, b: 0 });
      expect(Number.isNaN(rgb.r)).toBe(false);
      expect(Number.isNaN(rgb.g)).toBe(false);
      expect(Number.isNaN(rgb.b)).toBe(false);
    });
  });

  describe("RENDER_CONFIDENCE_THRESHOLD", () => {
    it("is a number in (0, 1)", () => {
      expect(typeof RENDER_CONFIDENCE_THRESHOLD).toBe("number");
      expect(RENDER_CONFIDENCE_THRESHOLD).toBeGreaterThan(0);
      expect(RENDER_CONFIDENCE_THRESHOLD).toBeLessThan(1);
    });
  });
});
