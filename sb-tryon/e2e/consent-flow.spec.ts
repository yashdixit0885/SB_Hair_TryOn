// FR46 invariant: <ConsentPrompt> re-prompts on every photo upload.
// No implicit re-consent — even after a successful "Process locally" grant,
// the next photo upload in the same session opens the prompt again.
//
// Scoped to Chromium only for Story 1.6 (matches Story 1.5's Janelle pattern
// — MediaPipe WASM has been flaky in WebKit/Firefox runners, and the
// harness imports the no-op AR provider but Next.js still bundles the real
// MockARProvider via createMockProviders).

import { existsSync } from "node:fs";
import { join } from "node:path";

import { expect, test } from "@playwright/test";

// Fixture: any face photo will do — FR46 is photo-content-agnostic. Re-use
// the Story 1.5 Type-4 fixture if present; otherwise mark the spec
// `test.fixme` (same pattern as Story 1.5's Janelle smoke).
const FIXTURE_PATH = join(
  __dirname,
  "fixtures",
  "photos",
  "type-4-fixture-1.jpg",
);
const fixtureExists = existsSync(FIXTURE_PATH);
const consentTest = fixtureExists ? test : test.fixme;

test.describe("FR46 — consent re-prompt on every upload", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Consent flow is Chromium-only for Story 1.6",
  );

  consentTest(
    "the prompt re-appears on a second upload after a granted consent",
    async ({ page }) => {
      await page.goto("/test/photo-upload-smoke");

      await expect(page.locator("main")).toHaveAttribute(
        "data-uploader-ready",
        "true",
      );

      // Step 1 — first upload.
      const inputLocator = page.locator('input[type="file"]');
      await inputLocator.setInputFiles(FIXTURE_PATH);

      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible({ timeout: 30_000 });

      // Sanity check the prompt structure — accessible name + 3 radio options.
      await expect(dialog).toContainText(/Process your photo\?/i);
      await expect(
        page.getByRole("radio", { name: /locally only/i }),
      ).toBeVisible();
      await expect(
        page.getByRole("radio", { name: /save to my account/i }),
      ).toBeVisible();
      await expect(
        page.getByRole("radio", { name: /Decline/i }),
      ).toBeVisible();

      // Continue with default "local" selected.
      await page.getByRole("button", { name: /Continue/i }).click();
      await expect(dialog).toBeHidden();

      await expect(page.locator("main")).toHaveAttribute(
        "data-confirmed-count",
        "1",
      );

      // Step 2 — FR46: delete + upload again, prompt MUST re-open.
      await page.getByRole("button", { name: /Delete photo/i }).click();
      await inputLocator.setInputFiles(FIXTURE_PATH);
      await expect(dialog).toBeVisible({ timeout: 30_000 });
    },
  );
});
