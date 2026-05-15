import { describe, expect, it } from "vitest";
import { resolveColor, COLOR_CATALOG } from "./color-catalog";

describe("resolveColor", () => {
  it("returns a non-null entry for 'auburn'", () => {
    const entry = resolveColor("auburn");
    expect(entry).not.toBeNull();
    expect(entry).toHaveProperty("startColor");
    expect(entry).toHaveProperty("endColor");
  });

  it("returns null for unknown color IDs", () => {
    expect(resolveColor("nonexistent")).toBeNull();
    expect(resolveColor("")).toBeNull();
  });

  it("covers all 8 catalog slugs", () => {
    const slugs = Object.keys(COLOR_CATALOG);
    expect(slugs).toHaveLength(8);
    for (const slug of slugs) {
      const entry = resolveColor(slug);
      expect(entry).not.toBeNull();
      expect(typeof entry?.startColor.l).toBe("number");
      expect(typeof entry?.endColor.l).toBe("number");
    }
  });

  it("each entry has valid Lab-range values", () => {
    for (const [, entry] of Object.entries(COLOR_CATALOG)) {
      expect(entry.startColor.l).toBeGreaterThanOrEqual(0);
      expect(entry.startColor.l).toBeLessThanOrEqual(100);
      expect(entry.endColor.l).toBeGreaterThanOrEqual(0);
      expect(entry.endColor.l).toBeLessThanOrEqual(100);
    }
  });
});
