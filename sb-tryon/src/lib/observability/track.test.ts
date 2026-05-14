import { afterEach, describe, expect, it, vi } from "vitest";
import { track } from "./track";

describe("track", () => {
  const spy = vi.spyOn(console, "info").mockImplementation(() => {});

  afterEach(() => {
    spy.mockClear();
  });

  it("logs segmentation_completed with duration + deviceClass", () => {
    track({
      name: "tryon.segmentation_completed",
      durationMs: 320,
      deviceClass: "laptop",
    });
    expect(spy).toHaveBeenCalledTimes(1);
    const arg = spy.mock.calls[0][0] as string;
    expect(arg).toContain("tryon.segmentation_completed");
    expect(arg).toContain("320");
    expect(arg).toContain("laptop");
  });

  it("logs render_completed with duration", () => {
    track({ name: "tryon.render_completed", durationMs: 18 });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toContain("tryon.render_completed");
  });

  it("logs color_selected with colorId", () => {
    track({ name: "tryon.color_selected", colorId: "auburn-1" });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toContain("auburn-1");
  });
});
