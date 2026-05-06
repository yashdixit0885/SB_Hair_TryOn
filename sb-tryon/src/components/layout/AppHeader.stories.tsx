import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { AppHeader } from "./AppHeader";

const meta = {
  title: "Layout/AppHeader",
  component: AppHeader,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Consumer: Story = {
  args: { variant: "consumer" },
};

export const Operator: Story = {
  args: {
    variant: "operator",
    sections: [
      { label: "Dashboard", href: "/dashboard", current: true },
      { label: "Stylists", href: "/dashboard/stylists" },
      { label: "Pull-through", href: "/dashboard/pull-through" },
      { label: "Re-order", href: "/dashboard/reorder" },
      { label: "Reviews", href: "/dashboard/reviews" },
    ],
  },
  render: (args) => (
    <div className="min-h-screen bg-(--color-bg-base) relative">
      <AppHeader {...args} />
      <main className="pl-64 px-8 py-6">
        <p className="text-base text-(--color-text-secondary)">
          Operator surface preview — main content region.
        </p>
      </main>
    </div>
  ),
};

export const Stylist: Story = {
  args: { variant: "stylist" },
};
