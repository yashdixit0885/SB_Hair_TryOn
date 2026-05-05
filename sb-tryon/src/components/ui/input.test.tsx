import { describe, it, expect } from "vitest";

import { renderWithProviders } from "@/test-utils/render";
import { Input } from "./input";
import { Label } from "./label";

describe("Input", () => {
  it("renders with associated label and passes axe", async () => {
    const { container, getByLabelText } = renderWithProviders(
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email address</Label>
        <Input id="email" type="email" />
      </div>,
    );
    expect(getByLabelText("Email address")).toBeInTheDocument();
    await expect(container).toHaveNoViolations();
  });

  it("supports aria-invalid", async () => {
    const { container, getByRole } = renderWithProviders(
      <Input aria-label="Email" aria-invalid="true" />,
    );
    expect(getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    await expect(container).toHaveNoViolations();
  });
});
