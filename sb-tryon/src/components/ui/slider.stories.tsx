import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Slider } from "./slider";

const meta = {
  title: "UI/Slider",
  component: Slider,
  parameters: { layout: "centered" },
  args: { className: "w-64" },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "aria-label": "Fade weeks",
    defaultValue: [6],
    max: 12,
    step: 1,
  },
};

export const Disabled: Story = {
  args: {
    "aria-label": "Locked slider",
    defaultValue: [3],
    max: 12,
    step: 1,
    disabled: true,
  },
};

export const Range: Story = {
  args: {
    thumbLabels: ["Min weeks", "Max weeks"],
    defaultValue: [2, 8],
    max: 12,
    step: 1,
  },
};
