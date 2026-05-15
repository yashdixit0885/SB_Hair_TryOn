// Test harness route — guarded behind NEXT_PUBLIC_TEST_HARNESS=1 (set in
// playwright.config.ts webServer.env). Visiting /test/color-render-smoke
// without that env flag returns 404, so a curious user landing on the URL
// in production never sees the harness.
//
// The page mounts <ColorRender> with a synthetic fixture Blob so the
// keyboard-only.spec.ts and any future smoke tests can verify the canvas
// is keyboard-reachable and the render pipeline wires up correctly.

import { notFound } from "next/navigation";
import { ColorRenderSmokeClient } from "./client";

export default function ColorRenderSmokePage() {
  if (process.env.NEXT_PUBLIC_TEST_HARNESS !== "1") {
    notFound();
  }
  return <ColorRenderSmokeClient />;
}
