// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Build / test outputs that contain bundled / generated JS we never want to lint.
    "coverage/**",
    "storybook-static/**",
    "test-results/**",
    "playwright-report/**",
    ".lighthouseci/**",
    "*.tsbuildinfo",
    // Root-level CJS config files are CommonJS by extension; the TS-aware
    // `no-require-imports` rule shipped by eslint-config-next doesn't
    // exempt them automatically. Their content is Node config, not app code.
    "*.cjs",
  ]),
  ...storybook.configs["flat/recommended"],

  // Architecture §5 — Provider abstraction enforcement (part A).
  // Blocks vendor SDKs that provider implementation files legitimately need
  // (MediaPipe, Twilio, SendGrid). Mock AND production directories are exempt
  // so that Story 1.5 (MockARProvider) and future production implementations
  // can import their SDKs. Feature code and factory cannot.
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: [
      "src/lib/providers/mock/**",
      "src/lib/providers/production/**",
      "src/lib/providers/factory.ts",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@mediapipe/*"],
              message:
                "Import from @/lib/providers, not @mediapipe directly. Vendor SDKs are isolated to provider implementations.",
            },
            {
              group: ["twilio", "@sendgrid/*"],
              message: "Use providers.notification, not vendor SDKs directly.",
            },
          ],
        },
      ],
    },
  },

  // Architecture §5 — Provider abstraction enforcement (part B).
  // Supabase is a DB/auth vendor — mock providers must NEVER import it (mocks
  // are in-memory stubs). Only production implementations are exempt.
  // Also enforces the barrel: callers must import from @/lib/providers, not
  // from the implementation subfolders directly (only factory.ts may do that).
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: [
      "src/lib/providers/production/**",
      "src/lib/providers/factory.ts",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@supabase/*"],
              message:
                "Use providers directly. Vendor SDKs are isolated to src/lib/providers/production/*.",
            },
            {
              group: ["@/lib/providers/mock/*", "@/lib/providers/production/*"],
              message:
                "Import from @/lib/providers (the factory), not implementations directly.",
            },
          ],
        },
      ],
    },
  },

  // Architecture §5 — Consent gate: raw <input type="file"> is blocked everywhere.
  // Use <PhotoUploader> which renders <ConsentPrompt> internally (FR46,
  // cross-cutting concern #2 — biometric privacy).
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXOpeningElement[name.name='input'] > JSXAttribute[name.name='type'][value.value='file']",
          message: "Use <PhotoUploader> — consent flow must wrap photo upload.",
        },
      ],
    },
  },

  // TypeScript strictness — applies to ALL src files including provider impls.
  // No `any`, no `!` non-null assertions. Catches drift early.
  // Underscore-prefixed args/vars are treated as intentionally unused (e.g.
  // contract method parameters in stub providers — the param shapes are part
  // of the interface contract even though stubs don't read them).
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
    },
  },
]);

export default eslintConfig;
