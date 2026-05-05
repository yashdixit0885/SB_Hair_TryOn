import { describe, it, expect } from "vitest";

import { renderWithProviders } from "@/test-utils/render";
import { ScrollArea } from "./scroll-area";

describe("ScrollArea", () => {
  it("renders content and passes axe", async () => {
    const { container, getByText } = renderWithProviders(
      <ScrollArea className="h-32 w-48 rounded-md border border-(--color-border-subtle)">
        <div className="p-3">
          <p>Outcome 1</p>
          <p>Outcome 2</p>
          <p>Outcome 3</p>
        </div>
      </ScrollArea>,
    );
    expect(getByText("Outcome 1")).toBeInTheDocument();
    await expect(container).toHaveNoViolations();
  });
});
