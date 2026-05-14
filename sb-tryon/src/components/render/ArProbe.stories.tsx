import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArProbe } from "./ArProbe";

// AC15 clause 4 — verifies the Storybook decorator's no-op AR override.
// If the decorator swap regresses (e.g. `.storybook/preview.tsx` reverts to
// `createMockProviders()` without overrides), this story crashes browser-mode
// Vitest when MediaPipe tries to load WASM at story-render time. That crash
// is the regression-detection signal.

const meta: Meta<typeof ArProbe> = {
  title: "render/ArProbe",
  component: ArProbe,
};

export default meta;

export const Default: StoryObj<typeof ArProbe> = {};
