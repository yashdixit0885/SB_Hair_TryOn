import { describe, it, expect } from "vitest";

import { renderWithProviders } from "@/test-utils/render";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

describe("Avatar", () => {
  it("renders fallback and passes axe", async () => {
    const { container, getByText } = renderWithProviders(
      <Avatar>
        <AvatarImage src="" alt="Maya Patel" />
        <AvatarFallback>MP</AvatarFallback>
      </Avatar>,
    );
    expect(getByText("MP")).toBeInTheDocument();
    await expect(container).toHaveNoViolations();
  });
});
