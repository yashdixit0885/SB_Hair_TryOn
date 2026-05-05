import { describe, it, expect } from "vitest";

import { renderWithProviders } from "@/test-utils/render";
import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";

describe("RadioGroup", () => {
  it("renders options with labels and passes axe", async () => {
    const { container, getByLabelText } = renderWithProviders(
      <RadioGroup defaultValue="natural" aria-label="Lighting preset">
        <div className="flex items-center gap-2">
          <RadioGroupItem id="natural" value="natural" />
          <Label htmlFor="natural">Natural daylight</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem id="warm" value="warm" />
          <Label htmlFor="warm">Warm indoor</Label>
        </div>
      </RadioGroup>,
    );
    expect(getByLabelText("Natural daylight")).toBeChecked();
    await expect(container).toHaveNoViolations();
  });

  it("marks a disabled item as disabled and passes axe", async () => {
    const { container, getByLabelText } = renderWithProviders(
      <RadioGroup defaultValue="natural-b" aria-label="Lighting preset">
        <div className="flex items-center gap-2">
          <RadioGroupItem id="natural-b" value="natural-b" />
          <Label htmlFor="natural-b">Natural daylight</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem id="warm-b" value="warm-b" disabled />
          <Label htmlFor="warm-b">Warm indoor</Label>
        </div>
      </RadioGroup>,
    );
    expect(getByLabelText("Warm indoor")).toBeDisabled();
    await expect(container).toHaveNoViolations();
  });
});
