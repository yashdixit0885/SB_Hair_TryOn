import { describe, it, expect } from "vitest";

import { renderWithProviders } from "@/test-utils/render";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

describe("Select", () => {
  it("renders trigger with placeholder and passes axe", async () => {
    const { container, getByRole } = renderWithProviders(
      <Select>
        <SelectTrigger className="w-48" aria-label="Texture filter">
          <SelectValue placeholder="Choose a texture" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="3a">3A — Loose curls</SelectItem>
          <SelectItem value="4a">4A — Coily</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(getByRole("combobox")).toBeInTheDocument();
    await expect(container).toHaveNoViolations();
  });
});
