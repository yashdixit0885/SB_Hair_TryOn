// jsdom does not implement getImageData faithfully — Canvas 2D pixel data is
// always zeros. We test the per-pixel HSL helpers directly (the meaningful
// math) and assert the canvas factory returns a canvas of the right
// dimensions. Full per-pixel compositor behavior is exercised by Story 1.7's
// browser-mode tests against a real WebGL/Canvas context.

import { describe, expect, it, vi } from "vitest";
import {
  compositeHslOnly,
  hslToRgb,
  rgbToHsl,
} from "./canvas-2d-fallback";
import type { ColorVector, PorosityProfile } from "./color-shift";

describe("rgbToHsl / hslToRgb round trip", () => {
  it("mid-gray round trips within 1 channel unit", () => {
    const mid = { r: 128, g: 128, b: 128 };
    const back = hslToRgb(rgbToHsl(mid));
    expect(Math.abs(back.r - mid.r)).toBeLessThanOrEqual(1);
    expect(Math.abs(back.g - mid.g)).toBeLessThanOrEqual(1);
    expect(Math.abs(back.b - mid.b)).toBeLessThanOrEqual(1);
  });

  it("pure red maps to hue 0, full saturation", () => {
    const hsl = rgbToHsl({ r: 255, g: 0, b: 0 });
    expect(hsl.s).toBe(1);
    expect(hsl.h).toBeCloseTo(0, 5);
  });

  it("pure green maps to hue 1/3", () => {
    const hsl = rgbToHsl({ r: 0, g: 255, b: 0 });
    expect(hsl.h).toBeCloseTo(1 / 3, 4);
  });
});

describe("compositeHslOnly", () => {
  // Build a tiny fake ImageBitmap-shaped value. The compositor only reads
  // it via drawImage, which jsdom no-ops; we mainly verify the canvas
  // dimensions and that the function does not throw.
  const fakeBitmap = {} as unknown as ImageBitmap;
  const target: ColorVector = { l: 55, a: 30, b: 45 };
  const porosity: PorosityProfile = { type4Bias: 0 };

  it("returns a canvas of the requested dimensions", () => {
    const canvas = compositeHslOnly({
      source: fakeBitmap,
      alphaMask: new Uint8ClampedArray(4),
      width: 2,
      height: 2,
      targetColor: target,
      porosity,
    });
    expect(canvas.width).toBe(2);
    expect(canvas.height).toBe(2);
    expect(canvas).toBeInstanceOf(HTMLCanvasElement);
  });

  it("warns and returns a passthrough canvas when alphaMask length mismatches width × height", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const canvas = compositeHslOnly({
      source: fakeBitmap,
      alphaMask: new Uint8ClampedArray(99),
      width: 10,
      height: 10,
      targetColor: target,
      porosity,
    });
    expect(canvas.width).toBe(10);
    expect(canvas.height).toBe(10);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("alphaMask length"),
    );
    warnSpy.mockRestore();
  });
});
