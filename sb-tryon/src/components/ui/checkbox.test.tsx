import { describe, it, expect } from "vitest";

import { renderWithProviders } from "@/test-utils/render";
import { Checkbox } from "./checkbox";
import { Label } from "./label";

describe("Checkbox", () => {
  it("renders with a label and passes axe", async () => {
    const { container, getByLabelText } = renderWithProviders(
      <div className="flex items-center gap-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">I consent to photo upload</Label>
      </div>,
    );
    expect(getByLabelText("I consent to photo upload")).toBeInTheDocument();
    await expect(container).toHaveNoViolations();
  });

  it("supports the disabled state", async () => {
    const { container, getByRole } = renderWithProviders(
      <Checkbox aria-label="Save photo" disabled />,
    );
    expect(getByRole("checkbox")).toBeDisabled();
    await expect(container).toHaveNoViolations();
  });
});
