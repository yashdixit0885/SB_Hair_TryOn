// No-op AR provider used by unit tests, Storybook stories, and any other
// surface that needs the AR contract satisfied without loading MediaPipe.
// Returns deterministic results so component tests get stable values to
// assert on. Story 1.6: `detectFace()` returns `{ faceDetected: true }` by
// default; pass `{ faceDetected: false }` to exercise `<PhotoUploader>`'s
// error state.

import type {
  ARProvider,
  FaceDetectionResult,
  SegmentationResult,
} from "@/lib/providers/contracts/ar-provider";

const DEFAULT_WIDTH = 256;
const DEFAULT_HEIGHT = 256;

interface NoopArProviderOptions {
  width?: number;
  height?: number;
  confidence?: number;
  /** Override the FaceDetectionResult `faceDetected` flag. Default true. */
  faceDetected?: boolean;
}

/**
 * Returns an `ARProvider` whose `segment()` produces a deterministic
 * full-coverage hair mask and whose `detectFace()` returns
 * `{ faceDetected: true, confidence: 1 }` (overridable via `faceDetected`)
 * — all without ever importing `@mediapipe/tasks-vision`. Safe to use in
 * `vi.test`, `.stories.tsx` decorators, and the `.storybook/` preview config.
 *
 * Each `segment()` call returns a **fresh** `Uint8ClampedArray` and each
 * `detectFace()` call returns a fresh object literal so caller mutations
 * don't leak between successive calls on the same provider.
 */
export function noopArProvider(options: NoopArProviderOptions = {}): ARProvider {
  const width = options.width ?? DEFAULT_WIDTH;
  const height = options.height ?? DEFAULT_HEIGHT;
  const confidence = options.confidence ?? 1;
  const faceDetected = options.faceDetected ?? true;
  return {
    async prewarm() {},
    async segment(): Promise<SegmentationResult> {
      const alphaMask = new Uint8ClampedArray(width * height).fill(255);
      return { alphaMask, confidence, width, height };
    },
    async detectFace(): Promise<FaceDetectionResult> {
      return faceDetected
        ? { faceDetected: true, confidence: 1 }
        : { faceDetected: false };
    },
    async dispose() {},
  };
}
