import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ScrollArea } from "./scroll-area";

const meta = {
  title: "UI/ScrollArea",
  component: ScrollArea,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-48 w-64 rounded-md border border-(--color-border-subtle) bg-(--color-bg-elevated)">
      <div className="flex flex-col gap-2 p-3">
        {Array.from({ length: 25 }, (_, i) => (
          <p key={i} className="text-base text-(--color-text-primary)">
            Outcome row {i + 1}
          </p>
        ))}
      </div>
    </ScrollArea>
  ),
};
