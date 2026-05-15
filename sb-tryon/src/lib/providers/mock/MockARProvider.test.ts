import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock MediaPipe and the model-cache so tests never load WASM, never fetch
// the model, and never hit IndexedDB. The factory call counter on
// `createFromOptions` is what proves idempotence (AC3).

const createFromOptionsSpy = vi.fn();
const filesetResolverSpy = vi.fn();

vi.mock("@mediapipe/tasks-vision", () => ({
  FilesetResolver: {
    forVisionTasks: (url: string) => {
      filesetResolverSpy(url);
      return Promise.resolve({ wasmLoaderPath: url });
    },
  },
  ImageSegmenter: {
    createFromOptions: vi.fn(),
  },
  FaceLandmarker: {
    createFromOptions: vi.fn(),
  },
}));

vi.mock("@/lib/persistence/model-cache", () => ({
  getCachedHairSegmentationModel: vi.fn(async () => "blob:mock-model"),
  getCachedFaceLandmarkerModel: vi.fn(async () => "blob:mock-face-model"),
}));

vi.mock("@/lib/observability/track", () => ({
  track: vi.fn(),
}));

import { FaceLandmarker, ImageSegmenter } from "@mediapipe/tasks-vision";
import { ProviderError } from "@/lib/providers/errors";
import { track } from "@/lib/observability/track";
import { MockARProvider } from "./MockARProvider";

const createFromOptions = ImageSegmenter.createFromOptions as unknown as ReturnType<
  typeof vi.fn
>;
const faceCreateFromOptions =
  FaceLandmarker.createFromOptions as unknown as ReturnType<typeof vi.fn>;

interface FakeFaceLandmarker {
  detect: ReturnType<typeof vi.fn>;
  close: ReturnType<typeof vi.fn>;
}

function fakeFaceLandmarker(faceCount: number): FakeFaceLandmarker {
  const faceLandmarks = Array.from({ length: faceCount }, () => [
    { x: 0.5, y: 0.5, z: 0 },
  ]);
  return {
    detect: vi.fn(() => ({ faceLandmarks })),
    close: vi.fn(),
  };
}

interface FakeMask {
  width: number;
  height: number;
  getAsUint8Array: () => Uint8Array;
  getAsFloat32Array: () => Float32Array;
}

function fakeMask(opts: {
  width: number;
  height: number;
  category: number[];
  confidence?: number[];
}): FakeMask {
  return {
    width: opts.width,
    height: opts.height,
    getAsUint8Array: () => new Uint8Array(opts.category),
    getAsFloat32Array: () =>
      new Float32Array(opts.confidence ?? new Array(opts.category.length).fill(0.9)),
  };
}

interface FakeSegmenter {
  segment: ReturnType<typeof vi.fn>;
  close: ReturnType<typeof vi.fn>;
}

function fakeSegmenter(opts: {
  category?: number[];
  confidence?: number[];
  width?: number;
  height?: number;
} = {}): FakeSegmenter {
  const width = opts.width ?? 2;
  const height = opts.height ?? 2;
  const category = opts.category ?? [0, 1, 1, 0];
  const confidence = opts.confidence ?? [0.5, 0.9, 0.8, 0.5];
  return {
    segment: vi.fn(() => ({
      categoryMask: fakeMask({ width, height, category }),
      confidenceMasks: [
        fakeMask({ width, height, category, confidence: [0, 0, 0, 0] }),
        fakeMask({ width, height, category, confidence }),
        fakeMask({ width, height, category }),
        fakeMask({ width, height, category }),
        fakeMask({ width, height, category }),
        fakeMask({ width, height, category }),
      ],
      close: vi.fn(),
    })),
    close: vi.fn(),
  };
}

const fakeBitmap = {} as ImageBitmap;

