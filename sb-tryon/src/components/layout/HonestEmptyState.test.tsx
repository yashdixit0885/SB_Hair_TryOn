import { describe, it, expect, vi, afterEach } from "vitest";
import { fireEvent } from "@testing-library/react";

import { renderWithProviders } from "@/test-utils/render";
import { HonestEmptyState } from "./HonestEmptyState";

describe("HonestEmptyState", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the supplied copy and passes axe", async () => {
    const { container, getByText } = renderWithProviders(
      <HonestEmptyState copy="No saved looks yet — save the next color you try on." />,
    );
    expect(
      getByText("No saved looks yet — save the next color you try on."),
    ).toBeInTheDocument();
    await expect(container).toHaveNoViolations();
  });

  it("logs a console.error invariant warning when copy is empty (dev mode)", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { container } = renderWithProviders(<HonestEmptyState copy="" />);
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy.mock.calls[0]?.[0]).toMatch(/copy.+required/i);
    await expect(container).toHaveNoViolations();
  });

  it("renders a click-action affordance and invokes the handler on activation", () => {
    const onClick = vi.fn();
    const { getByRole } = renderWithProviders(
      <HonestEmptyState
        copy="No reviews for this color yet."
        action={{ label: "Try a color", onClick }}
      />,
    );
    const button = getByRole("button", { name: "Try a color" });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders a link-action affordance pointing at the supplied href", () => {
    const { getByRole } = renderWithProviders(
      <HonestEmptyState
        copy="No saved looks yet."
        action={{ label: "Browse colors", href: "/colors" }}
      />,
    );
    const link = getByRole("link", { name: "Browse colors" });
    expect(link).toHaveAttribute("href", "/colors");
  });

  it("renders an optional icon hidden from AT", () => {
    const { container, getByText } = renderWithProviders(
      <HonestEmptyState
        copy="No reviews yet."
        icon={<span data-testid="icon">★</span>}
      />,
    );
    const iconWrapper = container.querySelector('[aria-hidden="true"]');
    expect(iconWrapper).not.toBeNull();
    expect(getByText("★")).toBeInTheDocument();
  });

  it("requires copy at the type level (typecheck guard)", () => {
    // The following commented blocks document type-level expectations. The
    // `@ts-expect-error` directives fail the typecheck if the error vanishes —
    // i.e. if someone accidentally makes `copy` optional or accepts undefined.
    // We can't actually instantiate them at runtime without real values, so
    // assert true; the typecheck is the test.
    type _TypeGuard = () => void;
    function _typeGuard(): _TypeGuard {
      return () => {
        // @ts-expect-error - HonestEmptyState requires `copy` prop
        <HonestEmptyState />;
        // @ts-expect-error - copy must be a string, not undefined
        <HonestEmptyState copy={undefined as unknown as undefined} />;
      };
    }
    expect(typeof _typeGuard).toBe("function");
  });
});
