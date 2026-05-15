import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useTryOnParams } from "./try-on-params";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

import { useSearchParams } from "next/navigation";
const mockUseSearchParams = vi.mocked(useSearchParams);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useTryOnParams", () => {
  it("returns defaults when no params are present", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams() as ReturnType<typeof useSearchParams>);
    const { result } = renderHook(() => useTryOnParams());
    expect(result.current.colorId).toBeNull();
    expect(result.current.lightingPreset).toBe("daylight");
    expect(result.current.fadeWeek).toBe(0);
  });

  it("parses valid color, lighting, and week params", () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams("color=auburn&lighting=indoor&week=3") as ReturnType<typeof useSearchParams>,
    );
    const { result } = renderHook(() => useTryOnParams());
    expect(result.current.colorId).toBe("auburn");
    expect(result.current.lightingPreset).toBe("indoor");
    expect(result.current.fadeWeek).toBe(3);
  });

  it("parses salon lighting preset", () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams("lighting=salon") as ReturnType<typeof useSearchParams>,
    );
    const { result } = renderHook(() => useTryOnParams());
    expect(result.current.lightingPreset).toBe("salon");
  });

  it("ignores invalid lighting preset and falls back to daylight", () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams("lighting=warm-interior") as ReturnType<typeof useSearchParams>,
    );
    const { result } = renderHook(() => useTryOnParams());
    expect(result.current.lightingPreset).toBe("daylight");
  });

  it("ignores non-numeric week and falls back to 0", () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams("week=abc") as ReturnType<typeof useSearchParams>,
    );
    const { result } = renderHook(() => useTryOnParams());
    expect(result.current.fadeWeek).toBe(0);
  });

  it("parses week=0 correctly", () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams("week=0") as ReturnType<typeof useSearchParams>,
    );
    const { result } = renderHook(() => useTryOnParams());
    expect(result.current.fadeWeek).toBe(0);
  });

  it("parses week=13 (max) correctly", () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams("week=13") as ReturnType<typeof useSearchParams>,
    );
    const { result } = renderHook(() => useTryOnParams());
    expect(result.current.fadeWeek).toBe(13);
  });

  it("rejects week=90 (out of range) and falls back to 0", () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams("week=90") as ReturnType<typeof useSearchParams>,
    );
    const { result } = renderHook(() => useTryOnParams());
    expect(result.current.fadeWeek).toBe(0);
  });

  it("rejects negative week and falls back to 0", () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams("week=-5") as ReturnType<typeof useSearchParams>,
    );
    const { result } = renderHook(() => useTryOnParams());
    expect(result.current.fadeWeek).toBe(0);
  });

  it("rejects float week and falls back to 0", () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams("week=2.5") as ReturnType<typeof useSearchParams>,
    );
    const { result } = renderHook(() => useTryOnParams());
    expect(result.current.fadeWeek).toBe(0);
  });

  it("rejects week > 13 and falls back to 0", () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams("week=999") as ReturnType<typeof useSearchParams>,
    );
    const { result } = renderHook(() => useTryOnParams());
    expect(result.current.fadeWeek).toBe(0);
  });
});
