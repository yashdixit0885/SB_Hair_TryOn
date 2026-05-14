import { describe, expect, it } from "vitest";
import { labToRgb, rgbToLab, type ColorVector } from "./color-shift";
import {
  LIGHTING_CALIBRATION,
  applyLightingPreset,
} from "./lighting-postprocess";

const source: ColorVector = rgbToLab({ r: 180, g: 140, b: 100 });

describe("applyLightingPreset", () => {
  it("daylight is an exact identity (fast-pathed to return source unchanged)", () => {
    const out = applyLightingPreset(source, "daylight");
    expect(out.l).toBe(source.l);
    expect(out.a).toBe(source.a);
    expect(out.b).toBe(source.b);
  });

  it("indoor shifts toward warm (R up, B down) versus source", () => {
    const sourceRgb = labToRgb(source);
    const out = applyLightingPreset(source, "indoor");
    const outRgb = labToRgb(out);
    expect(outRgb.r).toBeGreaterThanOrEqual(sourceRgb.r);
    expect(outRgb.b).toBeLessThan(sourceRgb.b);
  });

  it("salon shifts toward cool (R down, B up) versus source", () => {
    const sourceRgb = labToRgb(source);
    const out = applyLightingPreset(source, "salon");
    const outRgb = labToRgb(out);
    expect(outRgb.r).toBeLessThan(sourceRgb.r);
    expect(outRgb.b).toBeGreaterThanOrEqual(sourceRgb.b);
  });
});

describe("LIGHTING_CALIBRATION", () => {
  it("exposes all three presets with a colorTempK, whiteBalanceOffset, and gamma", () => {
    for (const preset of ["indoor", "daylight", "salon"] as const) {
      const c = LIGHTING_CALIBRATION[preset];
      expect(typeof c.colorTempK).toBe("number");
      expect(c.colorTempK).toBeGreaterThan(2000);
      expect(c.colorTempK).toBeLessThan(7000);
      expect(typeof c.whiteBalanceOffset.r).toBe("number");
      expect(typeof c.whiteBalanceOffset.g).toBe("number");
      expect(typeof c.whiteBalanceOffset.b).toBe("number");
      expect(c.gamma).toBeGreaterThan(0);
    }
  });

  it("indoor is warmer than daylight which is warmer than salon", () => {
    expect(LIGHTING_CALIBRATION.indoor.colorTempK).toBeLessThan(
      LIGHTING_CALIBRATION.salon.colorTempK,
    );
    expect(LIGHTING_CALIBRATION.salon.colorTempK).toBeLessThan(
      LIGHTING_CALIBRATION.daylight.colorTempK,
    );
  });
});
