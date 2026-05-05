import { describe, it, expect } from "vitest";

import { renderWithProviders } from "@/test-utils/render";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

describe("Dialog", () => {
  it("renders trigger and passes axe (closed)", async () => {
    const { container, getByRole } = renderWithProviders(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Save look</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Save this look</DialogTitle>
          <DialogDescription>
            Looks are stored on this device only.
          </DialogDescription>
        </DialogContent>
      </Dialog>,
    );
    expect(getByRole("button", { name: "Save look" })).toBeInTheDocument();
    await expect(container).toHaveNoViolations();
  });

  it("renders content with title and description (open)", async () => {
    const { getByText, getByRole } = renderWithProviders(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Save this look</DialogTitle>
          <DialogDescription>
            Looks are stored on this device only.
          </DialogDescription>
        </DialogContent>
      </Dialog>,
    );
    expect(getByText("Save this look")).toBeInTheDocument();
    expect(
      getByText("Looks are stored on this device only."),
    ).toBeInTheDocument();
    // DialogContent renders via Portal; Radix's hideOthers aria-hides RTL siblings,
    // so we scope axe to the dialog element itself to avoid false positives.
    await expect(getByRole("dialog")).toHaveNoViolations();
  });
});
