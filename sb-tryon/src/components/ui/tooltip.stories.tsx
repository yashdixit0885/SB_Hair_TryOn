import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "./button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="secondary">Hover for source</Button>
      </TooltipTrigger>
      <TooltipContent>Native review by Maya</TooltipContent>
    </Tooltip>
  ),
};

export const OpenByDefault: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger asChild>
        <Button variant="secondary">Hover for source</Button>
      </TooltipTrigger>
      <TooltipContent>Native review by Maya</TooltipContent>
    </Tooltip>
  ),
};
