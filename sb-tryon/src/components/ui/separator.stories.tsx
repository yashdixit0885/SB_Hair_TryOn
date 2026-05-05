import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Separator } from "./separator";

const meta = {
  title: "UI/Separator",
  component: Separator,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-64 text-base text-(--color-text-primary)">
      <p>Original photo</p>
      <Separator className="my-3" />
      <p>Try-on result</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-10 items-center text-sm text-(--color-text-secondary)">
      <span>Color</span>
      <Separator orientation="vertical" className="mx-3" />
      <span>Texture</span>
      <Separator orientation="vertical" className="mx-3" />
      <span>Brand</span>
    </div>
  ),
};
