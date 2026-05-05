import { describe, it, expect } from "vitest";

import { renderWithProviders } from "@/test-utils/render";
import { Toggle } from "./toggle";

describe("Toggle", () => {
  it("renders pressed state and passes axe", async () => {
    const { container, getByRole } = renderWithProviders(
      <Toggle defaultPressed aria-label="Toggle bold">
        Bold
      </Toggle>,
    );
    expect(getByRole("button")).toHaveAttribute("aria-pressed", "true");
    await expect(container).toHaveNoViolations();
  });

  it("supports the disabled state", async () => {
    const { container } = renderWithProviders(
      <Toggle aria-label="Disabled toggle" disabled>
        Off
      </Toggle>,
    );
    await expect(container).toHaveNoViolations();
  });
});
