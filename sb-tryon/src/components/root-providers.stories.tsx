import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { RootProviders } from "./root-providers";

const meta: Meta<typeof RootProviders> = {
  title: "Layout/RootProviders",
  component: RootProviders,
  parameters: {
    docs: {
      description: {
        component:
          "Root client-side wrapper that provides `ProvidersContext` and `QueryClientProvider` to the entire app tree. Not intended to be composed in feature stories — use the Storybook `preview.ts` decorator which wraps every story automatically.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof RootProviders>;

export const Default: Story = {
  args: {
    children: <div style={{ padding: 16 }}>Child content renders here.</div>,
  },
};
