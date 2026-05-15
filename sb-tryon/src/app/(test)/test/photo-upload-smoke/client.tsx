"use client";

import { useMemo, useState } from "react";

import { ProvidersContext } from "@/lib/providers";
import { createMockProviders } from "@/lib/providers";
import { noopArProvider } from "@/test-utils/noop-ar-provider";
import { PhotoUploader } from "@/components/render/PhotoUploader";

// Inject the no-op AR provider so face detection is deterministic
// regardless of MediaPipe availability — the FR46 invariant is about the
// consent re-prompt cycle, not face-detection accuracy.

export function PhotoUploadSmokeClient() {
  const providers = useMemo(
    () => createMockProviders({ overrides: { ar: noopArProvider() } }),
    [],
  );
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [declinedCount, setDeclinedCount] = useState(0);

  return (
    <ProvidersContext.Provider value={providers}>
      <main
        data-uploader-ready="true"
        data-confirmed-count={confirmedCount}
        data-declined-count={declinedCount}
        style={{ padding: 24, fontFamily: "system-ui, sans-serif", maxWidth: 480 }}
      >
        <h1>Photo Upload Smoke Harness</h1>
        <PhotoUploader
          onPhotoConfirmed={() => setConfirmedCount((c) => c + 1)}
          onDeclined={() => setDeclinedCount((c) => c + 1)}
        />
      </main>
    </ProvidersContext.Provider>
  );
}
