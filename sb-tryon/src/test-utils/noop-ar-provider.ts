// No-op AR provider used by unit tests, Storybook stories, and any other
// surface that needs the AR contract satisfied without loading MediaPipe.
// Returns a deterministic `SegmentationResult` (configurable confidence,
// full alpha mask) so component tests get stable values to assert on.

import type {
  ARProvider,
  SegmentationResult,
} from "@/lib/providers/contracts/ar-provider";

const DEFAULT_WIDTH = 256;
const DEFAULT_HEIGHT = 256;

interface NoopArProviderOptions {
  width?: number;
  height?: number;
  confidence?: number;
}

/**
 * Returns an `ARProvider` whose `segment()` produces a deterministic
 * full-coverage hair mask without ever importing `@mediapipe/tasks-vision`.
 * Safe to use in `vi.test`, `.stories.tsx` decorators, and the `.storybook/`
 * preview config.
 *
 * Each `segment()` call returns a **fresh** `Uint8ClampedArray` so caller
 * mutations don't leak between successive calls on the same provider.
 */
export function noopArProvider(options: NoopArProviderOptions = {}): ARProvider {
  const width = options.width ?? DEFAULT_WIDTH;
  const height = options.height ?? DEFAULT_HEIGHT;
  const confidence = options.confidence ?? 1;
  return {
    async prewarm() {},
    async segment(): Promise<SegmentationResult> {
      const alphaMask = new Uint8ClampedArray(width * height).fill(255);
      return { alphaMask, confidence, width, height };
    },
    async dispose() {},
  };
}
