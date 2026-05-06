import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SkipToContent } from "./SkipToContent";

const meta = {
  title: "Layout/SkipToContent",
  component: SkipToContent,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SkipToContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-(--color-bg-base)">
      <SkipToContent />
      <div
        tabIndex={0}
        className="m-4 rounded-md border border-(--color-border-subtle) bg-(--color-bg-elevated) p-4 text-base text-(--color-text-secondary)"
      >
        Tab here, then Tab once more — the skip link reveals at the top-left.
      </div>
      <main
        id="main-content"
        tabIndex={-1}
        className="px-6 py-12 max-w-3xl mx-auto"
      >
        <h1 className="text-display font-semibold text-(--color-text-primary) tracking-tight">
          Main content target
        </h1>
        <p className="mt-4 text-base text-(--color-text-secondary)">
          Activating the skip link moves focus here.
        </p>
      </main>
    </div>
  ),
};
