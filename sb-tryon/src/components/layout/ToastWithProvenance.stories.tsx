import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import { ToastWithProvenance } from "./ToastWithProvenance";

const meta = {
  title: "Layout/ToastWithProvenance",
  component: ToastWithProvenance,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <ToastProvider>
        <div className="min-h-screen bg-(--color-bg-base) p-8">
          <Story />
          <ToastViewport />
        </div>
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof ToastWithProvenance>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SavedLook: Story = {
  args: {
    open: true,
    message: "Saved to your looks",
    provenance: "stored locally only",
  },
};

export const BSGOrder: Story = {
  args: {
    open: true,
    message: "Order placed",
    provenance: "BSG order #4471",
  },
};

export const ConsentRecorded: Story = {
  args: {
    open: true,
    message: "Consent recorded",
    provenance: "never sent to brands",
  },
};

export const PhotoDeleted: Story = {
  args: {
    open: true,
    message: "Photo deleted",
    provenance: "removed from your device",
  },
};
