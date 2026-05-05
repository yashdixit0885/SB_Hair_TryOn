import { describe, it, expect } from "vitest";

import { renderWithProviders } from "@/test-utils/render";
import { Separator } from "./separator";

describe("Separator", () => {
  it("renders horizontal separator and passes axe", async () => {
    const { container } = renderWithProviders(
      <div>
        <p>Above</p>
        <Separator />
        <p>Below</p>
      </div>,
    );
    expect(container.querySelector('[data-slot="separator"]')).toBeInTheDocument();
    await expect(container).toHaveNoViolations();
  });

  it("renders vertical separator and passes axe", async () => {
    const { container } = renderWithProviders(
      <div className="flex h-10 items-center">
        <span>Left</span>
        <Separator orientation="vertical" />
        <span>Right</span>
      </div>,
    );
    await expect(container).toHaveNoViolations();
  });

  it("exposes role=separator when decorative=false and passes axe", async () => {
    const { container, getByRole } = renderWithProviders(
      <div>
        <section aria-label="Original photo">Before</section>
        <Separator decorative={false} />
        <section aria-label="Try-on result">After</section>
      </div>,
    );
    expect(getByRole("separator")).toBeInTheDocument();
    await expect(container).toHaveNoViolations();
  });
});
