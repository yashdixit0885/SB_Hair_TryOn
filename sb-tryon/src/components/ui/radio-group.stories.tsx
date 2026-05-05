import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";

const meta = {
  title: "UI/RadioGroup",
  component: RadioGroup,
  parameters: { layout: "centered" },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="natural" aria-label="Lighting preset">
      <div className="flex items-center gap-2">
        <RadioGroupItem id="lighting-natural" value="natural" />
        <Label htmlFor="lighting-natural">Natural daylight</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="lighting-warm" value="warm" />
        <Label htmlFor="lighting-warm">Warm indoor</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="lighting-cool" value="cool" />
        <Label htmlFor="lighting-cool">Cool fluorescent</Label>
      </div>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="natural" aria-label="Locked preset">
      <div className="flex items-center gap-2">
        <RadioGroupItem id="lighting-locked" value="natural" disabled />
        <Label htmlFor="lighting-locked">Natural daylight</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="lighting-locked-2" value="warm" disabled />
        <Label htmlFor="lighting-locked-2">Warm indoor</Label>
      </div>
    </RadioGroup>
  ),
};
