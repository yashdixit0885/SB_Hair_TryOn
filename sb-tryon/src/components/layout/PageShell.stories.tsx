import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PageShell } from "./PageShell";

const meta = {
  title: "Layout/PageShell",
  component: PageShell,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof PageShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Consumer: Story = {
  args: {
    variant: "consumer",
    children: (
      <div className="py-12">
        <h1 className="text-display font-semibold text-(--color-text-primary) tracking-tight">
          Try color before you commit.
        </h1>
        <p className="mt-6 text-lg text-(--color-text-secondary) leading-relaxed max-w-2xl">
          Brand-neutral hair color try-on — see yourself in any color, with
          realistic fade, calibrated lighting, and outcome-anchored reviews
          from real customers.
        </p>
      </div>
    ),
  },
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
    children: (
      <div>
        <h1 className="text-xl font-semibold text-(--color-text-primary)">
          Operator dashboard
        </h1>
        <p className="mt-3 text-base text-(--color-text-secondary)">
          Compact density — tight inter-row spacing, dense data tables.
        </p>
      </div>
    ),
  },
};

export const Stylist: Story = {
  args: {
    variant: "stylist",
    children: (
      <div>
        <h1 className="text-xl font-semibold text-(--color-text-primary)">
          Today&apos;s saved looks
        </h1>
        <p className="mt-3 text-base text-(--color-text-secondary)">
          iPad-landscape optimized stylist surface.
        </p>
      </div>
    ),
  },
};

export const WithError: Story = {
  args: {
    variant: "consumer",
    error: {
      message: "We couldn't load your render. Try again in a moment.",
      onRetry: () => {},
    },
    children: (
      <div className="py-6">
        <h1 className="text-xl font-semibold text-(--color-text-primary)">
          Try-on
        </h1>
      </div>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    variant: "consumer",
    footer: (
      <small className="text-(--color-text-secondary) text-xs">
        Sally Beauty Try-On — demo build
      </small>
    ),
    children: (
      <div className="py-12">
        <h1 className="text-display font-semibold text-(--color-text-primary) tracking-tight">
          Try color before you commit.
        </h1>
      </div>
    ),
  },
};
