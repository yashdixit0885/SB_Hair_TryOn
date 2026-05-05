import * as React from "react";
import type { Preview } from "@storybook/nextjs-vite";
import { ProvidersContext, createMockProviders } from "@/lib/providers";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'error' = fail CI on any a11y violation (NFR23).
      test: "error",
    },
  },
  decorators: [
    (Story) => (
      <ProvidersContext.Provider value={createMockProviders()}>
        <Story />
      </ProvidersContext.Provider>
    ),
  ],
};

export default preview;
