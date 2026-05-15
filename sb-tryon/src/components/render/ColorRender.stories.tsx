import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProvidersContext, createMockProviders } from "@/lib/providers";
import { noopArProvider } from "@/test-utils/noop-ar-provider";
import { ColorRender } from "./ColorRender";

// AC8 — required variants: NoColor, Segmenting, Rendered, LowConfidence,
// WebGL2Fallback, Error. All must pass axe-core (enforced by storybook Vitest).

const meta: Meta<typeof ColorRender> = {
  title: "render/ColorRender",
  component: ColorRender,
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        searchParams: new URLSearchParams("color=auburn"),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ColorRender>;

const photo = new Blob(["fake-photo-data"], { type: "image/jpeg" });

// AR that never resolves — keeps component in "segmenting" state for the story.
const segmentingAr: ReturnType<typeof noopArProvider> = {
  ...noopArProvider(),
  segment: () => new Promise(() => {}),
};

// AR that immediately rejects — sets component to "error" state.
const errorAr: ReturnType<typeof noopArProvider> = {
  ...noopArProvider(),
  segment: async () => { throw new Error("Simulated segment failure"); },
};

export const NoColor: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        searchParams: new URLSearchParams(""),
      },
    },
  },
  args: {
    photo,
  },
};

export const Segmenting: Story = {
  decorators: [
    (Story) => (
      <ProvidersContext.Provider value={createMockProviders({ overrides: { ar: segmentingAr } })}>
        <Story />
      </ProvidersContext.Provider>
    ),
  ],
  args: { photo },
};

export const Rendered: Story = {
  decorators: [
    (Story) => (
      <ProvidersContext.Provider value={createMockProviders({ overrides: { ar: noopArProvider({ confidence: 0.92 }) } })}>
        <Story />
      </ProvidersContext.Provider>
    ),
  ],
  args: { photo },
};

export const LowConfidence: Story = {
  decorators: [
    (Story) => (
      <ProvidersContext.Provider value={createMockProviders({ overrides: { ar: noopArProvider({ confidence: 0.3 }) } })}>
        <Story />
      </ProvidersContext.Provider>
    ),
  ],
  args: { photo },
};

export const WebGL2Fallback: Story = {
  name: "WebGL2Fallback (Canvas2D)",
  // In Storybook's browser environment WebGL2 is available, so this story
  // renders via the WebGL2 path (visually equivalent). The Canvas2D fallback
  // path is covered by Vitest unit tests (hasWebGL2Support mocked to false).
  decorators: [
    (Story) => (
      <ProvidersContext.Provider value={createMockProviders({ overrides: { ar: noopArProvider({ confidence: 0.92 }) } })}>
        <Story />
      </ProvidersContext.Provider>
    ),
  ],
  args: { photo },
};

// Named ErrorState to avoid shadowing the global Error constructor in this file.
export const ErrorState: Story = {
  name: "Error",
  decorators: [
    (Story) => (
      <ProvidersContext.Provider value={createMockProviders({ overrides: { ar: errorAr } })}>
        <Story />
      </ProvidersContext.Provider>
    ),
  ],
  args: { photo },
};
