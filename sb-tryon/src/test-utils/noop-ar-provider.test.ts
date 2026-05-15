import { describe, expect, it } from "vitest";
import { noopArProvider } from "./noop-ar-provider";

describe("noopArProvider", () => {
  it("satisfies the ARProvider contract structurally", () => {
    const ar = noopArProvider();
    expect(typeof ar.prewarm).toBe("function");
    expect(typeof ar.segment).toBe("function");
    expect(typeof ar.detectFace).toBe("function");
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

  it("detectFace() returns faceDetected=true by default", async () => {
    const ar = noopArProvider();
    const result = await ar.detectFace({} as ImageBitmap);
    expect(result.faceDetected).toBe(true);
    expect(result.confidence).toBe(1);
  });

  it("detectFace() respects the faceDetected: false option (error-state harness)", async () => {
    const ar = noopArProvider({ faceDetected: false });
    const result = await ar.detectFace({} as ImageBitmap);
    expect(result.faceDetected).toBe(false);
    expect(result.confidence).toBeUndefined();
  });

  it("detectFace() returns a fresh object literal per call — caller mutations don't leak", async () => {
    const ar = noopArProvider();
    const first = await ar.detectFace({} as ImageBitmap);
    (first as { confidence?: number }).confidence = 0;
    const second = await ar.detectFace({} as ImageBitmap);
    expect(second.confidence).toBe(1);
  });
});
