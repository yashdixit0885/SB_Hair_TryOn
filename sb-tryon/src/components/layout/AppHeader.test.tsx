import { describe, it, expect, vi, beforeEach } from "vitest";

import { renderWithProviders } from "@/test-utils/render";
import { AppHeader } from "./AppHeader";

const usePathnameMock = vi.fn<() => string>(() => "/");

vi.mock("next/navigation", () => ({
  usePathname: () => usePathnameMock(),
}));

describe("AppHeader", () => {
  beforeEach(() => {
    usePathnameMock.mockReset();
    usePathnameMock.mockReturnValue("/");
  });

  describe("consumer variant", () => {
    it("renders banner role with primary nav and utility links and passes axe", async () => {
      const { container, getByRole } = renderWithProviders(
        <AppHeader variant="consumer" />,
      );
      expect(getByRole("banner")).toBeInTheDocument();
      expect(getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
      expect(getByRole("link", { name: "Sally Beauty Try-On" })).toHaveAttribute(
        "href",
        "/",
      );
      expect(getByRole("link", { name: "Browse colors" })).toHaveAttribute(
        "href",
        "/colors",
      );
      expect(getByRole("link", { name: "Find a salon" })).toHaveAttribute(
        "href",
        "/salons",
      );
      expect(getByRole("link", { name: "Saved looks" })).toHaveAttribute(
        "href",
        "/saved",
      );
      expect(getByRole("link", { name: "Sign in" })).toHaveAttribute(
        "href",
        "/account",
      );
      await expect(container).toHaveNoViolations();
    });

  });

  describe("operator variant", () => {
    it("marks the active section with aria-current=page based on usePathname", async () => {
      usePathnameMock.mockReturnValue("/dashboard");
      const { container, getByRole } = renderWithProviders(
        <AppHeader
          variant="operator"
          sections={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Reviews", href: "/dashboard/reviews" },
          ]}
        />,
      );
      const dashboard = getByRole("link", { name: "Dashboard" });
      const reviews = getByRole("link", { name: "Reviews" });
      expect(dashboard).toHaveAttribute("aria-current", "page");
      expect(reviews).not.toHaveAttribute("aria-current");
      await expect(container).toHaveNoViolations();
    });

    it("respects an explicit current=true override over pathname matching", () => {
      usePathnameMock.mockReturnValue("/dashboard");
      const { getByRole } = renderWithProviders(
        <AppHeader
          variant="operator"
          sections={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Reviews", href: "/dashboard/reviews", current: true },
          ]}
        />,
      );
      const reviews = getByRole("link", { name: "Reviews" });
      expect(reviews).toHaveAttribute("aria-current", "page");
    });

  });

  describe("stylist variant", () => {
    it("renders banner with brand mark and passes axe", async () => {
      const { container, getByRole } = renderWithProviders(
        <AppHeader variant="stylist" />,
      );
      expect(getByRole("banner")).toBeInTheDocument();
      expect(getByRole("link", { name: "Sally Beauty Try-On" })).toHaveAttribute(
        "href",
        "/",
      );
      await expect(container).toHaveNoViolations();
    });
  });
});
