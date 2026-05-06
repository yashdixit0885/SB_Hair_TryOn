import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ErrorBanner } from "./ErrorBanner";

const meta = {
  title: "Layout/ErrorBanner",
  component: ErrorBanner,
  parameters: { layout: "padded" },
  args: {
    onRetry: () => {},
  },
} satisfies Meta<typeof ErrorBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { message: "We couldn't load your render. Try again in a moment." },
};

export const Dismissible: Story = {
  args: {
    message: "We couldn't load your reviews.",
    retryLabel: "Reload reviews",
    onDismiss: () => {},
  },
};

export const NonDismissible: Story = {
  args: {
    message:
      "Try-On is offline while we restore service. Saved looks remain on your device.",
    onRetry: undefined,
  },
};
