import { describe, it, expect } from "vitest";

import { renderWithProviders } from "@/test-utils/render";
import {
  Toast,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast";

describe("Toast", () => {
  it("renders open toast with title and description and passes axe", async () => {
    const { container, getByText } = renderWithProviders(
      <ToastProvider>
        <Toast open>
          <ToastTitle>Look saved</ToastTitle>
          <ToastDescription>
            Stored on this device only — remove anytime.
          </ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    );
    expect(getByText("Look saved")).toBeInTheDocument();
    await expect(container).toHaveNoViolations();
  });
});
