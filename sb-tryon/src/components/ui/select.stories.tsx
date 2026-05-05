import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";

const meta = {
  title: "UI/Select",
  component: Select,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-2">
      <Label htmlFor="texture">Texture</Label>
      <Select>
        <SelectTrigger id="texture">
          <SelectValue placeholder="Choose a texture" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Curl pattern</SelectLabel>
            <SelectItem value="3a">3A — Loose curls</SelectItem>
            <SelectItem value="3b">3B — Springy curls</SelectItem>
            <SelectItem value="3c">3C — Tight curls</SelectItem>
            <SelectItem value="4a">4A — Coily</SelectItem>
            <SelectItem value="4b">4B — Z-pattern</SelectItem>
            <SelectItem value="4c">4C — Tightly coiled</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-2">
      <Label htmlFor="locked-texture">Locked filter</Label>
      <Select disabled>
        <SelectTrigger id="locked-texture">
          <SelectValue placeholder="Locked" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="3a">3A</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};
