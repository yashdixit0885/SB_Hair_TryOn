import { describe, it, expect } from "vitest";

import { renderWithProviders } from "@/test-utils/render";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

describe("Popover", () => {
  it("renders trigger and passes axe (closed)", async () => {
    const { container, getByRole } = renderWithProviders(
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary">Show details</Button>
        </PopoverTrigger>
        <PopoverContent aria-label="Source attribution">
          <p>Source-attribution chips appear on every review.</p>
        </PopoverContent>
      </Popover>,
    );
    expect(getByRole("button", { name: "Show details" })).toBeInTheDocument();
    await expect(container).toHaveNoViolations();
  });
});
