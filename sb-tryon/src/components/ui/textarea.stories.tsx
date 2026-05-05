import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Label } from "./label";
import { Textarea } from "./textarea";

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-2">
      <Label htmlFor="review">Tell us about the result</Label>
      <Textarea id="review" placeholder="Describe color, fade, and texture" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-2">
      <Label htmlFor="review-disabled">Locked review</Label>
      <Textarea id="review-disabled" defaultValue="Cannot edit" disabled />
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-2">
      <Label htmlFor="review-invalid">Tell us about the result</Label>
      <Textarea id="review-invalid" aria-invalid="true" />
    </div>
  ),
};
