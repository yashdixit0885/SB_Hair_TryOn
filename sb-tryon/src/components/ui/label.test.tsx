import { describe, it, expect } from "vitest";

import { renderWithProviders } from "@/test-utils/render";
import { Label } from "./label";

describe("Label", () => {
  it("renders text and passes axe", async () => {
    const { container, getByText } = renderWithProviders(
      <Label htmlFor="email">Email address</Label>,
    );
    expect(getByText("Email address")).toBeInTheDocument();
    await expect(container).toHaveNoViolations();
  });
});
