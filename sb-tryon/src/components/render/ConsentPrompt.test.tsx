import { describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils/render";
import { ConsentPrompt } from "./ConsentPrompt";

function setup() {
  const onConsent = vi.fn();
  const onDecline = vi.fn();
  const onOpenChange = vi.fn();
  const utils = renderWithProviders(
    <ConsentPrompt
      open
      onOpenChange={onOpenChange}
      onConsent={onConsent}
      onDecline={onDecline}
    />,
  );
  return { ...utils, onConsent, onDecline, onOpenChange };
}

describe("<ConsentPrompt />", () => {
  it("renders the title + body and is accessible via axe", async () => {
    setup();
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText(/Process your photo\?/i)).toBeInTheDocument();
    expect(
      screen.getByText(/We'll analyze your photo on your device/i),
    ).toBeInTheDocument();
    await expect(dialog).toHaveNoViolations();
  });

  it("does not render a close button (architecture: no dismissal)", () => {
    setup();
    // The dialog primitive's default close button has the sr-only "Close dialog" label.
    expect(screen.queryByRole("button", { name: /close dialog/i })).not.toBeInTheDocument();
  });

  it("renders three radio options with the BIPA-approved labels", () => {
    setup();
    expect(screen.getByLabelText(/locally only/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/save to my account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Decline/i)).toBeInTheDocument();
  });

  it("default selection is 'local' on mount", () => {
    setup();
    const localRadio = screen.getByLabelText(/locally only/i);
    expect(localRadio).toHaveAttribute("data-state", "checked");
  });

  it("Continue with default selection invokes onConsent('local')", () => {
    const { onConsent, onDecline } = setup();
    fireEvent.click(screen.getByRole("button", { name: /Continue/i }));
    expect(onConsent).toHaveBeenCalledTimes(1);
    expect(onConsent).toHaveBeenCalledWith("local");
    expect(onDecline).not.toHaveBeenCalled();
  });

  it("Continue with 'saved' selected invokes onConsent('saved')", () => {
    const { onConsent } = setup();
    fireEvent.click(screen.getByLabelText(/save to my account/i));
    fireEvent.click(screen.getByRole("button", { name: /Continue/i }));
    expect(onConsent).toHaveBeenCalledWith("saved");
  });

  it("Continue with 'declined' selected invokes onDecline (and NOT onConsent)", () => {
    const { onConsent, onDecline } = setup();
    fireEvent.click(screen.getByLabelText(/Decline/i));
    fireEvent.click(screen.getByRole("button", { name: /Continue/i }));
    expect(onDecline).toHaveBeenCalledTimes(1);
    expect(onConsent).not.toHaveBeenCalled();
  });

  it("ESC does not dismiss the dialog (onOpenChange not called)", () => {
    const { onOpenChange } = setup();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape", code: "Escape" });
    expect(onOpenChange).not.toHaveBeenCalled();
    // Dialog still in the DOM
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("Continue button is always present (default radio is pre-checked, so it's enabled on mount)", () => {
    setup();
    const btn = screen.getByRole("button", { name: /Continue/i });
    expect(btn).toBeEnabled();
  });

  it("outside-click does not dismiss the dialog (onOpenChange not called)", () => {
    const { onOpenChange } = setup();
    fireEvent.pointerDown(document.body);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
