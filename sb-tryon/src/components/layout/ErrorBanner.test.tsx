import { describe, it, expect, vi } from "vitest";
import { fireEvent } from "@testing-library/react";

import { renderWithProviders } from "@/test-utils/render";
import { ErrorBanner } from "./ErrorBanner";

describe("ErrorBanner", () => {
  it("renders alert role with the narrated message and retry affordance", async () => {
    const onRetry = vi.fn();
    const { container, getByRole } = renderWithProviders(
      <ErrorBanner
        message="We couldn't load your render."
        onRetry={onRetry}
      />,
    );
    const alert = getByRole("alert");
    expect(alert).toHaveTextContent("We couldn't load your render.");
    expect(alert).toHaveAttribute("aria-live", "polite");
    const retry = getByRole("button", { name: "Retry" });
    expect(retry).toBeInTheDocument();
    await expect(container).toHaveNoViolations();
  });

  it("invokes onRetry when the retry button is activated", () => {
    const onRetry = vi.fn();
    const { getByRole } = renderWithProviders(
      <ErrorBanner
        message="We couldn't load your render."
        onRetry={onRetry}
      />,
    );
    fireEvent.click(getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("uses a custom retryLabel when supplied", () => {
    const onRetry = vi.fn();
    const { getByRole, queryByRole } = renderWithProviders(
      <ErrorBanner
        message="We couldn't load your reviews."
        retryLabel="Reload reviews"
        onRetry={onRetry}
      />,
    );
    expect(getByRole("button", { name: "Reload reviews" })).toBeInTheDocument();
    expect(queryByRole("button", { name: "Retry" })).toBeNull();
  });

  it("renders a dismiss affordance when onDismiss is supplied and invokes it on click", () => {
    const onDismiss = vi.fn();
    const { getByRole } = renderWithProviders(
      <ErrorBanner
        message="We couldn't load your render."
        onRetry={vi.fn()}
        onDismiss={onDismiss}
      />,
    );
    const dismiss = getByRole("button", { name: "Dismiss" });
    expect(dismiss).toBeInTheDocument();
    fireEvent.click(dismiss);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("renders neither retry nor dismiss when no handlers are supplied (system-down)", () => {
    const { queryByRole, getByRole } = renderWithProviders(
      <ErrorBanner message="We're offline. We'll restore service shortly." />,
    );
    expect(getByRole("alert")).toBeInTheDocument();
    expect(queryByRole("button", { name: "Retry" })).toBeNull();
    expect(queryByRole("button", { name: "Dismiss" })).toBeNull();
  });
});
