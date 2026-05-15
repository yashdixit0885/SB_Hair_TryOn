import path from "node:path";
import { fileURLToPath } from "node:url";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// Two projects:
//  - "unit": jsdom + Testing Library tests for src/lib/** business logic and
//    src/components/** unit tests; coverage thresholds enforce ≥70% on
//    src/lib/** (architecture AR12, NFR39).
//  - "storybook": browser-mode Vitest running every Storybook story through
//    addon-vitest; gives a11y + visual smoke coverage as part of the unit run.
export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [react()],
        resolve: {
          alias: { "@": path.resolve(dirname, "src") },
        },
        test: {
          name: "unit",
          environment: "jsdom",
          globals: true,
          include: [
            "src/lib/**/*.test.{ts,tsx}",
            "src/components/**/*.test.{ts,tsx}",
            "src/test-utils/**/*.test.{ts,tsx}",
            "src/app/**/*.test.{ts,tsx}",
          ],
          setupFiles: ["./vitest.setup.ts"],
        },
      },
      {
        extends: true,
        plugins: [
          storybookTest({ configDir: path.join(dirname, ".storybook") }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
    // Coverage is intentionally at the top level so it applies to the entire
    // test run regardless of which --project is selected. `pnpm test:unit`
    // runs `--project=unit --coverage`; Vitest collects coverage only from
    // files exercised by the unit project and enforces these thresholds
    // against src/lib/** (AR12, NFR39). The storybook project is excluded
    // from coverage collection via the `include` glob.
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/lib/**/*.{ts,tsx}"],
      exclude: ["src/lib/**/*.test.{ts,tsx}", "src/lib/**/*.stories.tsx"],
      thresholds: {
        lines: 70,
        branches: 70,
        functions: 70,
        statements: 70,
      },
    },
  },
});
