import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils/render";
import { RenderConfidenceBanner } from "./RenderConfidenceBanner";
import { renderCopy } from "@/lib/copy/render";

describe("<RenderConfidenceBanner />", () => {
  it("renders the exact confidence banner copy", () => {
    renderWithProviders(<RenderConfidenceBanner />);
    expect(screen.getByText(renderCopy.confidenceBanner.headline)).toBeInTheDocument();
    expect(screen.getByText(renderCopy.confidenceBanner.body)).toBeInTheDocument();
  });

  it("passes axe accessibility check", async () => {
    renderWithProviders(<RenderConfidenceBanner />);
    const banner = screen.getByRole("status");
    await expect(banner).toHaveNoViolations();
  });

  it("has role=status for screen-reader announcement", () => {
    renderWithProviders(<RenderConfidenceBanner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
