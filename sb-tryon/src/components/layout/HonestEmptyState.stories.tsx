import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ImageOffIcon } from "lucide-react";

import { HonestEmptyState } from "./HonestEmptyState";

const meta = {
  title: "Layout/HonestEmptyState",
  component: HonestEmptyState,
  parameters: { layout: "centered" },
} satisfies Meta<typeof HonestEmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    copy: "No saved looks yet — save the next color you try on.",
  },
};

export const WithIcon: Story = {
  args: {
    copy: "No reviews for this color yet — be the first to leave one after a try-on.",
    icon: <ImageOffIcon className="size-8" />,
  },
};

export const WithClickAction: Story = {
  args: {
    copy: "Your saved looks live here. Try a color to begin.",
    action: { label: "Try a color", onClick: () => {} },
  },
};

export const WithLinkAction: Story = {
  args: {
    copy: "No saved looks yet.",
    action: { label: "Browse colors", href: "/colors" },
  },
};
