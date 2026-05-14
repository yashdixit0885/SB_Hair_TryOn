import { describe, expect, it } from "vitest";
import { COLOR_SHIFT_FRAGMENT_SHADER } from "./color-shift.glsl";

describe("COLOR_SHIFT_FRAGMENT_SHADER", () => {
  it("is a non-empty string", () => {
    expect(typeof COLOR_SHIFT_FRAGMENT_SHADER).toBe("string");
    expect(COLOR_SHIFT_FRAGMENT_SHADER.length).toBeGreaterThan(100);
  });

  it("declares GLSL ES 3.00 (not the WebGL1 #version 100)", () => {
    expect(COLOR_SHIFT_FRAGMENT_SHADER).toContain("#version 300 es");
    expect(COLOR_SHIFT_FRAGMENT_SHADER).not.toContain("#version 100");
  });

  it("contains a void main() entry point", () => {
    expect(COLOR_SHIFT_FRAGMENT_SHADER).toContain("void main()");
  });

  it("samples both source and mask textures", () => {
    expect(COLOR_SHIFT_FRAGMENT_SHADER).toContain("uniform sampler2D uSource");
    expect(COLOR_SHIFT_FRAGMENT_SHADER).toContain("uniform sampler2D uMask");
  });

  it("exposes target color and porosity as uniforms", () => {
    expect(COLOR_SHIFT_FRAGMENT_SHADER).toContain("uniform vec3 uTargetLab");
    expect(COLOR_SHIFT_FRAGMENT_SHADER).toContain("uniform float uPorosity");
  });
});
