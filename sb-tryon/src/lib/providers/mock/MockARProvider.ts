import {
  FilesetResolver,
  ImageSegmenter,
  type ImageSegmenterResult,
} from "@mediapipe/tasks-vision";

import type {
  ARProvider,
  SegmentationResult,
} from "@/lib/providers/contracts/ar-provider";
import { ProviderError } from "@/lib/providers/errors";
import { getCachedHairSegmentationModel } from "@/lib/persistence/model-cache";
import { track, type DeviceClass } from "@/lib/observability/track";

// Pin the WASM bundle URL to the installed package version so the JS wrapper
// and the WASM stay in lockstep.
const MEDIAPIPE_WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";

// Multiclass selfie segmentation emits a 6-category mask:
// 0 = background, 1 = hair, 2 = body-skin, 3 = face-skin, 4 = clothes, 5 = others.
const HAIR_CATEGORY = 1;

interface LoadedSegmenter {
  segmenter: ImageSegmenter;
  modelBlobUrl: string;
}

export class MockARProvider implements ARProvider {
  private segmenter: ImageSegmenter | null = null;
  private modelBlobUrl: string | null = null;
  private prewarmPromise: Promise<LoadedSegmenter> | null = null;
  private disposed = false;

  /**
   * Loads the WASM fileset + segmentation model and constructs the
   * ImageSegmenter. Idempotent: concurrent calls share one in-flight load;
   * calls after resolution are no-ops. If a load rejects, the cached promise
   * is cleared so the next call can retry instead of replaying the rejection.
   */
  async prewarm(): Promise<void> {
    if (this.disposed) {
      throw new ProviderError(
        "DISPOSED",
        "AR provider was disposed; create a new instance to render again.",
      );
    }
    if (this.segmenter) return;
    if (!this.prewarmPromise) {
      this.prewarmPromise = this.loadSegmenter().catch((err) => {
        // Clear so a retry can re-attempt instead of replaying the rejection.
        this.prewarmPromise = null;
        throw err;
      });
    }
    const loaded = await this.prewarmPromise;
    // If dispose() ran while loadSegmenter was in flight, close the freshly
    // created segmenter and revoke its blob URL so we don't leak GPU + memory.
    if (this.disposed) {
      loaded.segmenter.close();
      URL.revokeObjectURL(loaded.modelBlobUrl);
      throw new ProviderError(
        "DISPOSED",
        "AR provider was disposed; create a new instance to render again.",
      );
    }
    this.segmenter = loaded.segmenter;
    this.modelBlobUrl = loaded.modelBlobUrl;
  }

  private async loadSegmenter(): Promise<LoadedSegmenter> {
    const fileset = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_URL);
    const modelBlobUrl = await getCachedHairSegmentationModel();
    const segmenter = await ImageSegmenter.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: modelBlobUrl, delegate: "GPU" },
      runningMode: "IMAGE",
      outputCategoryMask: true,
      outputConfidenceMasks: true,
    });
    return { segmenter, modelBlobUrl };
  }

  /**
   * Runs hair segmentation on the given image and returns a hair-only alpha
   * mask + a mean-confidence number suitable for the
   * `RENDER_CONFIDENCE_THRESHOLD` gate in `<ColorRender>`.
   *
   * Lazy-bootstraps `prewarm()` if it has not been called explicitly. Throws
   * `ProviderError("NO_HAIR_DETECTED", ...)` when the mask contains zero
   * hair-category pixels.
   */
  async segment(image: ImageBitmap): Promise<SegmentationResult> {
    if (this.disposed) {
      throw new ProviderError(
        "DISPOSED",
        "AR provider was disposed; create a new instance to render again.",
      );
    }
    if (!this.segmenter) {
      await this.prewarm();
    }
    // After prewarm the segmenter is guaranteed non-null; the narrowing
    // closure assertion makes this explicit without a non-null assertion
    // (which is ESLint-blocked).
    const segmenter = this.segmenter;
    if (!segmenter) {
      throw new ProviderError(
        "SEGMENTER_UNAVAILABLE",
        "AR segmenter failed to initialize.",
      );
    }

    const start = performance.now();
    let result: ImageSegmenterResult | undefined;
    let success = false;
    try {
      result = segmenter.segment(image);
      const categoryMask = result.categoryMask;
      if (!categoryMask) {
        throw new ProviderError(
          "NO_HAIR_DETECTED",
          "Could not detect a hair region in this photo. Try a brighter, front-facing photo, or use a curated demo photo.",
        );
      }
      const width = categoryMask.width;
      const height = categoryMask.height;
      const categoryBytes = categoryMask.getAsUint8Array();
      const alphaMask = new Uint8ClampedArray(width * height);
      let hairPixelCount = 0;
      for (let i = 0; i < categoryBytes.length; i++) {
        if (categoryBytes[i] === HAIR_CATEGORY) {
          alphaMask[i] = 255;
          hairPixelCount++;
        }
      }
      if (hairPixelCount === 0) {
        throw new ProviderError(
          "NO_HAIR_DETECTED",
          "Could not detect a hair region in this photo. Try a brighter, front-facing photo, or use a curated demo photo.",
        );
      }
      // Mean of category-1 confidence values restricted to hair pixels.
      const hairConfidenceMask = result.confidenceMasks?.[HAIR_CATEGORY];
      let confidence = 0;
      if (hairConfidenceMask) {
        const confidenceBytes = hairConfidenceMask.getAsFloat32Array();
        let sum = 0;
        for (let i = 0; i < confidenceBytes.length; i++) {
          if (categoryBytes[i] === HAIR_CATEGORY) {
            sum += confidenceBytes[i];
          }
        }
        confidence = sum / hairPixelCount;
      }
      success = true;
      return { alphaMask, confidence, width, height };
    } finally {
      result?.close();
      // Telemetry fires on the success path only — failed segmentations would
      // pollute NFR1 percentile dashboards (typically much shorter than a
      // real run, falsely dragging P95 down).
      if (success) {
        track({
          name: "tryon.segmentation_completed",
          durationMs: performance.now() - start,
          deviceClass: detectDeviceClass(),
        });
      }
    }
  }

  /**
   * Releases the underlying segmenter, revokes the cached model Blob URL,
   * and marks the provider disposed. After dispose, `segment()` fails fast
   * with `ProviderError("DISPOSED", ...)` rather than silently
   * re-initializing. Idempotent.
   */
  async dispose(): Promise<void> {
    this.disposed = true;
    if (this.segmenter) {
      this.segmenter.close();
      this.segmenter = null;
    }
    if (this.modelBlobUrl) {
      URL.revokeObjectURL(this.modelBlobUrl);
      this.modelBlobUrl = null;
    }
    this.prewarmPromise = null;
  }
}

function detectDeviceClass(): DeviceClass {
  if (typeof navigator === "undefined") return "unknown";
  return /Mobi|Android|iPhone/.test(navigator.userAgent) ? "mobile" : "laptop";
}
