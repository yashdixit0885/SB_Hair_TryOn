import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const meta = {
  title: "UI/Popover",
  component: Popover,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">Show source</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Source attribution details">
        <h3 className="text-base font-semibold">Source-attribution</h3>
        <p className="mt-2 text-base text-(--color-text-secondary)">
          Reviews are tagged with their origin: native, brand-published,
          stylist-attested, or third-party ingested.
        </p>
      </PopoverContent>
    </Popover>
  ),
};

export const OpenByDefault: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="secondary">Show source</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Reviewer count">
        <p className="text-base">This look was reviewed by 14 stylists.</p>
      </PopoverContent>
    </Popover>
  ),
};
