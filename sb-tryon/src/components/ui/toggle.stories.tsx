import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Toggle } from "./toggle";

const meta = {
  title: "UI/Toggle",
  component: Toggle,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Save look", "aria-label": "Save look" },
};

export const Pressed: Story = {
  args: {
    children: "Saved",
    "aria-label": "Saved",
    defaultPressed: true,
  },
};

export const Outline: Story = {
  args: {
    children: "Filter on",
    "aria-label": "Texture filter on",
    variant: "outline",
  },
};

export const Disabled: Story = {
  args: {
    children: "Locked",
    "aria-label": "Locked",
    disabled: true,
  },
};
