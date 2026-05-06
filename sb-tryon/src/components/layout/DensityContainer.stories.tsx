import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DensityContainer } from "./DensityContainer";

const meta = {
  title: "Layout/DensityContainer",
  component: DensityContainer,
  parameters: { layout: "centered" },
} satisfies Meta<typeof DensityContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

function Sample() {
  return (
    <div className="flex flex-col gap-4 p-6 bg-(--color-bg-elevated) rounded-md border border-(--color-border-subtle) min-w-72">
      <div className="flex flex-col gap-2">
        <Label htmlFor="density-sample-input">Color name</Label>
        <Input id="density-sample-input" placeholder="Auburn" />
      </div>
      <div className="flex gap-3">
        <Button variant="primary">Save look</Button>
        <Button variant="secondary">Try another color</Button>
      </div>
    </div>
  );
}

export const Comfortable: Story = {
  args: { density: "comfortable", children: <Sample /> },
};

export const Compact: Story = {
  args: { density: "compact", children: <Sample /> },
};