// URL.createObjectURL / revokeObjectURL are needed by the new dispose path.
const revokeObjectURLSpy = vi.fn();
const originalRevoke = URL.revokeObjectURL;
const originalCreate = URL.createObjectURL;
beforeEach(() => {
  vi.clearAllMocks();
  createFromOptionsSpy.mockClear();
  filesetResolverSpy.mockClear();
  createFromOptions.mockReset();
  faceCreateFromOptions.mockReset();
  revokeObjectURLSpy.mockClear();
  URL.createObjectURL = () => "blob:mock-model";
  URL.revokeObjectURL = revokeObjectURLSpy;
});

afterEach(() => {
  URL.revokeObjectURL = originalRevoke;
  URL.createObjectURL = originalCreate;
});

import { afterEach } from "vitest";

describe("MockARProvider.prewarm", () => {
  it("invokes createFromOptions exactly once across parallel + serial calls (with real microtask yields)", async () => {
    // Force a real microtask yield inside the mock so Promise.all parallel
    // callers actually race the in-flight-promise guard. Without this delay
    // the mock resolves on the same microtask and the test passes vacuously.
    createFromOptions.mockImplementation(async () => {
      await new Promise((r) => setTimeout(r, 5));
      createFromOptionsSpy();
      return fakeSegmenter();
    });
    const provider = new MockARProvider();
    await Promise.all([
      provider.prewarm(),
      provider.prewarm(),
      provider.prewarm(),
      provider.prewarm(),
      provider.prewarm(),
    ]);
    await provider.prewarm();
    await provider.prewarm();
    await provider.prewarm();
    expect(createFromOptionsSpy).toHaveBeenCalledTimes(1);
  });

  it("rejects when called after dispose", async () => {
    createFromOptions.mockImplementation(async () => fakeSegmenter());
    const provider = new MockARProvider();
    await provider.dispose();
    await expect(provider.prewarm()).rejects.toBeInstanceOf(ProviderError);
  });

  it("clears prewarmPromise on rejection so a retry can succeed", async () => {
    let attempt = 0;
    createFromOptions.mockImplementation(async () => {
      attempt++;
      if (attempt === 1) throw new Error("transient CDN failure");
      return fakeSegmenter();
    });
    const provider = new MockARProvider();
    await expect(provider.prewarm()).rejects.toThrow(/transient/);
    // Retry must succeed; previously the cached rejected promise replayed forever.
    await expect(provider.prewarm()).resolves.toBeUndefined();
    expect(attempt).toBe(2);
  });

  it("rejects when dispose() races a successful prewarm — and still closes the segmenter to avoid a leak", async () => {
    const seg = fakeSegmenter();
    createFromOptions.mockImplementation(async () => {
      await new Promise((r) => setTimeout(r, 5));
      return seg;
    });
    const provider = new MockARProvider();
    const inflight = provider.prewarm();
    await provider.dispose();
    await expect(inflight).rejects.toMatchObject({ code: "DISPOSED" });
    // The freshly-created segmenter must be closed even though it never made
    // it onto the disposed instance.
    expect(seg.close).toHaveBeenCalled();
  });
});

