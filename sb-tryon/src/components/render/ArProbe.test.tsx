import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils/render";
import { ArProbe } from "./ArProbe";

// The default `renderWithProviders` swaps in the no-op AR provider, so this
// test should reach "ready" without ever loading MediaPipe.

describe("<ArProbe />", () => {
  it("transitions to ready against the no-op AR provider", async () => {
    renderWithProviders(<ArProbe />);
    await waitFor(() => {
      expect(screen.getByText(/AR provider status:/)).toHaveAttribute(
        "data-status",
        "ready",
      );
    });
  });
});
