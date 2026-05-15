import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { noopArProvider } from "@/test-utils/noop-ar-provider";
import { PhotoUploader } from "./PhotoUploader";

// AC11 — at minimum Default + Error. The Storybook decorator at
// .storybook/preview.tsx already provides a default no-op AR provider; the
// `Error` story overrides it via story-local decoration with
// `{ faceDetected: false }` so the no-face error state can be exercised.

const meta: Meta<typeof PhotoUploader> = {
  title: "render/PhotoUploader",
  component: PhotoUploader,
  args: {
    onPhotoConfirmed: () => {},
    onDeclined: () => {},
  },
};

export default meta;

export const Default: StoryObj<typeof PhotoUploader> = {};

export const ErrorNoFace: StoryObj<typeof PhotoUploader> = {
  parameters: {
    providers: { ar: noopArProvider({ faceDetected: false }) },
  },
};

async function createTestJpeg(): Promise<File> {
  const canvas = document.createElement("canvas");
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#888888";
    ctx.fillRect(0, 0, 100, 100);
  }
  return new Promise<File>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) { reject(new Error("canvas.toBlob returned null")); return; }
      resolve(new File([blob], "test-photo.jpg", { type: "image/jpeg" }));
    }, "image/jpeg");
  });
}

// Renders the validated state with <ConsentPrompt> open. Requires a real
// browser environment (canvas + createImageBitmap); does not run in jsdom.
export const WithPhotoLoaded: StoryObj<typeof PhotoUploader> = {
  play: async ({ canvasElement }) => {
    const { userEvent } = await import("storybook/test");
    const input = canvasElement.querySelector<HTMLInputElement>(
      "#photo-uploader-input",
    );
    if (!input) return;
    const file = await createTestJpeg();
    await userEvent.upload(input, file);
  },
};
