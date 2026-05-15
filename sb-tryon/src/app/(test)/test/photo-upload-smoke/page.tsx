// Test harness route — guarded behind NEXT_PUBLIC_TEST_HARNESS=1 (set in
// playwright.config.ts webServer.env). Visiting /test/photo-upload-smoke
// without that env flag returns 404, so a curious user landing on the URL
// in production never sees the harness.
//
// The page mounts a real <PhotoUploader> (which renders <ConsentPrompt>
// internally) so the consent-flow.spec.ts can drive the full upload +
// consent path end-to-end. The AR provider used here is the no-op test
// stub injected by the client component — MediaPipe never loads, so the
// FR46 re-prompt invariant can be exercised without WASM cost.

import { notFound } from "next/navigation";
import { PhotoUploadSmokeClient } from "./client";

export default function PhotoUploadSmokePage() {
  if (process.env.NEXT_PUBLIC_TEST_HARNESS !== "1") {
    notFound();
  }
  return <PhotoUploadSmokeClient />;
}
