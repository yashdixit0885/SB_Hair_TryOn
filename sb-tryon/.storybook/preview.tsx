import * as React from "react";
import type { Preview } from "@storybook/nextjs-vite";
import { ProvidersContext, createMockProviders } from "@/lib/providers";
import { noopArProvider } from "@/test-utils/noop-ar-provider";
import "../src/app/globals.css";

// Swap in the no-op AR provider so AR-touching stories don't load MediaPipe
// at story-render time (which would crash browser-mode Vitest under jsdom +
// the storybook addon). Story 1.7+ stories opt back into a real provider
// only when needed.
const providers = createMockProviders({ overrides: { ar: noopArProvider() } });

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
      <ProvidersContext.Provider value={providers}>
        <Story />
      </ProvidersContext.Provider>
    ),
  ],
};

export default preview;
