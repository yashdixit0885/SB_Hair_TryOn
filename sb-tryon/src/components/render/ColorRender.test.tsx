import { act, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { SegmentationResult } from "@/lib/providers";
import { useTryOnStore } from "@/lib/stores/try-on";
import { renderCopy } from "@/lib/copy/render";

// --- Module-level mocks ---

vi.mock("@/lib/ar/webgl-context", () => ({
  hasWebGL2Support: vi.fn(() => false),
  getWebGL2Context: vi.fn(() => null),
  _resetWebGL2SupportCache: vi.fn(),
}));

vi.mock("@/lib/ar/canvas-2d-fallback", () => ({
  compositeHslOnly: vi.fn(() => document.createElement("canvas")),
}));

// Stable mock segment function — implementation changed per-test via mockImplementation
const mockSegment = vi.fn<() => Promise<SegmentationResult>>(async () => ({
  alphaMask: new Uint8ClampedArray(512 * 512).fill(255),
  confidence: 0.92,
  width: 512,
  height: 512,
}));

// IMPORTANT: mockArProvider is a stable object so `ar` reference is stable across renders.
// A new object each call would cause segmentAndRender useCallback to recreate every render,
// causing Effect 1 to re-run and cancel the in-flight segment → infinite loop.
const mockArProvider = {
  segment: mockSegment,
  detectFace: vi.fn(),
  prewarm: vi.fn(),
  dispose: vi.fn(),
};

vi.mock("@/lib/providers", () => ({
  useProvider: vi.fn(() => mockArProvider),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(() => new URLSearchParams("color=auburn")),
}));

vi.mock("@/lib/observability/track", () => ({
  track: vi.fn(),
}));

import { useSearchParams } from "next/navigation";
import { compositeHslOnly } from "@/lib/ar/canvas-2d-fallback";

const mockUseSearchParams = vi.mocked(useSearchParams);
const mockCompositeHslOnly = vi.mocked(compositeHslOnly);

// --- Helpers ---

function makePhoto(): Blob {
  return new Blob(["fake-photo"], { type: "image/jpeg" });
}

function makeBitmap(): ImageBitmap {
  return { close: vi.fn(), width: 512, height: 512 } as unknown as ImageBitmap;
}

// --- Setup ---

beforeEach(async () => {
  vi.clearAllMocks();

  // Default params: color=auburn
  mockUseSearchParams.mockReturnValue(
    new URLSearchParams("color=auburn") as ReturnType<typeof useSearchParams>,
  );

  // Default segment: confident result
  mockSegment.mockResolvedValue({
    alphaMask: new Uint8ClampedArray(512 * 512).fill(255),
    confidence: 0.92,
    width: 512,
    height: 512,
  });

  // Mock createImageBitmap — jsdom doesn't implement it
  vi.stubGlobal("createImageBitmap", vi.fn().mockResolvedValue(makeBitmap()));

  // Reset try-on store
  useTryOnStore.getState().reset();
});

// --- Tests ---

describe("<ColorRender />", () => {
  it("renders no-color state when colorId is null", async () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams() as ReturnType<typeof useSearchParams>,
    );

    const { ColorRender } = await import("./ColorRender");
    await act(async () => {
      render(<ColorRender photo={makePhoto()} />);
    });

    const section = screen.getByRole("region", { name: "Hair color try-on" });
    expect(section).toBeInTheDocument();

    // Canvas should be hidden (no color selected)
    const canvas = section.querySelector("canvas");
    if (canvas) {
      expect(canvas.style.display).toBe("none");
    }
    expect(screen.getByLabelText("Select a color to preview it on your hair")).not.toBeNull();
  });

  it("shows segmenting aria-label while ar.segment() is in flight", async () => {
    let resolveSegment!: (r: SegmentationResult) => void;
    mockSegment.mockImplementation(
      () =>
        new Promise<SegmentationResult>((res) => {
          resolveSegment = res;
        }),
    );

    const { ColorRender } = await import("./ColorRender");
    await act(async () => {
      render(<ColorRender photo={makePhoto()} />);
    });

    await waitFor(() => {
      expect(screen.getByLabelText("Rendering auburn on your hair…")).toBeInTheDocument();
    });

    // Resolve the segment to clean up
    await act(async () => {
      resolveSegment({
        alphaMask: new Uint8ClampedArray(512 * 512).fill(255),
        confidence: 0.92,
        width: 512,
        height: 512,
      });
    });
  });

  it("renders canvas and calls compositeHslOnly when photo + colorId provided", async () => {
    const { ColorRender } = await import("./ColorRender");
    render(<ColorRender photo={makePhoto()} />);

    await waitFor(() => {
      expect(mockCompositeHslOnly).toHaveBeenCalledTimes(1);
    });

    const canvas = screen.getByLabelText(/Render of auburn on your hair/);
    expect(canvas.tagName).toBe("CANVAS");
  });

  it("shows low-confidence banner when confidence < 0.55", async () => {
    mockSegment.mockResolvedValue({
      alphaMask: new Uint8ClampedArray(512 * 512).fill(255),
      confidence: 0.3,
      width: 512,
      height: 512,
    });

    const { ColorRender } = await import("./ColorRender");
    render(<ColorRender photo={makePhoto()} />);

    await waitFor(() => {
      expect(
        screen.getByText(renderCopy.confidenceBanner.body),
      ).toBeInTheDocument();
    });

    const section = screen.getByRole("region", { name: "Hair color try-on" });
    expect(section.querySelector("canvas")).not.toBeInTheDocument();
  });

  it("canvas aria-label reflects rendered state with colorId and defaults", async () => {
    const { ColorRender } = await import("./ColorRender");
    render(<ColorRender photo={makePhoto()} />);

    await waitFor(() => {
      expect(
        screen.getByLabelText("Render of auburn on your hair, daylight lighting, week 0"),
      ).toBeInTheDocument();
    });
  });

  it("does NOT re-segment when only colorId changes — re-composites instead", async () => {
    const { ColorRender } = await import("./ColorRender");
    // Use a stable photo blob so changing colorId doesn't trigger photo change
    const stablePhoto = makePhoto();
    const { rerender } = render(<ColorRender photo={stablePhoto} />);

    // Wait for first segment to complete
    await waitFor(() => expect(mockSegment).toHaveBeenCalledTimes(1));

    // Composite should have been called once
    await waitFor(() => expect(mockCompositeHslOnly).toHaveBeenCalledTimes(1));

    // Change colorId — re-render with same photo
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams("color=espresso") as ReturnType<typeof useSearchParams>,
    );
    await act(async () => {
      rerender(<ColorRender photo={stablePhoto} />);
    });

    // Composite fires again (param change), but segment is NOT called again
    await waitFor(() => expect(mockCompositeHslOnly).toHaveBeenCalledTimes(2));
    expect(mockSegment).toHaveBeenCalledTimes(1);
  });

  it("re-segments when photo prop changes", async () => {
    const { ColorRender } = await import("./ColorRender");
    const photoA = makePhoto();
    const { rerender } = render(<ColorRender photo={photoA} />);

    await waitFor(() => expect(mockSegment).toHaveBeenCalledTimes(1));

    const photoB = new Blob(["different-photo"], { type: "image/jpeg" });
    await act(async () => {
      rerender(<ColorRender photo={photoB} />);
    });

    await waitFor(() => expect(mockSegment).toHaveBeenCalledTimes(2));
  });

  it("cancels in-flight segment when photo changes rapidly (D-1-5-A)", async () => {
    let resolveFirstSegment!: (r: SegmentationResult) => void;
    let callCount = 0;

    mockSegment.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return new Promise<SegmentationResult>((res) => {
          resolveFirstSegment = res;
        });
      }
      return Promise.resolve({
        alphaMask: new Uint8ClampedArray(512 * 512).fill(255),
        confidence: 0.92,
        width: 512,
        height: 512,
      });
    });

    const { ColorRender } = await import("./ColorRender");
    const photoA = makePhoto();
    const photoB = new Blob(["photo-b"], { type: "image/jpeg" });
    const { rerender } = render(<ColorRender photo={photoA} />);

    // Replace photo before first segment resolves
    await act(async () => {
      rerender(<ColorRender photo={photoB} />);
    });

    // Second segment should complete and render
    await waitFor(() => expect(mockSegment).toHaveBeenCalledTimes(2));

    // Resolve first (stale) segment — its result should be discarded (cancelRef)
    await act(async () => {
      resolveFirstSegment({
        alphaMask: new Uint8ClampedArray(512 * 512).fill(255),
        confidence: 0.92,
        width: 512,
        height: 512,
      });
    });

    // Final state reflects the second segment's completed render
    await waitFor(() => {
      expect(screen.getByLabelText(/Render of auburn on your hair/)).toBeInTheDocument();
    });
  });

  it("synthetic latency budget: Canvas2D composite completes within 500ms", async () => {
    const { ColorRender } = await import("./ColorRender");
    const t0 = performance.now();

    render(<ColorRender photo={makePhoto()} />);

    await waitFor(() => {
      expect(mockCompositeHslOnly).toHaveBeenCalledTimes(1);
    });

    const elapsed = performance.now() - t0;
    expect(elapsed).toBeLessThan(500);
  });
});
