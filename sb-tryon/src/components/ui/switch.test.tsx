import { describe, it, expect } from "vitest";

import { renderWithProviders } from "@/test-utils/render";
import { Label } from "./label";
import { Switch } from "./switch";

describe("Switch", () => {
  it("renders with associated label and passes axe", async () => {
    const { container, getByLabelText } = renderWithProviders(
      <div className="flex items-center gap-2">
        <Switch id="public-share" />
        <Label htmlFor="public-share">Share publicly</Label>
      </div>,
    );
    expect(getByLabelText("Share publicly")).toBeInTheDocument();
    await expect(container).toHaveNoViolations();
  });

  it("supports the disabled state", async () => {
    const { container, getByRole } = renderWithProviders(
      <Switch aria-label="Locked toggle" disabled />,
    );
    expect(getByRole("switch")).toBeDisabled();
    await expect(container).toHaveNoViolations();
  });
});
