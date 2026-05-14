// Architecture handoff step 5 — binary trust gate for Janelle's flow.
// MediaPipe Tasks Vision is asked to segment a Type-4 reference photo via the
// `/test/ar-smoke` harness; if it can produce a non-empty hair mask with
// non-zero confidence, Stories 1.7+ build on top. This is a **feasibility
// smoke test**, not a visual-quality assertion — Story 1.13
// (`<DemoFallbackPath>`) carries the visual-quality bar.
//
// Scoped to Chromium only for Story 1.5 (MediaPipe WASM has been flaky in
// Playwright's WebKit/Firefox runners). Cross-browser expands when Story
// 1.10 composes the full `/try-on` route.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { expect, test } from "@playwright/test";

const FIXTURE_PATH = join(
  __dirname,
  "fixtures",
  "photos",
  "type-4-fixture-1.jpg",
);

// The fixture photo is committed only once a copyright-clear Type-4
// reference is provided (see fixtures/photos/README.md). Until then, we mark
// the smoke test as `test.fixme` — Playwright reports it as expected-to-be-
// filled but does not fail the suite. Swap to `test()` once the fixture lands.
const fixtureExists = existsSync(FIXTURE_PATH);
const smokeTest = fixtureExists ? test : test.fixme;

test.describe("Janelle — Type-4 segmentation feasibility (AC14)", () => {
  // Chromium-only for Story 1.5; revisit when Story 1.10 composes the full
  // route. MediaPipe WASM has been flaky in WebKit/Firefox runners.
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "AR smoke is Chromium-only for Story 1.5",
  );

  smokeTest("MediaPipe segments a Type-4 fixture photo end-to-end", async ({ page }) => {
    await page.goto("/test/ar-smoke");

    // Wait for prewarm to finish. On failure, surface the harness's
    // `data-ar-error` attribute in the test failure for a useful CI report
    // (otherwise we'd only see a generic Playwright timeout).
    try {
      await expect(page.locator("main")).toHaveAttribute(
        "data-ar-ready",
        "true",
        { timeout: 60_000 }, // first-run prewarm includes a ~3MB CDN fetch
      );
    } catch (err) {
      const reportedError = await page
        .locator("main")
        .getAttribute("data-ar-error")
        .catch(() => null);
      throw new Error(
        `AR smoke harness never reached ready state. Harness reported: ${reportedError ?? "(no error attribute)"}\n${err instanceof Error ? err.message : String(err)}`,
      );
    }

    // Read the fixture from disk and pass to the page as base64. Playwright's
    // request.get does not reliably accept `file://` URLs across versions.
    const base64 = readFileSync(FIXTURE_PATH).toString("base64");

    const result = await page.evaluate(async (b64: string) => {
      const byteString = atob(b64);
      const bytes = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        bytes[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "image/jpeg" });
      const bitmap = await createImageBitmap(blob);
      const harness = window.__arSmokeHarness;
      if (!harness) throw new Error("AR smoke harness not exposed on window");
      const out = await harness.segment(bitmap);
      return {
        width: out.width,
        height: out.height,
        maskLength: out.alphaMask.length,
        confidence: out.confidence,
      };
    }, base64);

    expect(result.width).toBeGreaterThan(0);
    expect(result.height).toBeGreaterThan(0);
    expect(result.maskLength).toBe(result.width * result.height);
    expect(result.confidence).toBeGreaterThan(0);
  });
});
