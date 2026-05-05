import { describe, it, expect } from "vitest";

import { renderWithProviders } from "@/test-utils/render";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

describe("ToggleGroup", () => {
  it("renders single-select group and passes axe", async () => {
    const { container, getByRole } = renderWithProviders(
      <ToggleGroup
        type="single"
        defaultValue="natural"
        aria-label="Lighting preset"
      >
        <ToggleGroupItem value="natural" aria-label="Natural daylight">
          Natural
        </ToggleGroupItem>
        <ToggleGroupItem value="warm" aria-label="Warm indoor">
          Warm
        </ToggleGroupItem>
        <ToggleGroupItem value="cool" aria-label="Cool fluorescent">
          Cool
        </ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(
      getByRole("radio", { name: "Natural daylight" }),
    ).toHaveAttribute("aria-checked", "true");
    await expect(container).toHaveNoViolations();
  });
});
