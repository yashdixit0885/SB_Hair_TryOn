import { describe, it, expect } from "vitest";

import { renderWithProviders } from "@/test-utils/render";
import { Button } from "./button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";

describe("AlertDialog", () => {
  it("renders trigger and passes axe (closed)", async () => {
    const { container, getByRole } = renderWithProviders(
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete photo</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this photo?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the photo from this device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep photo</AlertDialogCancel>
            <AlertDialogAction>Delete photo</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );
    expect(getByRole("button", { name: "Delete photo" })).toBeInTheDocument();
    await expect(container).toHaveNoViolations();
  });

  it("renders open alert dialog content and passes axe", async () => {
    const { getByRole } = renderWithProviders(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this photo?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the photo from this device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep photo</AlertDialogCancel>
            <AlertDialogAction>Delete photo</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );
    expect(getByRole("alertdialog")).toBeInTheDocument();
    // AlertDialogContent renders via Portal; scope axe to the alertdialog element.
    await expect(getByRole("alertdialog")).toHaveNoViolations();
  });
});
