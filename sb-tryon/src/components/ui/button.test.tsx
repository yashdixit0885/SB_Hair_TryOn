import { describe, it, expect, vi } from "vitest";
import { fireEvent } from "@testing-library/react";

import { renderWithProviders } from "@/test-utils/render";
import { Button } from "./button";

describe("Button", () => {
  it("renders with verb-driven copy and passes axe", async () => {
    const { container, getByRole } = renderWithProviders(
      <Button>Save look</Button>,
    );
    expect(getByRole("button", { name: "Save look" })).toBeInTheDocument();
    await expect(container).toHaveNoViolations();
  });

  it("uses aria-disabled for the disabled state", async () => {
    const { container, getByRole } = renderWithProviders(
      <Button aria-disabled="true">Save look</Button>,
    );
    expect(getByRole("button")).toHaveAttribute("aria-disabled", "true");
    await expect(container).toHaveNoViolations();
  });

  it("preserves layout in the loading state and announces it", async () => {
    const { container, getByText } = renderWithProviders(
      <Button loading>Save look</Button>,
    );
    expect(getByText("Loading")).toBeInTheDocument();
    expect(getByText("Save look")).toBeInTheDocument();
    await expect(container).toHaveNoViolations();
  });

  it("applies the secondary variant", async () => {
    const { container, getByRole } = renderWithProviders(
      <Button variant="secondary">Try another color</Button>,
    );
    expect(getByRole("button")).toHaveAttribute("data-variant", "secondary");
    await expect(container).toHaveNoViolations();
  });

  it("blocks clicks and announces busy state when loading", async () => {
    const handleClick = vi.fn();
    const { container, getByRole } = renderWithProviders(
      <Button loading onClick={handleClick}>
        Save look
      </Button>,
    );
    const btn = getByRole("button");
    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(btn).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(btn);
    expect(handleClick).not.toHaveBeenCalled();
    await expect(container).toHaveNoViolations();
  });
});
