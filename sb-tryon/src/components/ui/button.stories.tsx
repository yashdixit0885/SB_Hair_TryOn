import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "./button";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: "primary", children: "Save look" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Try another color" },
};

export const Tertiary: Story = {
  args: { variant: "tertiary", children: "Find a salon" },
};

export const Destructive: Story = {
  args: { variant: "destructive", children: "Delete photo" },
};

export const DisabledPrimary: Story = {
  args: {
    variant: "primary",
    children: "Save look",
    "aria-disabled": true,
  },
};

export const LoadingPrimary: Story = {
  args: { variant: "primary", loading: true, children: "Save look" },
};

export const SmallSize: Story = {
  args: { variant: "primary", size: "sm", children: "Save look" },
};

export const LargeSize: Story = {
  args: { variant: "primary", size: "lg", children: "Save look" },
};
