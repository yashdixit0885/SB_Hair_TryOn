// Test harness route — guarded behind NEXT_PUBLIC_TEST_HARNESS=1 (set in
// playwright.config.ts webServer.env). Visiting `/test/ar-smoke` without
// that env flag returns 404, so a curious user landing on the URL in
// production never sees the harness.
//
// The page mounts a real MockARProvider and exposes `prewarm` + `segment`
// on `window.__arSmokeHarness` for the Playwright spec to drive. Story 1.13
// will replace this stub flow with the real <DemoFallbackPath> path.

import { notFound } from "next/navigation";
import { ArSmokeClient } from "./client";

export default function ArSmokePage() {
  if (process.env.NEXT_PUBLIC_TEST_HARNESS !== "1") {
    notFound();
  }
  return <ArSmokeClient />;
}
