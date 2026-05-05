import { describe, it, expect } from "vitest";

import { renderWithProviders } from "@/test-utils/render";
import { Label } from "./label";
import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("renders with associated label and passes axe", async () => {
    const { container, getByLabelText } = renderWithProviders(
      <div className="flex flex-col gap-2">
        <Label htmlFor="notes">Stylist notes</Label>
        <Textarea id="notes" />
      </div>,
    );
    expect(getByLabelText("Stylist notes")).toBeInTheDocument();
    await expect(container).toHaveNoViolations();
  });

  it("reflects aria-invalid on the textarea element", async () => {
    const { container, getByLabelText } = renderWithProviders(
      <div className="flex flex-col gap-2">
        <Label htmlFor="notes-error">Stylist notes</Label>
        <Textarea id="notes-error" aria-invalid="true" />
      </div>,
    );
    expect(getByLabelText("Stylist notes")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(container).toHaveNoViolations();
  });
});
