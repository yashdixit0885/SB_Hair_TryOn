import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RenderConfidenceBanner } from "./RenderConfidenceBanner";

const meta: Meta<typeof RenderConfidenceBanner> = {
  title: "render/RenderConfidenceBanner",
  component: RenderConfidenceBanner,
};

export default meta;

export const Default: StoryObj<typeof RenderConfidenceBanner> = {};
