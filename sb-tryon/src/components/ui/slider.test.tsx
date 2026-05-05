import { describe, it, expect } from "vitest";

import { renderWithProviders } from "@/test-utils/render";
import { Slider } from "./slider";

describe("Slider", () => {
  it("forwards aria-label to the thumb and passes axe", async () => {
    const { container, getByRole } = renderWithProviders(
      <Slider aria-label="Fade weeks" defaultValue={[6]} max={12} />,
    );
    const thumb = getByRole("slider");
    expect(thumb).toHaveAttribute("aria-label", "Fade weeks");
    await expect(container).toHaveNoViolations();
  });

  it("supports the disabled state", async () => {
    const { container } = renderWithProviders(
      <Slider aria-label="Locked slider" defaultValue={[3]} disabled />,
    );
    await expect(container).toHaveNoViolations();
  });

  it("applies a generic fallback label when no aria-label is provided", async () => {
    const { container, getByRole } = renderWithProviders(
      <Slider defaultValue={[6]} max={12} />,
    );
    expect(getByRole("slider")).toHaveAttribute("aria-label", "Value 1");
    await expect(container).toHaveNoViolations();
  });

  it("supports per-thumb labels for ranges", async () => {
    const { container, getAllByRole } = renderWithProviders(
      <Slider
        thumbLabels={["Min weeks", "Max weeks"]}
        defaultValue={[2, 8]}
        max={12}
      />,
    );
    const thumbs = getAllByRole("slider");
    expect(thumbs).toHaveLength(2);
    expect(thumbs[0]).toHaveAttribute("aria-label", "Min weeks");
    expect(thumbs[1]).toHaveAttribute("aria-label", "Max weeks");
    await expect(container).toHaveNoViolations();
  });
});
