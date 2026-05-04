// ARProvider — hair segmentation + render pipeline.
// Mock implementation: src/lib/providers/mock/MockARProvider.ts (Story 1.5 — MediaPipe Tasks Vision).
// Production implementation: licensed AR SDK (Perfect Corp / ModiFace / Banuba) post-funding.

export interface SegmentationResult {
  alphaMask: Uint8ClampedArray; // category-1 hair mask, same dims as input
  confidence: number; // 0-1; below threshold → DemoFallbackPath (UX honesty pattern #2)
  width: number;
  height: number;
}

export interface ARProvider {
  prewarm(): Promise<void>;
  segment(image: ImageBitmap): Promise<SegmentationResult>;
  dispose(): Promise<void>;
}
