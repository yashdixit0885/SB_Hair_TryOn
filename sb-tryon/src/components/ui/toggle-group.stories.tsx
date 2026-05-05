import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

const meta = {
  title: "UI/ToggleGroup",
  component: ToggleGroup,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleSelect: Story = {
  args: { type: "single", defaultValue: "natural", "aria-label": "Lighting preset" },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="natural" aria-label="Natural daylight">
        Natural
      </ToggleGroupItem>
      <ToggleGroupItem value="warm" aria-label="Warm indoor">
        Warm
      </ToggleGroupItem>
      <ToggleGroupItem value="cool" aria-label="Cool fluorescent">
        Cool
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const MultiSelect: Story = {
  args: {
    type: "multiple",
    defaultValue: ["color", "texture"],
    "aria-label": "Filters",
  },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="color">Color</ToggleGroupItem>
      <ToggleGroupItem value="texture">Texture</ToggleGroupItem>
      <ToggleGroupItem value="brand">Brand</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Outline: Story = {
  args: {
    type: "single",
    variant: "outline",
    defaultValue: "natural",
    "aria-label": "Lighting preset",
  },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="natural" aria-label="Natural daylight">
        Natural
      </ToggleGroupItem>
      <ToggleGroupItem value="warm" aria-label="Warm indoor">
        Warm
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};
