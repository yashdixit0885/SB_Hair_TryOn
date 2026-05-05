import { describe, it, expect } from "vitest";

import { renderWithProviders } from "@/test-utils/render";
import { Button } from "./button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./tooltip";

describe("Tooltip", () => {
  it("renders trigger and passes axe", async () => {
    const { container, getByRole } = renderWithProviders(
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="secondary">Show source</Button>
        </TooltipTrigger>
        <TooltipContent>Native review</TooltipContent>
      </Tooltip>,
    );
    expect(getByRole("button", { name: "Show source" })).toBeInTheDocument();
    await expect(container).toHaveNoViolations();
  });
});
