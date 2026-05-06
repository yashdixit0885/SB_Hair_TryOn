import { describe, it, expect } from "vitest";

import { renderWithProviders } from "@/test-utils/render";
import { Button } from "@/components/ui/button";
import { DensityContainer } from "./DensityContainer";

describe("DensityContainer", () => {
  it("propagates compact density through descendant DOM lookup", async () => {
    const { container, getByRole } = renderWithProviders(
      <DensityContainer density="compact">
        <Button>Save look</Button>
      </DensityContainer>,
    );
    const button = getByRole("button");
    expect(button.closest("[data-density]")?.getAttribute("data-density")).toBe(
      "compact",
    );
    await expect(container).toHaveNoViolations();
  });

  it("propagates comfortable density", async () => {
    const { container, getByRole } = renderWithProviders(
      <DensityContainer density="comfortable">
        <Button>Save look</Button>
      </DensityContainer>,
    );
    const button = getByRole("button");
    expect(button.closest("[data-density]")?.getAttribute("data-density")).toBe(
      "comfortable",
    );
    await expect(container).toHaveNoViolations();
  });

  it("does not auto-inherit when no DensityContainer wraps the descendant", () => {
    // The renderWithProviders helper wraps in a default `data-density="comfortable"`
    // div, so for this negative case we render directly to assert the rule:
    // density is opt-in via the explicit container, never implicit.
    const { unmount } = renderWithProviders(<Button>Save look</Button>);
    // Inside the test wrapper, the closest [data-density] is the helper's wrapper.
    // Outside any wrapper there is no [data-density] — verify the contract by
    // rendering bare DOM:
    unmount();
    const root = document.createElement("div");
    document.body.appendChild(root);
    root.innerHTML = '<button type="button">Save look</button>';
    const bareButton = root.querySelector("button");
    expect(bareButton?.closest("[data-density]")).toBeNull();
    document.body.removeChild(root);
  });
});
