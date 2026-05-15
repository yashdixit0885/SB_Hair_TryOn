// ARProvider — hair segmentation + face detection + render pipeline.
// Mock implementation: src/lib/providers/mock/MockARProvider.ts (Story 1.5 — MediaPipe Tasks Vision).
// Production implementation: licensed AR SDK (Perfect Corp / ModiFace / Banuba) post-funding.

export interface SegmentationResult {
  alphaMask: Uint8ClampedArray; // category-1 hair mask, same dims as input
  confidence: number; // 0-1; below threshold → DemoFallbackPath (UX honesty pattern #2)
  width: number;
  height: number;
}

// MediaPipe FaceLandmarker presence-detection result. <PhotoUploader>
// (Story 1.6) only consumes `faceDetected` as the validity gate before
// opening <ConsentPrompt>; `confidence` is included for future face-aligned
// render. The full 478-landmark array is intentionally omitted from the
// contract — a future story can add it when needed.
export interface FaceDetectionResult {
  faceDetected: boolean;
  confidence?: number;
}

export interface ARProvider {
  prewarm(): Promise<void>;
  segment(image: ImageBitmap): Promise<SegmentationResult>;
  detectFace(image: ImageBitmap): Promise<FaceDetectionResult>;
  dispose(): Promise<void>;
}
