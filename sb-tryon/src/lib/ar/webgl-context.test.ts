// jsdom does not ship a WebGL2 implementation, so `hasWebGL2Support` will
// return `false` here and `getWebGL2Context` returns `null`. Both are valid
// runtime answers — the test asserts the API shape and SSR safety, not
// whether jsdom can do WebGL.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  _resetWebGL2SupportCache,
  getWebGL2Context,
  hasWebGL2Support,
} from "./webgl-context";

beforeEach(() => {
  _resetWebGL2SupportCache();
});

describe("hasWebGL2Support", () => {
  it("returns a boolean without throwing", () => {
    const result = hasWebGL2Support();
    expect(typeof result).toBe("boolean");
  });

  it("returns false when document is undefined (SSR safety)", () => {
    const originalDocument = globalThis.document;
    // @ts-expect-error — intentionally simulating SSR
    delete globalThis.document;
    try {
      expect(hasWebGL2Support()).toBe(false);
    } finally {
      globalThis.document = originalDocument;
    }
  });

  it("caches the result — repeated calls do not allocate new canvas contexts", () => {
    const createSpy = vi.spyOn(document, "createElement");
    hasWebGL2Support();
    hasWebGL2Support();
    hasWebGL2Support();
    // Exactly one canvas probe across N calls.
    const canvasCalls = createSpy.mock.calls.filter((c) => c[0] === "canvas");
    expect(canvasCalls.length).toBe(1);
    createSpy.mockRestore();
  });
});

describe("getWebGL2Context", () => {
  let createdCanvases: HTMLCanvasElement[] = [];

  afterEach(() => {
    createdCanvases = [];
  });

  function makeCanvas() {
    const c = document.createElement("canvas");
    createdCanvases.push(c);
    return c;
  }

  it("returns either a WebGL2RenderingContext or null", () => {
    const ctx = getWebGL2Context(makeCanvas());
    expect(ctx === null || typeof ctx === "object").toBe(true);
  });

  it("never throws even if the canvas getContext call fails", () => {
    const broken = {
      getContext: () => {
        throw new Error("simulated failure");
      },
    } as unknown as HTMLCanvasElement;
    expect(() => getWebGL2Context(broken)).not.toThrow();
    expect(getWebGL2Context(broken)).toBeNull();
  });
});
