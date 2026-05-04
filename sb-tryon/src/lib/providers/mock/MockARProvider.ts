import { ProviderError } from "@/lib/providers/errors";
import type {
  ARProvider,
  SegmentationResult,
} from "@/lib/providers/contracts/ar-provider";

// STUB — placeholder so factory.ts compiles.
// Real implementation: Story 1.5 (MediaPipe Tasks Vision-backed segmentation pipeline).
export class MockARProvider implements ARProvider {
  async prewarm(): Promise<void> {
    await this.notImplemented("prewarm");
  }
  async segment(_image: ImageBitmap): Promise<SegmentationResult> {
    return await this.notImplemented("segment");
  }
  async dispose(): Promise<void> {
    await this.notImplemented("dispose");
  }
  private async notImplemented(method: string): Promise<never> {
    await sleep();
    throw new ProviderError(
      "NOT_IMPLEMENTED",
      `MockARProvider.${method} is not yet implemented. See Story 1.5.`,
    );
  }
}

// 50-200ms realistic latency so the demo never feels suspiciously instant
// (architecture §5 — "Mock providers introduce realistic latency so demo feels real").
function sleep(): Promise<void> {
  /* c8 ignore next 2 */
  if (process.env.NODE_ENV === "test") return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 150));
}