describe("MockARProvider.segment", () => {
  it("returns a hair-only alpha mask with width/height/confidence", async () => {
    const seg = fakeSegmenter({
      category: [0, 1, 1, 0],
      confidence: [0, 0.95, 0.85, 0],
    });
    createFromOptions.mockImplementation(async () => seg);
    const provider = new MockARProvider();
    await provider.prewarm();
    const out = await provider.segment(fakeBitmap);
    expect(out.width).toBe(2);
    expect(out.height).toBe(2);
    expect(out.alphaMask).toBeInstanceOf(Uint8ClampedArray);
    expect(Array.from(out.alphaMask)).toEqual([0, 255, 255, 0]);
    // Mean of confidence at hair pixels (0.95 + 0.85) / 2 = 0.9.
    expect(out.confidence).toBeCloseTo(0.9, 5);
  });

  it("lazy-bootstraps prewarm when called before explicit prewarm", async () => {
    createFromOptions.mockImplementation(async () => fakeSegmenter());
    const provider = new MockARProvider();
    const out = await provider.segment(fakeBitmap);
    expect(out.width).toBeGreaterThan(0);
    expect(createFromOptions).toHaveBeenCalledTimes(1);
  });

  it("rejects with NO_HAIR_DETECTED when the mask contains zero hair pixels", async () => {
    const seg = fakeSegmenter({ category: [0, 0, 0, 0] });
    createFromOptions.mockImplementation(async () => seg);
    const provider = new MockARProvider();
    await expect(provider.segment(fakeBitmap)).rejects.toMatchObject({
      code: "NO_HAIR_DETECTED",
    });
  });

  it("emits tryon.segmentation_completed telemetry on success with numeric durationMs", async () => {
    createFromOptions.mockImplementation(async () => fakeSegmenter());
    const provider = new MockARProvider();
    await provider.segment(fakeBitmap);
    expect(track).toHaveBeenCalledTimes(1);
    const call = (track as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(call.name).toBe("tryon.segmentation_completed");
    expect(typeof call.durationMs).toBe("number");
    expect(call.durationMs).toBeGreaterThanOrEqual(0);
    expect(["laptop", "mobile", "unknown"]).toContain(call.deviceClass);
  });

  it("does NOT emit telemetry on the failure path (NO_HAIR_DETECTED)", async () => {
    const seg = fakeSegmenter({ category: [0, 0, 0, 0] });
    createFromOptions.mockImplementation(async () => seg);
    const provider = new MockARProvider();
    await expect(provider.segment(fakeBitmap)).rejects.toMatchObject({
      code: "NO_HAIR_DETECTED",
    });
    // Failure-path segmentations should NOT pollute the NFR1 percentile signal.
    expect(track).not.toHaveBeenCalled();
  });

  it("rejects with DISPOSED when called after dispose", async () => {
    createFromOptions.mockImplementation(async () => fakeSegmenter());
    const provider = new MockARProvider();
    await provider.prewarm();
    await provider.dispose();
    await expect(provider.segment(fakeBitmap)).rejects.toMatchObject({
      code: "DISPOSED",
    });
  });
});

describe("MockARProvider.dispose", () => {
  it("calls segmenter.close on the underlying segmenter", async () => {
    const seg = fakeSegmenter();
    createFromOptions.mockImplementation(async () => seg);
    const provider = new MockARProvider();
    await provider.prewarm();
    await provider.dispose();
    expect(seg.close).toHaveBeenCalledTimes(1);
  });

  it("revokes the model Blob URL on dispose", async () => {
    createFromOptions.mockImplementation(async () => fakeSegmenter());
    const provider = new MockARProvider();
    await provider.prewarm();
    await provider.dispose();
    expect(revokeObjectURLSpy).toHaveBeenCalledWith("blob:mock-model");
  });

  it("is idempotent — double dispose does not throw", async () => {
    const seg = fakeSegmenter();
    createFromOptions.mockImplementation(async () => seg);
    const provider = new MockARProvider();
    await provider.prewarm();
    await provider.dispose();
    await expect(provider.dispose()).resolves.toBeUndefined();
  });

  it("is a no-op when called before prewarm", async () => {
    const provider = new MockARProvider();
    await expect(provider.dispose()).resolves.toBeUndefined();
  });
});

describe("MockARProvider.detectFace", () => {
  it("returns { faceDetected: true } when FaceLandmarker yields a non-empty landmark array", async () => {
    faceCreateFromOptions.mockImplementation(async () => fakeFaceLandmarker(1));
    const provider = new MockARProvider();
    const result = await provider.detectFace(fakeBitmap);
    expect(result.faceDetected).toBe(true);
    expect(typeof result.confidence).toBe("number");
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  it("returns { faceDetected: false } when no faces are detected (does NOT throw)", async () => {
    faceCreateFromOptions.mockImplementation(async () => fakeFaceLandmarker(0));
    const provider = new MockARProvider();
    const result = await provider.detectFace(fakeBitmap);
    expect(result.faceDetected).toBe(false);
    // confidence omitted when no face.
    expect(result.confidence).toBeUndefined();
  });

  it("rejects with DISPOSED when called after dispose", async () => {
    faceCreateFromOptions.mockImplementation(async () => fakeFaceLandmarker(1));
    const provider = new MockARProvider();
    await provider.detectFace(fakeBitmap); // initialize first
    await provider.dispose();
    await expect(provider.detectFace(fakeBitmap)).rejects.toMatchObject({
      code: "DISPOSED",
    });
  });

  it("lazy-loads the face landmarker model on first call (not during prewarm())", async () => {
    createFromOptions.mockImplementation(async () => fakeSegmenter());
    faceCreateFromOptions.mockImplementation(async () => fakeFaceLandmarker(1));
    const provider = new MockARProvider();
    await provider.prewarm();
    expect(faceCreateFromOptions).not.toHaveBeenCalled();
    await provider.detectFace(fakeBitmap);
    expect(faceCreateFromOptions).toHaveBeenCalledTimes(1);
  });

  it("idempotent in-flight: concurrent first calls share one createFromOptions invocation", async () => {
    let calls = 0;
    faceCreateFromOptions.mockImplementation(async () => {
      await new Promise((r) => setTimeout(r, 5));
      calls++;
      return fakeFaceLandmarker(1);
    });
    const provider = new MockARProvider();
    await Promise.all([
      provider.detectFace(fakeBitmap),
      provider.detectFace(fakeBitmap),
      provider.detectFace(fakeBitmap),
    ]);
    expect(calls).toBe(1);
  });

  it("clears the in-flight promise on rejection so a retry can succeed", async () => {
    let attempt = 0;
    faceCreateFromOptions.mockImplementation(async () => {
      attempt++;
      if (attempt === 1) throw new Error("transient face-model fetch failure");
      return fakeFaceLandmarker(1);
    });
    const provider = new MockARProvider();
    await expect(provider.detectFace(fakeBitmap)).rejects.toThrow(/transient/);
    const result = await provider.detectFace(fakeBitmap);
    expect(result.faceDetected).toBe(true);
    expect(attempt).toBe(2);
  });

  it("closes the face landmarker and revokes its model URL on dispose", async () => {
    const fl = fakeFaceLandmarker(1);
    faceCreateFromOptions.mockImplementation(async () => fl);
    const provider = new MockARProvider();
    URL.createObjectURL = () => "blob:mock-face-model";
    await provider.detectFace(fakeBitmap);
    await provider.dispose();
    expect(fl.close).toHaveBeenCalledTimes(1);
    expect(revokeObjectURLSpy).toHaveBeenCalledWith("blob:mock-face-model");
  });

  it("does NOT emit telemetry (face detection is upload validation, not render-perf)", async () => {
    faceCreateFromOptions.mockImplementation(async () => fakeFaceLandmarker(1));
    const provider = new MockARProvider();
    await provider.detectFace(fakeBitmap);
    expect(track).not.toHaveBeenCalled();
  });

  it("throws ProviderError(DETECT_FAILED) when landmarker.detect() throws synchronously", async () => {
    faceCreateFromOptions.mockImplementation(async () => ({
      detect: vi.fn(() => { throw new Error("WASM heap corrupted"); }),
      close: vi.fn(),
    }));
    const provider = new MockARProvider();
    await expect(provider.detectFace(fakeBitmap)).rejects.toMatchObject({
      code: "DETECT_FAILED",
    });
  });

  it("shares a single FilesetResolver across prewarm() and detectFace() (AC9)", async () => {
    createFromOptions.mockImplementation(async () => fakeSegmenter());
    faceCreateFromOptions.mockImplementation(async () => fakeFaceLandmarker(1));
    const provider = new MockARProvider();
    await provider.prewarm();
    await provider.detectFace(fakeBitmap);
    expect(filesetResolverSpy).toHaveBeenCalledTimes(1);
  });
});
