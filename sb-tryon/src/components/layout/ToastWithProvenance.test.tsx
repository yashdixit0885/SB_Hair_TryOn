import { describe, it, expect } from "vitest";

import { renderWithProviders } from "@/test-utils/render";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import { ToastWithProvenance } from "./ToastWithProvenance";

describe("ToastWithProvenance", () => {
  it("renders past-tense message and provenance hint and passes axe", async () => {
    renderWithProviders(
      <ToastProvider>
        <ToastWithProvenance
          open
          message="Saved to your looks"
          provenance="stored locally only"
        />
        <ToastViewport />
      </ToastProvider>,
    );
    const title = document.body.querySelector(
      '[data-slot="toast-title"]',
    );
    const description = document.body.querySelector(
      '[data-slot="toast-description"]',
    );
    expect(title).not.toBeNull();
    expect(title?.textContent).toBe("Saved to your looks");
    expect(description).not.toBeNull();
    expect(description?.textContent).toBe("stored locally only");

    // Radix Toast portals to document.body — scope axe to the toast region.
    const toast = document.body.querySelector('[data-slot="toast"]');
    expect(toast).not.toBeNull();
    if (toast instanceof Element) {
      await expect(toast).toHaveNoViolations();
    }
  });

  it("hides the close affordance when showClose=false", () => {
    renderWithProviders(
      <ToastProvider>
        <ToastWithProvenance
          open
          showClose={false}
          message="Order placed"
          provenance="BSG order #4471"
        />
        <ToastViewport />
      </ToastProvider>,
    );
    const close = document.body.querySelector('[data-slot="toast-close"]');
    expect(close).toBeNull();
  });
});
