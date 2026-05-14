"use client";

import { useEffect, useState } from "react";
import { createMockProviders } from "@/lib/providers";
import type {
  ARProvider,
  SegmentationResult,
} from "@/lib/providers/contracts/ar-provider";

declare global {
  interface Window {
    __arSmokeHarness?: {
      prewarm: () => Promise<void>;
      segment: (bitmap: ImageBitmap) => Promise<SegmentationResult>;
    };
  }
}

export function ArSmokeClient() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const provider: ARProvider = createMockProviders().ar;
    window.__arSmokeHarness = {
      prewarm: () => provider.prewarm(),
      segment: (bitmap) => provider.segment(bitmap),
    };
    provider
      .prewarm()
      .then(() => setReady(true))
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : String(e));
      });

    return () => {
      provider.dispose().catch(() => {});
      delete window.__arSmokeHarness;
    };
  }, []);

  return (
    <main
      data-ar-ready={ready ? "true" : "false"}
      data-ar-error={error ?? ""}
      style={{ padding: 24, fontFamily: "monospace" }}
    >
      <h1>AR Smoke Harness</h1>
      <p>Status: {ready ? "ready" : error ? `error: ${error}` : "loading"}</p>
      <p>
        Use <code>window.__arSmokeHarness.segment(bitmap)</code> from the
        Playwright spec.
      </p>
    </main>
  );
}
