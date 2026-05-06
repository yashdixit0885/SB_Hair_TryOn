import { describe, it, expect } from "vitest";
import { fireEvent } from "@testing-library/react";

import { renderWithProviders } from "@/test-utils/render";
import { SkipToContent } from "./SkipToContent";

describe("SkipToContent", () => {
  it("renders the bypass-block link with the canonical hash target", async () => {
    const { container, getByRole } = renderWithProviders(
      <>
        <SkipToContent />
        <main id="main-content" tabIndex={-1}>
          <h1>Welcome</h1>
        </main>
      </>,
    );
    const link = getByRole("link", { name: "Skip to main content" });
    expect(link).toHaveAttribute("href", "#main-content");
    await expect(container).toHaveNoViolations();
  });

  it("moves focus to the main element on activation (jsdom interop)", () => {
    const { getByRole } = renderWithProviders(
      <>
        <SkipToContent />
        <main id="main-content" tabIndex={-1}>
          <h1>Welcome</h1>
        </main>
      </>,
    );
    const link = getByRole("link", { name: "Skip to main content" });
    fireEvent.click(link);
    const main = document.getElementById("main-content");
    expect(document.activeElement).toBe(main);
  });

  it("respects a custom targetId", () => {
    const { getByRole } = renderWithProviders(
      <>
        <SkipToContent targetId="custom-region" />
        <section id="custom-region" tabIndex={-1}>
          Region body
        </section>
      </>,
    );
    const link = getByRole("link", { name: "Skip to main content" });
    expect(link).toHaveAttribute("href", "#custom-region");
    fireEvent.click(link);
    expect(document.activeElement).toBe(document.getElementById("custom-region"));
  });
});
