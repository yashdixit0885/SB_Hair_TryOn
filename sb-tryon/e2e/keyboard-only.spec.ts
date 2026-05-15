import { expect, test, type Page } from "@playwright/test";

// NFR23 — keyboard-only navigation must work end-to-end across every PageShell
// route. Story 1.4 ships the home page (the only PageShell-using route at this
// stage); later stories extend this spec as they add routes (1.6+, 5.x, 6.x).
//
// WebKit (Safari) requires Alt+Tab rather than Tab to traverse non-form
// elements — Apple ships "Press Tab to highlight each item on a webpage" off
// by default. The helper picks the right keystroke per browser so the spec
// reflects real-user keyboard behavior on each platform.

async function tab(page: Page, browserName: string): Promise<void> {
  if (browserName === "webkit") {
    await page.keyboard.press("Alt+Tab");
  } else {
    await page.keyboard.press("Tab");
  }
}

test.describe("Keyboard-only navigation (NFR23)", () => {
  test("home page tab order starts with skip link, then header brand mark", async ({
    page,
    browserName,
  }) => {
    await page.goto("/");

    // First Tab should land on the skip link — the bypass-blocks affordance
    // must be the first focusable element on every page (UX-DR12, WCAG 2.4.1).
    await tab(page, browserName);
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeFocused();

    // Next Tab leaves the skip link and lands on the brand mark inside the
    // banner (the consumer header's first interactive element).
    await tab(page, browserName);
    const brandLink = page.locator('header[role="banner"] a').first();
    await expect(brandLink).toBeFocused();
  });

  test("activating the skip link moves focus into <main>", async ({ page }) => {
    await page.goto("/");
    const skipLink = page.locator('a[href="#main-content"]');
    await skipLink.focus();
    await page.keyboard.press("Enter");

    const main = page.locator("main#main-content");
    await expect(main).toBeFocused();
  });

  // AC7 (Story 1.7) — the ColorRender canvas is keyboard-reachable via Tab.
  // ?color=auburn ensures a colorId is present so the canvas is visible
  // (without it, colorId is null and the canvas is hidden with display:none).
  test("color-render canvas is keyboard-reachable via Tab", async ({
    page,
    browserName,
  }) => {
    await page.goto("/test/color-render-smoke?color=auburn");

    // Tab until focus lands on the canvas (tabIndex={0})
    // Limit to 10 tabs to avoid an infinite loop if the canvas is missing.
    let canvasFocused = false;
    for (let i = 0; i < 10; i++) {
      await tab(page, browserName);
      const canvas = page.locator("canvas");
      if (await canvas.count() > 0 && await canvas.first().evaluate((el) => el === document.activeElement)) {
        canvasFocused = true;
        break;
      }
    }
    expect(canvasFocused).toBe(true);
  });
});
