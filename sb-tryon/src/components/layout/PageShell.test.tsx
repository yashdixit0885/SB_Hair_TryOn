import { describe, it, expect, vi, beforeEach } from "vitest";
import { act } from "@testing-library/react";

import { renderWithProviders } from "@/test-utils/render";
import { PageShell } from "./PageShell";

const usePathnameMock = vi.fn<() => string>(() => "/");

vi.mock("next/navigation", () => ({
  usePathname: () => usePathnameMock(),
}));

describe("PageShell", () => {
  beforeEach(() => {
    usePathnameMock.mockReset();
    usePathnameMock.mockReturnValue("/");
  });

  it("renders skip link as the first focusable element and main as focus target", async () => {
    const { container, getByRole } = renderWithProviders(
      <PageShell variant="consumer">
        <h1>Welcome</h1>
      </PageShell>,
    );
    const skip = getByRole("link", { name: "Skip to main content" });
    expect(skip).toBeInTheDocument();
    expect(skip.compareDocumentPosition(getByRole("banner"))).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    const main = container.querySelector("main#main-content");
    expect(main).not.toBeNull();
    expect(main).toHaveAttribute("tabindex", "-1");
    const h1 = container.querySelector("h1");
    expect(main?.contains(h1)).toBe(true);
    await expect(container).toHaveNoViolations();
  });

  it("moves focus to <h1> on route change (skipping initial mount)", async () => {
    usePathnameMock.mockReturnValue("/");
    const { rerender, getByRole } = renderWithProviders(
      <PageShell variant="consumer">
        <h1>Welcome</h1>
      </PageShell>,
    );
    const h1 = getByRole("heading", { level: 1 });
    // Initial mount must NOT have stolen focus.
    expect(document.activeElement).not.toBe(h1);

    // Simulate pathname change.
    usePathnameMock.mockReturnValue("/colors");
    await act(async () => {
      rerender(
        <PageShell variant="consumer">
          <h1>Welcome</h1>
        </PageShell>,
      );
    });
    expect(document.activeElement).toBe(h1);
  });

  it("falls back to focusing <main> when no <h1> exists on route change", async () => {
    usePathnameMock.mockReturnValue("/");
    const { rerender, container } = renderWithProviders(
      <PageShell variant="consumer">
        <p>No heading here</p>
      </PageShell>,
    );
    usePathnameMock.mockReturnValue("/colors");
    await act(async () => {
      rerender(
        <PageShell variant="consumer">
          <p>No heading here</p>
        </PageShell>,
      );
    });
    expect(document.activeElement).toBe(container.querySelector("main#main-content"));
  });

  it("operator variant carries data-density=compact and pads main for the sidebar", async () => {
    const { container } = renderWithProviders(
      <PageShell
        variant="operator"
        sections={[{ label: "Dashboard", href: "/dashboard" }]}
      >
        <h1>Dashboard</h1>
      </PageShell>,
    );
    expect(
      container.querySelector("[data-density='compact']"),
    ).not.toBeNull();
    const main = container.querySelector("main#main-content");
    expect(main?.className).toContain("pl-64");
  });

  it("renders <ErrorBanner> inside main when an error prop is supplied", async () => {
    const onRetry = vi.fn();
    const { getByRole } = renderWithProviders(
      <PageShell
        variant="consumer"
        error={{ message: "We couldn't load your data.", onRetry }}
      >
        <h1>Welcome</h1>
      </PageShell>,
    );
    const alert = getByRole("alert");
    expect(alert).toHaveTextContent("We couldn't load your data.");
    expect(getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("renders an optional footer slot", () => {
    const { getByText } = renderWithProviders(
      <PageShell
        variant="consumer"
        footer={<small>Sally Beauty Try-On — V1 demo</small>}
      >
        <h1>Welcome</h1>
      </PageShell>,
    );
    expect(getByText("Sally Beauty Try-On — V1 demo")).toBeInTheDocument();
  });
});
