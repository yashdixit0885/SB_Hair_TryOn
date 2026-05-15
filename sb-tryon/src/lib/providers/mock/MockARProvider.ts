import {
  FaceLandmarker,
  FilesetResolver,
  ImageSegmenter,
  type FaceLandmarkerResult,
  type ImageSegmenterResult,
} from "@mediapipe/tasks-vision";

import type {
  ARProvider,
  FaceDetectionResult,
  SegmentationResult,
} from "@/lib/providers/contracts/ar-provider";
import { ProviderError } from "@/lib/providers/errors";
import {
  getCachedFaceLandmarkerModel,
  getCachedHairSegmentationModel,
} from "@/lib/persistence/model-cache";
import { track, type DeviceClass } from "@/lib/observability/track";

// Pin the WASM bundle URL to the installed package version so the JS wrapper
// and the WASM stay in lockstep.
const MEDIAPIPE_WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";

// Multiclass selfie segmentation emits a 6-category mask:
// 0 = background, 1 = hair, 2 = body-skin, 3 = face-skin, 4 = clothes, 5 = others.
const HAIR_CATEGORY = 1;

type WasmFileset = Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>>;

interface LoadedSegmenter {
  segmenter: ImageSegmenter;
  modelBlobUrl: string;
}

interface LoadedFaceLandmarker {
  landmarker: FaceLandmarker;
  modelBlobUrl: string;
}

export class MockARProvider implements ARProvider {
  private segmenter: ImageSegmenter | null = null;
  private modelBlobUrl: string | null = null;
  private prewarmPromise: Promise<LoadedSegmenter> | null = null;
  private faceLandmarker: FaceLandmarker | null = null;
  private faceModelBlobUrl: string | null = null;
  private facePrewarmPromise: Promise<LoadedFaceLandmarker> | null = null;
  private disposed = false;
  // Shared resolver so loadSegmenter and loadFaceLandmarker never create a
  // second FilesetResolver instance (AC9 — one resolver, one WASM bundle pin).
  private filesetPromise: Promise<WasmFileset> | null = null;

  private getFileset(): Promise<WasmFileset> {
    if (!this.filesetPromise) {
      this.filesetPromise = FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_URL);
    }
    return this.filesetPromise;
  }

  /**
   * Loads the WASM fileset + segmentation model and constructs the
   * ImageSegmenter. Idempotent: concurrent calls share one in-flight load;
   * calls after resolution are no-ops. If a load rejects, the cached promise
   * is cleared so the next call can retry instead of replaying the rejection.
   *
   * NOTE: This does NOT load the face landmarker — that lazy-loads on first
   * `detectFace()` call to keep prewarm cost bounded (the first photo upload
   * absorbs the face-model load latency under the "validating" skeleton).
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
        this.prewarmPromise = null;
        throw err;
      });
    }
    const loaded = await this.prewarmPromise;
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
    const fileset = await this.getFileset();
    const modelBlobUrl = await getCachedHairSegmentationModel();
    const segmenter = await ImageSegmenter.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: modelBlobUrl, delegate: "GPU" },
      runningMode: "IMAGE",
      outputCategoryMask: true,
      outputConfidenceMasks: true,
    });
    return { segmenter, modelBlobUrl };
  }

  private async loadFaceLandmarker(): Promise<LoadedFaceLandmarker> {
    const fileset = await this.getFileset();
    const modelBlobUrl = await getCachedFaceLandmarkerModel();
    const landmarker = await FaceLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: modelBlobUrl },
      runningMode: "IMAGE",
      numFaces: 1,
    });
    return { landmarker, modelBlobUrl };
  }

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
   * Runs MediaPipe FaceLandmarker on the input and reports whether at least
   * one face was detected. Used by `<PhotoUploader>` as the client-side
   * validity gate before opening `<ConsentPrompt>` (Story 1.6, FR1 + FR46).
   *
   * Lazy-loads the face landmarker model on the first call (kept out of
   * prewarm so the upfront cost stays bounded). Subsequent calls reuse the
   * loaded landmarker. Idempotent in-flight-promise pattern mirrors
   * `prewarm()` so concurrent first-call races share one load.
   *
   * Throws `ProviderError("DISPOSED", ...)` post-dispose. Face-not-detected
   * is NOT an error — it returns `{ faceDetected: false }` so `<PhotoUploader>`
   * can branch into the `"error"` state without an exception.
   */
  async detectFace(image: ImageBitmap): Promise<FaceDetectionResult> {
    if (this.disposed) {
      throw new ProviderError(
        "DISPOSED",
        "AR provider was disposed; create a new instance to render again.",
      );
    }
    if (!this.faceLandmarker) {
      if (!this.facePrewarmPromise) {
        this.facePrewarmPromise = this.loadFaceLandmarker().catch((err) => {
          this.facePrewarmPromise = null;
          throw err;
        });
      }
      const loaded = await this.facePrewarmPromise;
      if (this.disposed) {
        // dispose() may have already closed this landmarker if it ran between
        // facePrewarmPromise resolving and this check. Guard against double-close.
        try {
          loaded.landmarker.close();
        } catch {
          // already closed by dispose()
        }
        URL.revokeObjectURL(loaded.modelBlobUrl);
        throw new ProviderError(
          "DISPOSED",
          "AR provider was disposed; create a new instance to render again.",
        );
      }
      // Guard against concurrent detectFace calls both awaiting the same promise.
      if (!this.faceLandmarker) {
        this.faceLandmarker = loaded.landmarker;
        this.faceModelBlobUrl = loaded.modelBlobUrl;
      }
    }
    const landmarker = this.faceLandmarker;
    if (!landmarker) {
      throw new ProviderError(
        "FACE_LANDMARKER_UNAVAILABLE",
        "Face landmarker failed to initialize.",
      );
    }

    let result: FaceLandmarkerResult;
    try {
      result = landmarker.detect(image);
    } catch (err) {
      throw new ProviderError(
        "DETECT_FAILED",
        `Face detection failed: ${String(err)}`,
      );
    }
    const faces = result.faceLandmarks ?? [];
    if (faces.length === 0) {
      return { faceDetected: false };
    }
    // Story 1.6 only branches on faceDetected; confidence of 1.0 when a face
    // is present is sufficient. The blendshapes parse can come later.
    return { faceDetected: true, confidence: 1 };
  }

  /**
   * Releases the underlying segmenter + face landmarker, revokes cached
   * model Blob URLs, and marks the provider disposed. After dispose, all
   * methods fail fast with `ProviderError("DISPOSED", ...)`. Idempotent.
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
    if (this.faceLandmarker) {
      this.faceLandmarker.close();
      this.faceLandmarker = null;
    }
    if (this.faceModelBlobUrl) {
      URL.revokeObjectURL(this.faceModelBlobUrl);
      this.faceModelBlobUrl = null;
    }
    this.prewarmPromise = null;
    this.facePrewarmPromise = null;
  }
}

function detectDeviceClass(): DeviceClass {
  if (typeof navigator === "undefined") return "unknown";
  return /Mobi|Android|iPhone/.test(navigator.userAgent) ? "mobile" : "laptop";
}
