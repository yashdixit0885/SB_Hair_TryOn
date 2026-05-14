import { describe, expect, it } from "vitest";
import { noopArProvider } from "./noop-ar-provider";

describe("noopArProvider", () => {
  it("satisfies the ARProvider contract structurally", () => {
    const ar = noopArProvider();
    expect(typeof ar.prewarm).toBe("function");
    expect(typeof ar.segment).toBe("function");
    expect(typeof ar.dispose).toBe("function");
    expect(ar.prewarm()).toBeInstanceOf(Promise);
    expect(ar.dispose()).toBeInstanceOf(Promise);
  });

  it("returns a full-coverage mask at the requested dimensions", async () => {
    const ar = noopArProvider({ width: 4, height: 4 });
    const out = await ar.segment({} as ImageBitmap);
    expect(out.width).toBe(4);
    expect(out.height).toBe(4);
    expect(out.alphaMask.length).toBe(16);
    expect(Array.from(out.alphaMask).every((v) => v === 255)).toBe(true);
    expect(out.confidence).toBe(1);
  });

  it("accepts a custom confidence value (for fallback-path tests)", async () => {
    const ar = noopArProvider({ confidence: 0.2 });
    const out = await ar.segment({} as ImageBitmap);
    expect(out.confidence).toBe(0.2);
  });

  it("each segment() call returns a fresh alphaMask — caller mutations don't leak", async () => {
    const ar = noopArProvider({ width: 2, height: 2 });
    const first = await ar.segment({} as ImageBitmap);
    first.alphaMask[0] = 0;
    const second = await ar.segment({} as ImageBitmap);
    expect(second.alphaMask[0]).toBe(255);
  });
});
