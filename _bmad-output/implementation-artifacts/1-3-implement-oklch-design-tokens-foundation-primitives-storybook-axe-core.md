# Story 1.3: Implement OKLCH design tokens + foundation primitives + Storybook + axe-core

**Status:** done

> Validation is optional. Run `validate-story` before `dev-story` if a quality second-pass is wanted.

## Story

As a developer building any UI surface,
I want the OKLCH design token system, the full set of `src/components/ui/*` Radix-wrapped primitives, Storybook scaffolding wrapped in `<ProvidersContext>`, and axe-core integrated into Vitest,
so that every subsequent component story inherits WCAG 2.2 AA structural correctness, the locked tone (UX-DR1, UX-DR2, UX-DR16), and density variants (UX-DR3) without retrofitting (NFR22, NFR23, AR13, UX-DR15).

## Acceptance Criteria

**AC1 — OKLCH design tokens declared in `src/app/globals.css` `@theme` block (Tailwind v4)**

Given UX spec §"Visual Design Foundation" token tables — neutral foundation, single restrained accent, semantic states, source-attribution chips, type scale, weight scale, spacing scale, motion tokens, density variants,
When the developer authors `src/app/globals.css`,
Then the `@theme` block declares every brand token in OKLCH:

- **Neutral foundation:** `--color-bg-base: oklch(0.99 0.005 90)`, `--color-bg-elevated: oklch(0.97 0.005 90)`, `--color-bg-sunken: oklch(0.95 0.005 90)`, `--color-border-subtle: oklch(0.91 0.005 90)`, `--color-border-strong: oklch(0.82 0.008 90)`, `--color-text-primary: oklch(0.18 0.02 90)`, `--color-text-secondary: oklch(0.42 0.015 90)`, `--color-text-tertiary: oklch(0.58 0.01 90)`.
- **Accent:** `--color-accent-primary: oklch(0.55 0.12 45)`, `--color-accent-primary-hover: oklch(0.50 0.13 45)`, `--color-accent-subtle: oklch(0.92 0.04 45)`.
- **Semantic:** `--color-success: oklch(0.45 0.10 145)`, `--color-warning: oklch(0.68 0.13 70)`, `--color-error: oklch(0.50 0.16 25)`.
- **Source-attribution chips** (4): `--color-attribution-google`, `--color-attribution-brand-published`, `--color-attribution-sb-user`, `--color-attribution-stylist-assisted` — chosen so each pair is AA-compliant on `bg-base` (see Dev Notes for picked OKLCH values).
- **Type scale** (5 sizes): `--text-xs: 13px / 1.4`, `--text-base: 16px / 1.55`, `--text-lg: 19px / 1.45`, `--text-xl: 26px / 1.25`, `--text-display: 38px / 1.15` (declared as `--text-{name}` for size and `--text-{name}--line-height` per Tailwind v4 syntax).
- **Weight scale** (3 weights): `--font-weight-normal: 400`, `--font-weight-medium: 500`, `--font-weight-semibold: 600`. **No `--font-weight-bold`** is declared.
- **Spacing scale** (4px base): `--spacing-1: 4px` through `--spacing-32: 128px` declared at `1, 2, 3, 4, 6, 8, 10, 12, 16, 24, 32` per UX spec table.
- **Motion tokens:** `--motion-duration-fast: 150ms`, `--motion-duration-base: 200ms`, `--motion-duration-slow: 300ms`, `--motion-ease: cubic-bezier(0.4, 0, 0.2, 1)`. **No spring physics tokens.**

And the legacy shadcn-init color tokens (`--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--destructive`, `--card`, `--popover`, `--accent`, `--ring`, etc., plus their `--color-*` mappings and the `.dark` block) are removed entirely. The neutral foundation tokens above are the new source of truth; primitives and feature code reference them directly. **No dark-mode tokens in V1** (UX spec §"Color System" — V1 ships light-mode only to avoid scope creep).

**AC2 — Density variants (`density-comfortable`, `density-compact`) wired at the layout-container level**

Given UX-DR3 — descendants read density from a CSS variable, never via prop,
When the developer adds density support,
Then `src/app/globals.css` declares two `@custom-variant` selectors targeting `[data-density="comfortable"]` and `[data-density="compact"]`, and a base CSS rule applies a `--density-scale` CSS custom property (1.0 for comfortable, 0.75 for compact). Spacing utilities consume this via `calc()` so `density-compact` containers render the next step down on the spacing scale (UX spec §"Spacing & Layout Foundation").

And a documented snippet in `globals.css` shows how to apply density at a layout: `<DensityContainer density="compact">` renders as `<div data-density="compact">`. Component code does not accept a `density` prop directly (UX-DR3, AGENTS.md §1 cross-cutting concern #10). The `DensityContainer` component itself is built in Story 1.4 — this story only ships the token-level scaffolding it consumes.

**AC3 — All 20 foundation primitives in `src/components/ui/*` with colocated tests + stories**

Given UX-DR2's foundation primitive list,
When the developer adds shadcn-pattern Radix-wrapped components,
Then **every one of these files exists** in `src/components/ui/`, each with Radix imports, Tailwind styling using the new OKLCH tokens, and a colocated `*.test.tsx` and `*.stories.tsx` per AR13:

`button.tsx`, `dialog.tsx`, `alert-dialog.tsx`, `popover.tsx`, `select.tsx`, `slider.tsx`, `toast.tsx`, `tabs.tsx`, `toggle-group.tsx`, `tooltip.tsx`, `form.tsx`, `label.tsx`, `input.tsx`, `textarea.tsx`, `checkbox.tsx`, `radio-group.tsx`, `switch.tsx`, `separator.tsx`, `scroll-area.tsx`, `avatar.tsx`.

> **Generation method:** use `pnpm dlx shadcn@latest add <component>` for each. shadcn writes source-owned files into `src/components/ui/` against `components.json` (already configured `style: "radix-nova"`, `baseColor: "neutral"`). After generation, **adapt the styling** to reference the new OKLCH tokens (most shadcn defaults reference `--primary`/`--foreground` etc. — these are removed in AC1, so primitives must be retargeted to `--color-bg-base`, `--color-text-primary`, `--color-accent-primary`, etc.).

And `src/components/ui/button.tsx` enforces verb-driven copy via TSDoc on the `children` prop (UX-DR16) and exposes `variant: "primary" | "secondary" | "tertiary" | "destructive"` (UX-DR9). Focus styles use `outline: 2px solid var(--color-accent-primary); outline-offset: 2px;` — never `outline: none` (UX spec §"Accessibility Considerations").

And every one of those 20 primitives ships with a colocated `*.test.tsx` (rendering smoke + the auto-applied axe-core check from AC5) and a `*.stories.tsx` exercising at least one state per variant the primitive exposes (default + variants + disabled + invalid where applicable). `pnpm check:stories` (already wired) passes.

**AC4 — Storybook decorator wraps every story in `<ProvidersContext.Provider value={createMockProviders()}>` and a11y addon is set to fail mode**

Given Storybook is required for design surface collaboration (UX-DR15),
When the developer authors `.storybook/main.ts` and `.storybook/preview.ts`,
Then `preview.ts`:

1. Imports `../src/app/globals.css` so every story renders with the OKLCH tokens applied.
2. Declares a global decorator that wraps every story in `<ProvidersContext.Provider value={createMockProviders()}>` (using the barrel imports from `@/lib/providers`). Stories that need a different provider value can override per-story via `parameters.providers`.
3. Sets `parameters.a11y.test = "error"` (was `"todo"` in Story 1.1's scaffolding) so Storybook's a11y addon fails CI on any violation in any story (NFR23, AC of the AC).

And `main.ts` keeps the existing `@storybook/addon-a11y` registration (no change needed) and the existing stories glob `../src/**/*.stories.@(js|jsx|mjs|ts|tsx)` (no change). The `@storybook/addon-vitest` browser-mode runner picks up the `a11y.test = "error"` setting and fails `pnpm test:storybook` on any violation.

**AC5 — Vitest auto-runs axe-core on every `<Component />` rendered under `src/components/**/*.test.tsx`**

Given NFR23's "axe-core integrated into Vitest for component-level accessibility tests on every component story",
When the developer wires axe-core into `vitest.setup.ts`,
Then a `toHaveNoViolations` custom matcher is registered (using the already-installed `axe-core` package — no new dependency); `vitest.setup.ts` extends `expect` with the matcher and exports a `renderWithProviders(ui)` helper from `src/test-utils/render.tsx` that wraps the ui in `<ProvidersContext.Provider value={createMockProviders()}>` plus `<QueryClientProvider>` and runs `axe.run(container)` after render, asserting no violations.

> **Note on the AC's `@axe-core/react` reference:** The epics text says "@axe-core/react setup". `@axe-core/react` is a *runtime dev-time* package that logs violations to the console during development — it does not fail tests. The correct package for assertion-based accessibility tests is either `vitest-axe` (a fork of `jest-axe`, last published 4 years ago) or a small custom matcher built on the already-installed `axe-core` package. Per architecture §"Decision Priority Analysis" (defer dependency adds when stdlib suffices) and the user's bias-to-ship preference, **roll the matcher in-house** (~25 LOC in `vitest.setup.ts`) using `axe-core` directly. If a future story needs more matchers, swap to `vitest-axe` then.

And every primitive in AC3 has its `*.test.tsx` invoke the helper at least once (e.g. `const { container } = renderWithProviders(<Button>Save</Button>); await expect(container).toHaveNoViolations();`). The auto-axe check runs on every render via the helper; no manual axe call per primitive is required beyond the assertion.

**AC6 — Pre-existing Storybook example assets in `src/stories/` are deleted**

Given Story 1.2's note (Pre-existing Storybook example assets in `src/stories/` (`Button.tsx`, `Header.tsx`, `Page.tsx` and accompanying CSS/PNGs) are untouched; Story 1.3 will replace them with real component stories.),
When the developer ships this story,
Then `src/stories/` is removed entirely (component examples + CSS + PNG assets + `Configure.mdx`). The real source-of-truth primitives now live in `src/components/ui/*` per AR13 and architecture §"Project Structure". `pnpm storybook` continues to discover stories via the `src/**/*.stories.tsx` glob (`src/components/ui/*.stories.tsx` in this story; `src/components/{render,reviews,…}/*.stories.tsx` in later stories).

And the legacy import-onboarding `@storybook/addon-onboarding` registration in `main.ts` is removed (it depends on the example stories that no longer exist; keeping it triggers a harmless console warning we should not normalize).

**AC7 — Full CI gate chain remains green**

Given AGENTS.md §6 CI gates,
When the developer runs the full smoke chain locally,
Then `pnpm typecheck`, `pnpm lint`, `pnpm test:unit`, `pnpm test:storybook`, `pnpm build`, `pnpm size-limit`, `pnpm check:stories` all pass. Specifically:

- `pnpm typecheck`: zero errors.
- `pnpm lint`: zero violations. New primitive files under `src/components/ui/*` must comply with the existing rule set (`no-restricted-imports`, `no-restricted-syntax`, `no-explicit-any`, `no-non-null-assertion`).
- `pnpm test:unit`: every primitive `.test.tsx` passes including its `toHaveNoViolations` assertion. Coverage on `src/lib/**` remains ≥70% (NFR39 — primitives don't enter `src/lib/**` so the existing 100% coverage from Story 1.2 is unchanged or improved).
- `pnpm test:storybook`: the addon-vitest browser run executes every story under chromium with `a11y.test = "error"` and zero a11y violations are detected.
- `pnpm build`: production build compiles. Bundle size delta is reasonable given 20 new primitive files (most are Radix re-exports + thin Tailwind wrappers; expect +5-15 KB gzipped under the 300 KB / NFR8 budget).
- `pnpm check:stories`: every component file under `src/components/**` (including the 20 new primitives) has a sibling `.stories.tsx`.

## Tasks / Subtasks

- [x] **Task 1: Replace `src/app/globals.css` `@theme` block with brand OKLCH tokens** (AC1, AC2)
  - [x] Remove the entire shadcn-init `:root` and `.dark` blocks (legacy `--background`, `--foreground`, `--primary`, `--secondary`, etc. and their `--color-*` mappings).
  - [x] Replace with the brand tokens enumerated in AC1 (neutral / accent / semantic / attribution / type / weight / spacing / motion). Use the Tailwind v4 `@theme` syntax (`--color-bg-base: oklch(...)`, `--text-base: 16px;` `--text-base--line-height: 1.55;` per Tailwind v4 docs).
  - [x] Keep `@import "tailwindcss"`, `@import "tw-animate-css"`, `@import "shadcn/tailwind.css"` at the top.
  - [x] Keep the `@layer base` block but retarget body styles to `bg-(--color-bg-base) text-(--color-text-primary)` (Tailwind v4's CSS-variable arbitrary-value syntax) — drop the `border-border`/`outline-ring` defaults that referenced the deleted shadcn tokens.
  - [x] Add density variants per AC2: `[data-density="comfortable"] { --density-scale: 1; }` and `[data-density="compact"] { --density-scale: 0.75; }`. Document inline that primitive components consume this via `calc(var(--spacing-N) * var(--density-scale, 1))` when they need density-aware spacing.
  - [x] Keep `@custom-variant dark (&:is(.dark *))` at the top **only if needed** by `tw-animate-css`; otherwise remove it (no dark-mode tokens in V1). _(Removed; tw-animate-css does not require it.)_

- [x] **Task 2: Generate the 20 shadcn primitives** (AC3)
  - [x] Run, in order (one component per invocation to keep diffs reviewable):
    ```bash
    cd sb-tryon
    pnpm dlx shadcn@latest add button dialog alert-dialog popover select slider \
      tabs toggle-group tooltip form label input textarea checkbox radio-group \
      switch separator scroll-area avatar
    pnpm dlx shadcn@latest add toast  # may print deprecation; see Dev Notes "Toast" handling
    ```
  - [x] Verify each generated file lands in `src/components/ui/{name}.tsx` (matching the kebab-case filenames per architecture §6). _(toast and form were not in the radix-nova registry — authored manually using `radix-ui` Toast/Form primitives; toggle.tsx was generated as a dep of toggle-group and kept with its own colocated test+story, taking the primitive count to 21.)_
  - [x] For each generated file, **retarget any reference to the removed shadcn tokens** (`bg-background`, `text-foreground`, `bg-primary`, `text-primary-foreground`, `border-border`, `bg-destructive`, `ring-ring`, etc.) to the new brand tokens (`bg-(--color-bg-base)`, `text-(--color-text-primary)`, `bg-(--color-accent-primary)` for primary CTAs, `border-(--color-border-subtle)`, etc.). The mapping table is in Dev Notes "Token Migration Map".
  - [x] **Button.tsx specifics:** override the generated variant set to `"primary" | "secondary" | "tertiary" | "destructive"` (UX-DR9) — drop `default`, `outline`, `link`, `ghost` from the shadcn-default cva. Add TSDoc on the `children` prop documenting the verb-driven-copy rule (UX-DR16). Wire focus styles per AC3 (`outline: 2px solid var(--color-accent-primary); outline-offset: 2px;`). Loading state: spinner replaces text with width preserved (no layout shift) (UX-DR9). Use `aria-disabled` for the disabled state, never visual-only.

- [x] **Task 3: Author colocated tests + stories for every primitive** (AC3, AC5)
  - [x] For each of the 20 primitives, create `src/components/ui/{name}.test.tsx`:
    - Renders the component using `renderWithProviders(...)` from `@/test-utils/render` (Task 5 ships the helper).
    - At least one happy-path assertion (text content / role / aria attribute).
    - Calls `await expect(container).toHaveNoViolations()` — auto-axe passes.
    - For `button.tsx`: assert verb-driven copy contract behaviour — disabled has `aria-disabled`, loading state preserves width.
  - [x] For each of the 20 primitives, create `src/components/ui/{name}.stories.tsx`:
    - Default story rendering the primitive with realistic props (e.g. `<Button variant="primary">Save look</Button>` — verb-driven copy enforced in story copy too).
    - One story per visual variant the component exposes (e.g. `Button` → `Primary | Secondary | Tertiary | Destructive | DisabledPrimary | LoadingPrimary`).
    - Use Storybook CSF v3 (`Meta` + `StoryObj`) per existing scaffolding.
  - [x] Confirm `pnpm check:stories` exits 0 (every `*.tsx` under `src/components/ui/` has a sibling `*.stories.tsx`).

- [x] **Task 4: Update Storybook configuration** (AC4, AC6)
  - [x] `.storybook/preview.ts` — import `../src/app/globals.css`. Add a global `decorators` array exporting one decorator that wraps `<Story />` in `<ProvidersContext.Provider value={createMockProviders()}>`. Set `parameters.a11y.test = "error"`. _(Renamed to `preview.tsx` so the JSX decorator type-checks.)_
  - [x] `.storybook/main.ts` — remove `@storybook/addon-onboarding` from the `addons` array (its example deps go away in Task 6). Leave everything else. _(Also dropped the unused `src/**/*.mdx` glob so Storybook stops emitting an "no story files found" warning.)_

- [x] **Task 5: Wire axe-core into Vitest** (AC5)
  - [x] Edit `vitest.setup.ts`:
    1. Keep the existing `import "@testing-library/jest-dom/vitest"`.
    2. Implement and register a `toHaveNoViolations` matcher using `axe-core` directly (no new dep). The matcher invokes `axe.run(container)` and asserts `result.violations.length === 0`, surfacing a readable diagnostic on failure (rule id + impact + nodes).
    3. Globally inject `prefers-reduced-motion` neutral via JSDOM `matchMedia` polyfill (axe doesn't need it but consumers might). _(Also added a no-op `ResizeObserver` polyfill — Radix Slider et al. probe it on mount.)_
  - [x] Create `src/test-utils/render.tsx` (a sibling outside `src/components/` so the `check:stories` rule does not apply):
    - Exports `renderWithProviders(ui, options?)` returning the React Testing Library `RenderResult` shape, wrapping `ui` in `<ProvidersContext.Provider value={createMockProviders()}>` and `<QueryClientProvider client={...}>` (use a per-test `QueryClient` with `retry: false` to keep tests deterministic).
    - Optionally accepts a `density: "comfortable" | "compact"` option that sets `data-density` on the wrapper (default `"comfortable"`).
  - [x] Confirm `vitest.shims.d.ts` augments `Vi.AssymetricMatchersContaining` and `Vi.Assertion` with `toHaveNoViolations(): Promise<void>` so TypeScript recognizes the matcher (or augment the existing module declaration if present).

- [x] **Task 6: Delete legacy Storybook onboarding examples** (AC6)
  - [x] Delete entire `src/stories/` directory: `Button.tsx`, `Button.stories.ts`, `Header.tsx`, `Header.stories.ts`, `Page.tsx`, `Page.stories.ts`, `button.css`, `header.css`, `page.css`, `Configure.mdx`, `assets/` (all PNG/SVG files).
  - [x] Confirm `pnpm storybook` (and `pnpm test:storybook`) discover the new `src/components/ui/*.stories.tsx` files only.

- [x] **Task 7: Smoke-test the full CI gate chain**
  - [x] `pnpm typecheck` — exit 0, zero errors.
  - [x] `pnpm lint` — exit 0, zero violations. (If a generated shadcn primitive uses `any` or non-null-assertion, fix at the source rather than disabling the rule.)
  - [x] `pnpm test:unit` — all 20 primitive tests pass; existing Story 1.2 tests still green; coverage on `src/lib/**` ≥70%. _(96 unit tests across 26 files; coverage on `src/lib/**` 100% lines/branches/functions — same as Story 1.2.)_
  - [x] `pnpm test:storybook` — addon-vitest browser run finishes with zero a11y violations across all stories. _(53 stories across 22 files, all green with `a11y.test = "error"`.)_
  - [x] `pnpm build` — production build compiles successfully.
  - [x] `pnpm size-limit` — bundle under 300 KB gzipped (NFR8). Record the delta vs Story 1.2's 204.07 KB; expect +5-15 KB. _(204.15 KB, +0.08 KB — the primitives aren't yet imported by any route, so they don't tree-shake into the initial bundle until Story 1.4+ composes them.)_
  - [x] `pnpm check:stories` — exit 0. _(22 component files checked, every one has a sibling `.stories.tsx`.)_
  - [ ] `pnpm storybook` (manual sanity) — Storybook boots at `:6006` and the primitives render with the new OKLCH tokens applied. _(Manual UI verification deferred to reviewer; `pnpm test:storybook` exercises the same compiled CSS in a headless Chromium and runs axe to error mode.)_

## Dev Notes

### What Stories 1.1 and 1.2 Delivered (Do Not Reinvent)

- **Story 1.1** scaffolded `sb-tryon/` with Next.js 16.2.4, React 19.2.4, TypeScript 5.9.3 (strict), Tailwind v4, shadcn 4.6 (`components.json` style `"radix-nova"`, `baseColor: "neutral"`, `cssVariables: true`), pnpm 10.33.2, Vitest 4.1.5 (with `unit` + `storybook` projects already split — see `vitest.config.ts`), Playwright 1.59, axe-core 4.11.4, Storybook 10.3.6 with `@storybook/addon-a11y` and `@storybook/addon-vitest` registered, and the `pnpm check:stories` script. CI gates were green. **`src/components/ui/` is empty** — Story 1.1 did not generate primitives.
- **Story 1.2** added all 10 provider contracts, the env-var-driven factory, `ProvidersContext` + 10-overload `useProvider` hook, 10 stub mock providers (50-200ms latency, throw `ProviderError("NOT_IMPLEMENTED", ...)`), the public barrel at `src/lib/providers/index.ts`, and `RootProviders` (`"use client"`) wrapping `QueryClientProvider` + `ProvidersContext.Provider` inside `src/components/root-providers.tsx`. ESLint enforcement (Parts A, B, the `<input type="file">` block, and TS strict rules) is live. **Story 1.3 imports `createMockProviders` and `ProvidersContext` from `@/lib/providers`.**
- The `globals.css` `@theme` block currently contains the **shadcn-init defaults** (`--background`, `--foreground`, `--primary`, etc.). These are placeholder; **Story 1.3 replaces them entirely** with the brand OKLCH tokens.
- The `tailwind.config.ts` is essentially empty (`content` glob only). In Tailwind v4, configuration lives in CSS via `@theme`. **No edits to `tailwind.config.ts` are needed** in this story.

### Tailwind v4 Token Strategy

Tailwind v4 reads design tokens from CSS `@theme` blocks rather than `tailwind.config.ts`. The naming convention `--color-bg-base` makes `bg-bg-base` (or `bg-(--color-bg-base)` arbitrary value) work in JSX. Concrete examples:

```css
/* src/app/globals.css */
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@theme {
  /* Neutral foundation */
  --color-bg-base: oklch(0.99 0.005 90);
  --color-bg-elevated: oklch(0.97 0.005 90);
  --color-bg-sunken: oklch(0.95 0.005 90);
  --color-border-subtle: oklch(0.91 0.005 90);
  --color-border-strong: oklch(0.82 0.008 90);
  --color-text-primary: oklch(0.18 0.02 90);
  --color-text-secondary: oklch(0.42 0.015 90);
  --color-text-tertiary: oklch(0.58 0.01 90);

  /* Accent (single restrained) */
  --color-accent-primary: oklch(0.55 0.12 45);
  --color-accent-primary-hover: oklch(0.50 0.13 45);
  --color-accent-subtle: oklch(0.92 0.04 45);

  /* Semantic */
  --color-success: oklch(0.45 0.10 145);
  --color-warning: oklch(0.68 0.13 70);
  --color-error: oklch(0.50 0.16 25);

  /* Source-attribution chips (each AA-compliant on bg-base) */
  --color-attribution-google: oklch(0.55 0.04 240);            /* muted blue-gray */
  --color-attribution-brand-published: oklch(0.55 0.04 300);   /* muted purple-gray */
  --color-attribution-sb-user: oklch(0.55 0.04 180);           /* muted teal-gray */
  --color-attribution-stylist-assisted: oklch(0.55 0.04 70);   /* muted ochre-gray */

  /* Type scale (5 sizes; calibrated for restraint) */
  --text-xs: 13px;             --text-xs--line-height: 1.4;
  --text-base: 16px;           --text-base--line-height: 1.55;
  --text-lg: 19px;             --text-lg--line-height: 1.45;
  --text-xl: 26px;             --text-xl--line-height: 1.25;
  --text-display: 38px;        --text-display--line-height: 1.15;

  /* Weight scale (3 active; no bold) */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing scale (4px base, geometric) */
  --spacing-1: 4px;   --spacing-2: 8px;   --spacing-3: 12px;
  --spacing-4: 16px;  --spacing-6: 24px;  --spacing-8: 32px;
  --spacing-10: 40px; --spacing-12: 48px; --spacing-16: 64px;
  --spacing-24: 96px; --spacing-32: 128px;

  /* Motion (eased curves only — no spring) */
  --motion-duration-fast: 150ms;
  --motion-duration-base: 200ms;
  --motion-duration-slow: 300ms;
  --motion-ease: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Density variants (UX-DR3 — descendants read from CSS variable) */
[data-density="comfortable"] { --density-scale: 1; }
[data-density="compact"]     { --density-scale: 0.75; }

@layer base {
  body {
    background-color: var(--color-bg-base);
    color: var(--color-text-primary);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  }
  html { font-feature-settings: "ss01"; /* tabular-nums applied per-element */ }
}
```

> **Attribution chip OKLCH values:** the UX spec describes the *intent* ("muted blue-gray" / "muted purple-gray" / etc.) without committing to numeric values. The OKLCH values above are reasonable picks that pass the AA contrast ratio against `bg-base` and stay perceptually distinct. If brand work later calibrates these, swap the values in this single block — no component touches change.

### Token Migration Map (for retargeting generated shadcn primitives)

shadcn primitives generated by `shadcn add <component>` reference its baseline tokens. Map them through to the brand tokens like this:

| shadcn-init reference | Brand replacement |
|---|---|
| `bg-background`, `bg-card`, `bg-popover` | `bg-bg-base` (or `bg-bg-elevated` for cards/panels) |
| `text-foreground`, `text-card-foreground` | `text-text-primary` |
| `text-muted-foreground` | `text-text-secondary` (or `text-text-tertiary` for placeholders) |
| `bg-primary`, `text-primary-foreground` | `bg-accent-primary text-bg-base` (CTA buttons) |
| `bg-secondary`, `text-secondary-foreground` | `bg-bg-elevated text-text-primary border-border-subtle` (Secondary tier per UX-DR9) |
| `bg-destructive`, `text-destructive-foreground` | `bg-error text-bg-base` (only for destructive AlertDialog confirms — never visual primary fill) |
| `bg-accent`, `text-accent-foreground` | `bg-accent-subtle text-accent-primary` (selected state surfaces) |
| `border-border`, `border-input` | `border-border-subtle` (default) or `border-border-strong` (form inputs, focus-adjacent) |
| `ring-ring` | `outline-2 outline-accent-primary outline-offset-2` (focus styles per UX spec) |
| `bg-muted` | `bg-bg-sunken` |
| `text-destructive` | `text-error` |

Any reference to `--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--accent`, `--card`, `--popover`, `--destructive`, `--ring`, `--input`, `--border`, `--chart-*`, `--sidebar*` in the generated shadcn output should be retargeted via this table. **The legacy tokens are deleted in AC1**, so any leftover reference will compile-fail or silently render unstyled — `pnpm dev` should catch the visual breakage immediately.

### Button.tsx — Variant Set + Verb-Driven Copy (UX-DR9, UX-DR16)

shadcn's default Button generates `variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"`. **Replace** the cva config with the UX-spec variant set:

```typescript
// src/components/ui/button.tsx (excerpt)
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors duration-(--motion-duration-fast) ease-(--motion-ease) focus-visible:outline-2 focus-visible:outline-accent-primary focus-visible:outline-offset-2 aria-disabled:pointer-events-none aria-disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:     "bg-accent-primary text-bg-base hover:bg-accent-primary-hover",
        secondary:   "bg-bg-elevated text-text-primary border border-border-subtle hover:bg-bg-sunken",
        tertiary:    "text-accent-primary underline-offset-4 hover:underline",
        destructive: "bg-error text-bg-base hover:opacity-90",
      },
      size: { default: "h-11 px-4 text-base", sm: "h-9 px-3 text-base", lg: "h-12 px-6 text-lg" },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  /**
   * Verb-driven copy required (UX-DR16). Use action-specific verbs that name what
   * the button DOES, e.g. "Save look", "Upload photo", "Find a salon", "Try another color".
   * Forbidden: "Submit", "Continue", "OK", "Click here", "Next" (use action-specific copy).
   */
  children: React.ReactNode;
  asChild?: boolean;
  /** When true, replaces label with a spinner; preserves button width to prevent layout shift (UX-DR9). */
  loading?: boolean;
}
```

> The `children` TSDoc block is the documentation surface for the verb-driven copy rule. We don't enforce it at the type level (would need a string-literal union exposing every approved verb, which is impractical). Reviewers and the dev agent are expected to read the TSDoc and apply judgment.

### Storybook `preview.ts` — Decorator Wiring

```typescript
// .storybook/preview.ts
import type { Preview } from "@storybook/nextjs-vite";
import { ProvidersContext, createMockProviders } from "@/lib/providers";
import "../src/app/globals.css";

const mockProviders = createMockProviders();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    a11y: {
      // 'error' = fail CI on any a11y violation (NFR23)
      test: "error",
    },
  },
  decorators: [
    (Story) => (
      <ProvidersContext.Provider value={mockProviders}>
        <Story />
      </ProvidersContext.Provider>
    ),
  ],
};

export default preview;
```

> **Why a single `mockProviders` constant at module scope:** addon-vitest reuses the preview across stories; constructing once is fine because mock providers are stateless stubs (Story 1.2). If a future story needs per-story provider overrides, switch to a `useMemo` inside the decorator and read `parameters.providers` from `context`.

### `vitest.setup.ts` — In-House `toHaveNoViolations` Matcher

```typescript
// vitest.setup.ts
import "@testing-library/jest-dom/vitest";
import { expect } from "vitest";
import axe from "axe-core";

expect.extend({
  async toHaveNoViolations(received: Element) {
    const result = await axe.run(received);
    if (result.violations.length === 0) {
      return { pass: true, message: () => "no axe violations" };
    }
    const summary = result.violations
      .map((v) => `  • [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node${v.nodes.length === 1 ? "" : "s"})`)
      .join("\n");
    return {
      pass: false,
      message: () =>
        `expected no axe violations but found ${result.violations.length}:\n${summary}\n\nSee https://dequeuniversity.com/rules for fix guidance.`,
    };
  },
});

// JSDOM doesn't implement matchMedia; axe and Radix both probe it.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (q: string) => ({
    matches: false, media: q, onchange: null,
    addListener: () => {}, removeListener: () => {},
    addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => false,
  });
}
```

```typescript
// src/test-utils/render.tsx
import * as React from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProvidersContext, createMockProviders } from "@/lib/providers";

interface ProvidersOptions extends RenderOptions {
  density?: "comfortable" | "compact";
}

export function renderWithProviders(ui: React.ReactElement, options: ProvidersOptions = {}) {
  const { density = "comfortable", ...renderOptions } = options;
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const providers = createMockProviders();
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ProvidersContext.Provider value={providers}>
          <div data-density={density}>{children}</div>
        </ProvidersContext.Provider>
      </QueryClientProvider>
    );
  }
  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
```

> **TS shim for the matcher:** add a one-liner module augmentation in `vitest.shims.d.ts` so `expect(container).toHaveNoViolations()` typechecks:
> ```typescript
> // vitest.shims.d.ts
> /// <reference types="vitest/globals" />
> import "vitest";
> declare module "vitest" {
>   interface Assertion<T = unknown> { toHaveNoViolations(): Promise<void>; }
>   interface AsymmetricMatchersContaining { toHaveNoViolations(): Promise<void>; }
> }
> ```

### Test Pattern (every primitive `*.test.tsx`)

```typescript
// src/components/ui/button.test.tsx
import { describe, it, expect } from "vitest";
import { renderWithProviders } from "@/test-utils/render";
import { Button } from "./button";

describe("Button", () => {
  it("renders with verb-driven copy and passes axe", async () => {
    const { container, getByRole } = renderWithProviders(<Button>Save look</Button>);
    expect(getByRole("button", { name: "Save look" })).toBeInTheDocument();
    await expect(container).toHaveNoViolations();
  });

  it("uses aria-disabled for the disabled state", async () => {
    const { container, getByRole } = renderWithProviders(<Button aria-disabled>Save look</Button>);
    expect(getByRole("button")).toHaveAttribute("aria-disabled", "true");
    await expect(container).toHaveNoViolations();
  });
});
```

### Toast Handling (potential shadcn deprecation)

Recent shadcn versions soft-deprecated `toast` in favor of Sonner. Versions in this repo (`shadcn ^4.6.0`, `radix-ui ^1.4.3`) still ship the Radix-Toast wrapper and `pnpm dlx shadcn@latest add toast` will install it. **If shadcn warns or refuses,** install the Radix Toast primitive manually using the same pattern as the other primitives — copy the upstream Radix-wrapped Toast component into `src/components/ui/toast.tsx` and retarget styles per the Token Migration Map. The architecture (and AC3) require `Toast` as a primitive; do not silently substitute `Sonner` here. `<ToastWithProvenance>` in Story 1.4 extends this primitive with a `provenance` prop.

### File Structure After This Story

```
sb-tryon/
├── .storybook/
│   ├── main.ts                                 ← UPDATED: drop addon-onboarding
│   └── preview.ts                              ← UPDATED: globals import + ProvidersContext decorator + a11y "error"
├── src/
│   ├── app/
│   │   └── globals.css                         ← UPDATED: brand OKLCH @theme replaces shadcn defaults
│   ├── components/
│   │   ├── root-providers.tsx                  (Story 1.2; unchanged)
│   │   ├── root-providers.test.tsx             (Story 1.2; unchanged)
│   │   ├── root-providers.stories.tsx          (Story 1.2; unchanged)
│   │   └── ui/                                 ← NEW DIRECTORY (20 primitives + tests + stories)
│   │       ├── alert-dialog.{tsx,test.tsx,stories.tsx}
│   │       ├── avatar.{tsx,test.tsx,stories.tsx}
│   │       ├── button.{tsx,test.tsx,stories.tsx}
│   │       ├── checkbox.{tsx,test.tsx,stories.tsx}
│   │       ├── dialog.{tsx,test.tsx,stories.tsx}
│   │       ├── form.{tsx,test.tsx,stories.tsx}
│   │       ├── input.{tsx,test.tsx,stories.tsx}
│   │       ├── label.{tsx,test.tsx,stories.tsx}
│   │       ├── popover.{tsx,test.tsx,stories.tsx}
│   │       ├── radio-group.{tsx,test.tsx,stories.tsx}
│   │       ├── scroll-area.{tsx,test.tsx,stories.tsx}
│   │       ├── select.{tsx,test.tsx,stories.tsx}
│   │       ├── separator.{tsx,test.tsx,stories.tsx}
│   │       ├── slider.{tsx,test.tsx,stories.tsx}
│   │       ├── switch.{tsx,test.tsx,stories.tsx}
│   │       ├── tabs.{tsx,test.tsx,stories.tsx}
│   │       ├── textarea.{tsx,test.tsx,stories.tsx}
│   │       ├── toast.{tsx,test.tsx,stories.tsx}
│   │       ├── toggle-group.{tsx,test.tsx,stories.tsx}
│   │       └── tooltip.{tsx,test.tsx,stories.tsx}
│   ├── stories/                                ← DELETED entirely (legacy onboarding examples)
│   └── test-utils/                             ← NEW DIRECTORY
│       └── render.tsx                          ← NEW: renderWithProviders helper
├── vitest.setup.ts                             ← UPDATED: toHaveNoViolations matcher + matchMedia shim
└── vitest.shims.d.ts                           ← UPDATED: matcher type augmentation
```

### Downstream Story Handoff Contracts

The exports below are the public surface this story ships. Later stories rely on these — breaking the contract = breaking the downstream story.

| Downstream Story | Required Export | From |
|---|---|---|
| 1.4 (Layout shells) | All 20 primitives | `@/components/ui/*` |
| 1.4 (`DensityContainer`) | `[data-density="..."] { --density-scale }` cascade in `globals.css` | `src/app/globals.css` |
| 1.4 (`HonestEmptyState`) | Brand tokens (especially `--color-text-secondary` for subdued copy) | `src/app/globals.css` |
| 1.4+ (every component test) | `renderWithProviders`, `toHaveNoViolations` matcher | `@/test-utils/render`, global Vitest matcher |
| 1.6 (`PhotoUploader`, `ConsentPrompt`) | `Dialog`, `AlertDialog`, `Button` | `@/components/ui/*` |
| 1.7 (`ColorRender`) | Brand accent + neutral tokens | `src/app/globals.css` |
| 1.8 (`FadeSimulator`) | `Slider`, `Select` | `@/components/ui/*` |
| 1.9 (`LightingToggle`) | `ToggleGroup` | `@/components/ui/toggle-group` |
| 1.11 (`ShareLook`) | `Switch`, `Toast` (extended in 1.4 as `ToastWithProvenance`) | `@/components/ui/*` |
| Every component story henceforth | The Storybook decorator wraps in `<ProvidersContext>` automatically — stories can call `useProvider("...")` without per-story setup | `.storybook/preview.ts` |

### Key Constraints from Architecture & UX Spec

- **No dark-mode tokens in V1** (UX spec §"Color System"). Even if the shadcn primitives generate `.dark` selectors, drop them. V1.5 may add dark mode; preserving the OKLCH lightness values now (so a dark-mode swap is straightforward) is enough.
- **No spring physics in motion tokens** (UX-DR1). Eased curves only. The single curve token `--motion-ease: cubic-bezier(0.4, 0, 0.2, 1)` is the only blessed easing.
- **Touch targets:** `Button` defaults to `h-11` (44px) on consumer surfaces; `sm` is `h-9` (36px) acceptable in dense pro tables (Marcus dashboard, Elena audit queue) — the consumer/operator route groups will pick the appropriate size via composition, not via primitive default override.
- **Focus indicators:** every primitive must render a 2px solid `accent-primary` outline at 2px offset on `:focus-visible`. Never `outline: none`. Radix primitives carry this correctly out of the box; the buttoning-overrides above re-affirm.
- **`aria-disabled` not `disabled`:** for the disabled state on interactive elements (UX-DR9), the primitive surfaces `aria-disabled` semantics — never visual-only opacity. The cva token chain above achieves this via `aria-disabled:pointer-events-none aria-disabled:opacity-50`.
- **Verb-driven copy rule (UX-DR16):** the only enforcement layer is `Button.tsx`'s TSDoc on `children`. Reviewers and the dev agent must catch "Submit" / "Continue" / "OK" copy in PR review. The story-1.3 button stories themselves should not contain forbidden copy.
- **Storybook a11y mode `"error"`:** flips the gate from soft-warn to hard-fail. Every story added in this and every later story must pass clean.
- **No `__tests__/` directories** (AGENTS.md §3). Tests are siblings.
- **No barrel files in feature directories** (AGENTS.md §3). Don't create `src/components/ui/index.ts`. Imports are direct: `import { Button } from "@/components/ui/button"`.

### Anti-Patterns (Block Merge)

```typescript
// ❌ Referencing a deleted shadcn-init token
<div className="bg-background text-foreground">  // wrong — those tokens no longer exist
<div className="bg-bg-base text-text-primary">    // correct

// ❌ Reintroducing dark-mode tokens
:root.dark { --color-bg-base: oklch(0.18 ...); }  // V1 is light-only; do not add

// ❌ Visual-only disabled state
<button disabled className="opacity-50">…</button>      // wrong — no aria semantics
<button aria-disabled className="aria-disabled:opacity-50">…</button>  // correct

// ❌ outline: none anywhere
.btn:focus { outline: none; }                            // forbidden — never override Radix focus

// ❌ Spring physics motion
transition: all 200ms cubic-bezier(0.5, 1.5, 0.5, 1);    // bouncy curve forbidden
transition: colors var(--motion-duration-fast) var(--motion-ease);  // correct

// ❌ density prop on a primitive
<Button density="compact">…</Button>                     // wrong — descendants read from layout cascade
<DensityContainer density="compact"><Button>…</Button></DensityContainer>  // correct (in Story 1.4)

// ❌ Submitting a primitive without a story
src/components/ui/foo.tsx exists, src/components/ui/foo.stories.tsx does not  // pnpm check:stories blocks this
```

### Open Questions / Flag for Review

- **`@axe-core/react` vs in-house axe matcher (AC5).** AC text references `@axe-core/react`. That package is a dev-time runtime advisor — it logs violations to the console as React renders, but does not fail tests. The architecturally correct integration for assertion-based tests is either `vitest-axe` (a stale fork of `jest-axe`, last published 2021) or a small in-house matcher built on `axe-core`. **Recommendation:** roll the matcher in-house (~25 LOC, uses the `axe-core` package already in `devDependencies`, no new dep, no abandoned-package risk). The functional intent of the AC — every `<Component />` rendered in a `.test.tsx` is auto-checked for a11y violations and tests fail on violation — is preserved. **Approved by user policy:** prefer demo-first / minimal-cost / simplest-shippable approach (memory: bias-to-ship + minimal-cost). If the dev agent disagrees, swap to `vitest-axe` and proceed; do not add `@axe-core/react`.
- **Attribution chip OKLCH values.** UX spec describes intent ("muted blue-gray", etc.) without numeric values. Picked plausible OKLCH triples in Dev Notes; brand work later may recalibrate. Captured as a single CSS edit in `globals.css`.

### Architecture & UX Source References

- Story ACs (canonical): [epics.md — Story 1.3](../planning-artifacts/epics.md) §"Epic 1 → Story 1.3".
- OKLCH design token tables: [ux-design-specification.md — Visual Design Foundation](../planning-artifacts/ux-design-specification.md) §"Color System" + §"Typography System" + §"Spacing & Layout Foundation".
- Foundation primitive list (UX-DR2): [ux-design-specification.md — UX Design Requirements](../planning-artifacts/epics.md) §"UX-DR2".
- Density variant rule (UX-DR3): [ux-design-specification.md](../planning-artifacts/ux-design-specification.md) §"UX-DR3" + AGENTS.md §1 cross-cutting concern #10.
- 3-tier button hierarchy (UX-DR9): [ux-design-specification.md](../planning-artifacts/ux-design-specification.md) §"UX-DR9".
- Storybook + axe expectations (UX-DR15, NFR22, NFR23): [ux-design-specification.md](../planning-artifacts/ux-design-specification.md) §"UX-DR15" + epics.md §"NFR23".
- Tone enforcement at the component-API level (UX-DR16): [ux-design-specification.md](../planning-artifacts/ux-design-specification.md) §"UX-DR16".
- Project structure (where primitives live): [architecture.md — Project Structure](../planning-artifacts/architecture.md) §6.
- Test colocation (AR13): [architecture.md — Structure Patterns](../planning-artifacts/architecture.md) §5.
- ESLint enforcement (AR4 + Story 1.2 rules): [architecture.md — Enforcement Guidelines](../planning-artifacts/architecture.md) §5; [eslint.config.mjs](../../sb-tryon/eslint.config.mjs).
- Tailwind v4 token authoring: [architecture.md](../planning-artifacts/architecture.md) §"Selected Starter".
- Story 1.2 export surface (createMockProviders, ProvidersContext): [1-2-…md — Public Barrel](./1-2-define-9-provider-contracts-factory-providerscontext-eslint-enforcement.md) §"Task 6".

### Project Structure Notes

- All work happens inside `sb-tryon/`. The `_bmad-output/` directory is documentation-only.
- This story does NOT touch `src/lib/**` — Story 1.2's 100% coverage on that subtree should remain intact and the coverage gate (≥70%) should remain green or improve.
- This story does NOT touch `src/app/layout.tsx` — Story 1.2's `RootProviders` wiring is correct; primitives mount under it and read providers via the existing context.
- The new `src/test-utils/` directory sits outside `src/components/` so the `pnpm check:stories` rule does not apply (only `src/components/**/*.tsx` is checked).

## Dev Agent Record

### Agent Model Used

claude-opus-4-7 (1M context)

### Debug Log References

- **Storybook a11y `error` mode caught two contrast issues that jsdom-based unit tests miss:**
  - `--color-accent-primary` (#aa5830) text on `--color-accent-subtle` (#fdddcf) is 3.95:1 — fails AA's 4.5:1 for body text. Fixed by retargeting the pressed/highlighted text in `toggle.tsx`, `select.tsx`, and the Toast action button to `--color-text-primary`. The bg colour stays as `--color-accent-subtle` so the pressed state remains visually distinct.
  - `--color-text-tertiary` (#7c7a74) on `--color-bg-base` (#fdfcf8) is 4.18:1 — also fails 4.5:1. Used `--color-text-tertiary` for placeholder text in input/select/textarea per the UX spec but this trips axe at 16px regular weight. Fixed by retargeting the placeholder colour in `input.tsx`, `select.tsx`, and `textarea.tsx` to `--color-text-secondary` (still subdued vs. text-primary, but contrast-compliant). `--color-text-tertiary` itself is preserved in the token palette for other uses.
- **JSDOM polyfills:** Radix Slider probes `ResizeObserver` in `useEffect`, which jsdom doesn't ship; added a no-op polyfill in `vitest.setup.ts` next to the existing matchMedia shim.
- **Slider thumb naming:** axe's `aria-input-field-name` rule treats every Radix slider Thumb (role="slider") as needing an accessible name. Updated `slider.tsx` to forward `aria-label` / `aria-labelledby` from the Slider Root to each Thumb, plus a new `thumbLabels` prop for ranges that need per-thumb labels.
- **Button + asChild:** the loading-state spinner originally rendered as a sibling of the children span, which broke `<Slot.Root>` (e.g. `<AlertDialogAction asChild>`) because Slot calls `React.Children.only`. Refactored `button.tsx` so the loading wrapper or the raw children always emit a single root child.
- **ScrollArea keyboard access:** axe's `scrollable-region-focusable` rule requires the scroll viewport to be keyboard-reachable. Added `tabIndex={0}` on `ScrollAreaPrimitive.Viewport` so arrow-key scrolling works for keyboard users.
- **Popover dialog name:** Radix popover content carries `role="dialog"` and needs `aria-label`/`aria-labelledby` to satisfy axe. The primitive does not bake in a default — stories supply an explicit `aria-label`.

### Completion Notes List

- **All 20 AC3 primitives shipped + a 21st (`toggle.tsx`, generated by shadcn as a transitive dep of `toggle-group`):** each lives at `src/components/ui/{name}.tsx` with a colocated `*.test.tsx` and `*.stories.tsx`. Token references retargeted to the brand OKLCH variables; legacy shadcn-init tokens (`--background`, `--foreground`, `--primary`, etc.) are gone.
- **`Button.tsx`** ships the UX-DR9 4-tier variant set (`primary | secondary | tertiary | destructive`), TSDoc on `children` enforcing the verb-driven copy rule (UX-DR16), aria-disabled-driven disabled state, and a width-preserving loading state with screen-reader-friendly `aria-live="polite"` announcement.
- **`toast.tsx` and `form.tsx`** were not in the radix-nova shadcn registry, so were authored directly using `radix-ui` (`Toast` / `Form` re-exports) with the brand tokens. The `Form` wrapper is a thin set of semantic helpers built on `@radix-ui/react-form` — no `react-hook-form` dependency added (consistent with bias-to-ship). Later stories can layer RHF on top if needed.
- **Storybook decorator** wraps every story in `<ProvidersContext.Provider value={createMockProviders()}>`, imports the brand `globals.css`, and sets `parameters.a11y.test = "error"`. The addon-vitest browser run executes 53 stories under headless Chromium with axe on every story; the run finishes green.
- **`renderWithProviders`** lives at `src/test-utils/render.tsx` (outside `src/components/` so the `pnpm check:stories` glob doesn't apply). It wraps test UI in a per-test `QueryClient` with `retry: false`, the providers context, and a `data-density` attribute defaulting to `"comfortable"`.
- **`toHaveNoViolations` matcher** is built in-house in `vitest.setup.ts` on the already-installed `axe-core` package — ~25 LOC, no `vitest-axe`/`@axe-core/react` add. Type augmentation in `vitest.shims.d.ts` makes the matcher type-aware for both `expect(...)` and `expect.toHaveNoViolations(...)` patterns.
- **Legacy `src/stories/` directory** removed entirely — `Button.tsx`, `Header.tsx`, `Page.tsx`, their `.stories.ts`/`.css`/`Configure.mdx`/`assets/` artifacts. The `@storybook/addon-onboarding` registration was dropped from `.storybook/main.ts` because its example deps no longer exist; the unused `src/**/*.mdx` glob was also dropped to silence the discovery warning.
- **Bundle size:** 204.15 KB gzipped — +0.08 KB vs Story 1.2's 204.07 KB. The primitives aren't yet imported by any route in the App Router tree, so they don't ship until later stories (1.4+) compose them. NFR8's 300 KB budget has 95 KB of headroom.
- **CI gates green end-to-end:** `pnpm typecheck`, `pnpm lint`, `pnpm test:unit` (96 tests, 100% coverage on `src/lib/**`), `pnpm test:storybook` (53 stories, 0 a11y violations), `pnpm build`, `pnpm size-limit`, `pnpm check:stories` (22 components covered).

### File List

**New files:**
- `sb-tryon/src/components/ui/alert-dialog.tsx`
- `sb-tryon/src/components/ui/alert-dialog.test.tsx`
- `sb-tryon/src/components/ui/alert-dialog.stories.tsx`
- `sb-tryon/src/components/ui/avatar.tsx`
- `sb-tryon/src/components/ui/avatar.test.tsx`
- `sb-tryon/src/components/ui/avatar.stories.tsx`
- `sb-tryon/src/components/ui/button.tsx`
- `sb-tryon/src/components/ui/button.test.tsx`
- `sb-tryon/src/components/ui/button.stories.tsx`
- `sb-tryon/src/components/ui/checkbox.tsx`
- `sb-tryon/src/components/ui/checkbox.test.tsx`
- `sb-tryon/src/components/ui/checkbox.stories.tsx`
- `sb-tryon/src/components/ui/dialog.tsx`
- `sb-tryon/src/components/ui/dialog.test.tsx`
- `sb-tryon/src/components/ui/dialog.stories.tsx`
- `sb-tryon/src/components/ui/form.tsx`
- `sb-tryon/src/components/ui/form.test.tsx`
- `sb-tryon/src/components/ui/form.stories.tsx`
- `sb-tryon/src/components/ui/input.tsx`
- `sb-tryon/src/components/ui/input.test.tsx`
- `sb-tryon/src/components/ui/input.stories.tsx`
- `sb-tryon/src/components/ui/label.tsx`
- `sb-tryon/src/components/ui/label.test.tsx`
- `sb-tryon/src/components/ui/label.stories.tsx`
- `sb-tryon/src/components/ui/popover.tsx`
- `sb-tryon/src/components/ui/popover.test.tsx`
- `sb-tryon/src/components/ui/popover.stories.tsx`
- `sb-tryon/src/components/ui/radio-group.tsx`
- `sb-tryon/src/components/ui/radio-group.test.tsx`
- `sb-tryon/src/components/ui/radio-group.stories.tsx`
- `sb-tryon/src/components/ui/scroll-area.tsx`
- `sb-tryon/src/components/ui/scroll-area.test.tsx`
- `sb-tryon/src/components/ui/scroll-area.stories.tsx`
- `sb-tryon/src/components/ui/select.tsx`
- `sb-tryon/src/components/ui/select.test.tsx`
- `sb-tryon/src/components/ui/select.stories.tsx`
- `sb-tryon/src/components/ui/separator.tsx`
- `sb-tryon/src/components/ui/separator.test.tsx`
- `sb-tryon/src/components/ui/separator.stories.tsx`
- `sb-tryon/src/components/ui/slider.tsx`
- `sb-tryon/src/components/ui/slider.test.tsx`
- `sb-tryon/src/components/ui/slider.stories.tsx`
- `sb-tryon/src/components/ui/switch.tsx`
- `sb-tryon/src/components/ui/switch.test.tsx`
- `sb-tryon/src/components/ui/switch.stories.tsx`
- `sb-tryon/src/components/ui/tabs.tsx`
- `sb-tryon/src/components/ui/tabs.test.tsx`
- `sb-tryon/src/components/ui/tabs.stories.tsx`
- `sb-tryon/src/components/ui/textarea.tsx`
- `sb-tryon/src/components/ui/textarea.test.tsx`
- `sb-tryon/src/components/ui/textarea.stories.tsx`
- `sb-tryon/src/components/ui/toast.tsx`
- `sb-tryon/src/components/ui/toast.test.tsx`
- `sb-tryon/src/components/ui/toast.stories.tsx`
- `sb-tryon/src/components/ui/toggle.tsx`
- `sb-tryon/src/components/ui/toggle.test.tsx`
- `sb-tryon/src/components/ui/toggle.stories.tsx`
- `sb-tryon/src/components/ui/toggle-group.tsx`
- `sb-tryon/src/components/ui/toggle-group.test.tsx`
- `sb-tryon/src/components/ui/toggle-group.stories.tsx`
- `sb-tryon/src/components/ui/tooltip.tsx`
- `sb-tryon/src/components/ui/tooltip.test.tsx`
- `sb-tryon/src/components/ui/tooltip.stories.tsx`
- `sb-tryon/src/test-utils/render.tsx`
- `sb-tryon/.storybook/preview.tsx` _(replaces preview.ts)_

**Modified files:**
- `sb-tryon/src/app/globals.css` _(brand OKLCH `@theme` block + density variants; legacy shadcn-init `:root`/`.dark` blocks removed)_
- `sb-tryon/.storybook/main.ts` _(dropped `@storybook/addon-onboarding`; dropped unused `src/**/*.mdx` glob)_
- `sb-tryon/vitest.setup.ts` _(toHaveNoViolations matcher + matchMedia + ResizeObserver polyfills)_
- `sb-tryon/vitest.shims.d.ts` _(matcher type augmentation for `Assertion` and `AsymmetricMatchersContaining`)_

**Deleted files:**
- `sb-tryon/.storybook/preview.ts` _(replaced by .tsx for the JSX decorator)_
- `sb-tryon/src/stories/` _(entire directory: Button.tsx, Button.stories.ts, Header.tsx, Header.stories.ts, Page.tsx, Page.stories.ts, button.css, header.css, page.css, Configure.mdx, assets/*)_

### Review Findings

> Reviewed: 2026-05-05 (claude-sonnet-4-6) — Group A (infrastructure: `globals.css`, `main.ts`, `vitest.setup.ts`, `vitest.shims.d.ts`, `preview.tsx`, `render.tsx`) and Group B (form primitives: `button`, `input`, `textarea`, `form`, `label`, `checkbox`, `radio-group`, `switch` × 3 files each). Groups C–D (overlay + display primitives) not yet reviewed.

---

#### Group B — Decision-Needed

- [x] [Review][Decision] DN-G2: `aria-disabled` vs native `disabled` policy for Radix Checkbox, Switch, RadioGroup — **resolved: accept native `disabled` (option a)**. Radix internally maps `disabled` → `aria-disabled` on the rendered element; native `disabled` is AT-correct and matches expected form-control tab-order behavior. UX-DR9's `aria-disabled` mandate applies to Button-pattern interactive elements, not Radix-managed form controls.

#### Group B — Patch (major)

- [x] [Review][Patch] P-G1: Button `asChild + loading` destroys slotted element — **fixed**: guarded with `!asChild &&` before loading spinner branch; `asChild` mode falls through to `children` unchanged [`sb-tryon/src/components/ui/button.tsx`]
- [x] [Review][Patch] P-G2: Button loading state missing `aria-busy="true"` and click/keyboard event blocking — **fixed**: added `aria-busy={loading || undefined}` and `aria-disabled={isDisabled || undefined}` after spread; added `"use client"` directive [`sb-tryon/src/components/ui/button.tsx`]
- [x] [Review][Patch] P-G3: Button `aria-disabled` guard is CSS-only (`pointer-events-none`) — **fixed**: destructured `"aria-disabled"` and `onClick` from props; added `handleClick` interceptor that calls `e.preventDefault()` when `isDisabled` [`sb-tryon/src/components/ui/button.tsx`]
- [x] [Review][Patch] P-G4: Checkbox missing `peer` class — **fixed**: added `peer` to the className string on `CheckboxPrimitive.Root` [`sb-tryon/src/components/ui/checkbox.tsx`]
- [x] [Review][Patch] P-G5: `FormDescription` not wired to `aria-describedby` — **fixed**: added JSDoc documenting that callers must pass matching `id` + `aria-describedby` manually [`sb-tryon/src/components/ui/form.tsx`]
- [x] [Review][Patch] P-G6: `FormMessage` has no `aria-live` or `role="status"` — **fixed**: added `role="alert"` to `FormPrimitive.Message` for screen-reader announcement of injected errors [`sb-tryon/src/components/ui/form.tsx`]
- [x] [Review][Patch] P-G7: `Form` wrapper has no `noValidate` default — **fixed**: added `noValidate = true` default parameter, forwarded explicitly to `FormPrimitive.Root` [`sb-tryon/src/components/ui/form.tsx`]
- [x] [Review][Patch] P-G8: RSC directive inconsistency — **fixed**: added `"use client"` to `input.tsx` and `textarea.tsx` [`sb-tryon/src/components/ui/input.tsx`, `textarea.tsx`]

#### Group B — Patch (minor)

- [x] [Review][Patch] P-G9: Button `aria-live="polite"` region is always in the DOM — **fixed**: moved `aria-live="polite"` and `role="status"` to the sr-only `<span>` inside the loading branch; outer wrapper has neither attribute [`sb-tryon/src/components/ui/button.tsx`]
- [x] [Review][Patch] P-G10: Checkbox indeterminate visual uses `CheckIcon` — **fixed**: added `MinusIcon` branch for `data-[state=indeterminate]` with Tailwind parent-state selectors; `CheckIcon` uses `[[data-state=checked]>&]:block`, `MinusIcon` uses `[[data-state=indeterminate]>&]:block` [`sb-tryon/src/components/ui/checkbox.tsx`]
- [x] [Review][Patch] P-G11: Button loading test asserts text presence but not `aria-busy` or click blocking — **fixed**: added test "blocks clicks and announces busy state when loading" asserting `aria-busy="true"`, `aria-disabled="true"`, and `onClick` not called after `fireEvent.click` [`sb-tryon/src/components/ui/button.test.tsx`]
- [x] [Review][Patch] P-G12: Textarea missing `aria-invalid` test — **fixed**: added "reflects aria-invalid on the textarea element" test [`sb-tryon/src/components/ui/textarea.test.tsx`]
- [x] [Review][Patch] P-G13: RadioGroup test has only 1 case; Button stories missing size variant stories — **fixed**: added disabled-item test to RadioGroup; added `SmallSize` and `LargeSize` stories to Button [`sb-tryon/src/components/ui/radio-group.test.tsx`, `button.stories.tsx`]

#### Group B — Defer

- [x] [Review][Defer] D-G1: Checkbox `required` inside `FormControl asChild` silently never triggers `valueMissing` — Radix Checkbox renders as `<button type="button">` which has `validity.valid === true` always; Radix Form's constraint validation ignores it [`sb-tryon/src/components/ui/checkbox.tsx`] — deferred, inherent Radix Form + Checkbox architecture limitation; document at usage site when first used in a required field
- [x] [Review][Defer] D-G2: `RadioGroup` `name` prop not auto-forwarded from `FormField` — callers must explicitly pass `name` to both `FormField` and `RadioGroup` for form submission to work [`sb-tryon/src/components/ui/radio-group.tsx`] — deferred, caller responsibility; add to story Dev Notes
- [x] [Review][Defer] D-G3: No keyboard interaction tests (`Space` key) for Checkbox or Switch — only render + axe tested; `@testing-library/user-event` keyboard simulation in JSDOM is untested for these components [`sb-tryon/src/components/ui/checkbox.test.tsx`, `switch.test.tsx`] — deferred, functional risk is low given Radix handles keyboard; add in next test pass
- [x] [Review][Defer] D-G4: CSS token values (`var(--color-*)`) have no fallback — silent transparency if token is missing at render time — deferred, inherent Tailwind v4 `@theme` architecture; pre-existing for all primitives

#### Decision-Needed

- [x] [Review][Decision] DN-1: Density variants use plain CSS attribute selectors instead of `@custom-variant` — **resolved: keep as-is**. CSS-variable approach (`--density-scale`) is sufficient; no Tailwind density utility classes planned. AC2's `@custom-variant` language is aspirational; the CSS-variable contract is what Story 1.4 `DensityContainer` actually consumes.
- [x] [Review][Decision] DN-2: `renderWithProviders` does not auto-run axe internally — **resolved: keep as-is**. Explicit `expect(container).toHaveNoViolations()` at the test site is clearer and lets tests opt out. Dev Notes example already describes this as the intended pattern.
- [x] [Review][Decision] DN-3: `.mdx` glob removed from `main.ts` stories array — **resolved: keep removed**. Add MDX files explicitly to the array if/when feature-level docs are needed.

#### Patch

- [x] [Review][Patch] P-1: `mockProviders` singleton in `preview.tsx` leaks state across stories — **fixed**: moved `createMockProviders()` inside the decorator function [`.storybook/preview.tsx`]
- [x] [Review][Patch] P-2: `axe.run` singleton can throw "Axe is already running" under concurrent test execution — **fixed**: added `axeQueue` promise chain to serialize all `axe.run` calls [`sb-tryon/vitest.setup.ts`]
- [x] [Review][Patch] P-3: `toHaveNoViolations` has no runtime type guard — **fixed**: added `instanceof Element` check; non-Element input returns a descriptive failure [`sb-tryon/vitest.setup.ts`]
- [x] [Review][Patch] P-4: `toHaveNoViolations` `pass: true` message reads "no axe violations" — **fixed**: changed to "expected axe violations but found none" [`sb-tryon/vitest.setup.ts`]
- [x] [Review][Patch] P-5: `matchMedia` polyfill `dispatchEvent` returns `false` — **fixed**: changed to `() => true` [`sb-tryon/vitest.setup.ts`]
- [x] [Review][Patch] P-6: `AsymmetricMatchersContaining.toHaveNoViolations` typed as `Promise<void>` — **fixed**: removed `AsymmetricMatchersContaining` augmentation; added explanatory comment [`sb-tryon/vitest.shims.d.ts`]
- [x] [Review][Patch] P-7: `@storybook/addon-onboarding` removed from `addons` array but still declared in `package.json` devDependencies — **fixed**: ran `pnpm remove @storybook/addon-onboarding` [`sb-tryon/package.json`]
- [x] [Review][Patch] P-8: `[data-density]` CSS selectors placed outside any `@layer` — **fixed**: moved into `@layer base` [`sb-tryon/src/app/globals.css`]

#### Defer

- [x] [Review][Defer] D-1: `QueryClient` created per `renderWithProviders` call is never explicitly cleaned up — leaked background timers possible in large test suites [`sb-tryon/src/test-utils/render.tsx`] — deferred, pre-existing pattern; testing-library `cleanup` handles unmounting
- [x] [Review][Defer] D-2: `preview.tsx` decorator is missing `QueryClientProvider` — stories that use TanStack Query hooks will throw "No QueryClient set" [`sb-tryon/.storybook/preview.tsx`] — deferred, no Story 1.3 primitives use React Query; address when first query-dependent story is added
- [x] [Review][Defer] D-3: `globals.css` `font-family` hardcodes system font stack — diverges from production Geist font (Next.js `next/font` loader unavailable in Storybook) [`sb-tryon/src/app/globals.css`] — deferred, pre-existing architectural tension between Next.js font loader and Storybook

#### Group C — Decision-Needed

- [x] [Review][Decision] DN-C1: `Tooltip` self-wraps in `TooltipProvider` — each tooltip has its own provider, so cross-tooltip `skipDelay` (quick-reopen without re-delay) doesn't work — **resolved: keep self-wrapping (option a)**. V1 demo's source-attribution tooltips don't require cross-tooltip delay sharing; caller API is simpler. Remove the now-redundant story-level `TooltipProvider` decorator.

#### Group C — Patches

- [x] [Review][Patch] P-C1: `dialog.test.tsx` open-state test used `document.body` as axe target with `void container` — **fixed**: switched axe target to `getByRole("dialog")` (scopes axe to the dialog element, avoiding Radix `hideOthers` aria-hidden noise on RTL siblings); removed `void container`; added explanatory comment [`sb-tryon/src/components/ui/dialog.test.tsx`]
- [x] [Review][Patch] P-C2: `tooltip.stories.tsx` had redundant `TooltipProvider` decorator — **fixed**: removed `decorators` array and unused `TooltipProvider` import; `Tooltip` self-wraps, so the outer decorator's `delayDuration` was silently shadowed [`sb-tryon/src/components/ui/tooltip.stories.tsx`]
- [x] [Review][Patch] P-C3: `alert-dialog.test.tsx` only tested closed state — **fixed**: added open-state test rendering `<AlertDialog open>` and scoping axe to `getByRole("alertdialog")` to capture portal content [`sb-tryon/src/components/ui/alert-dialog.test.tsx`]

#### Group C — Defer

- [x] [Review][Defer] D-C1: `AlertDialogAction` + `Button.handleClick` interaction trap — when `AlertDialogAction` carries `aria-disabled="true"`, Button's `handleClick` calls `e.preventDefault()` before Radix's `composeEventHandlers` fires `onOpenChange(false)`, silently preventing dialog close — deferred; no V1 demo scenario passes `aria-disabled` to an action button; document at usage site [`sb-tryon/src/components/ui/alert-dialog.tsx`]
- [x] [Review][Defer] D-C2: Dialog/AlertDialog overlay missing `data-[state=open/closed]` opacity classes — `transition-opacity` present but no start/end values; overlay appears/disappears without fade animation — deferred; V1 demo acceptable without entrance/exit animation; add `tw-animate-css` `animate-in/out` variants in Story 1.4+ polish pass
- [x] [Review][Defer] D-C3: `PopoverContent` no open-state axe test — popover portal content escapes `container`; a future open-state test must target `document.body` — deferred; add when first consumer story with `PopoverContent` is built
- [x] [Review][Defer] D-C4: `DialogClose` standalone usage has no accessible-name guard — exported thin wrapper with no `aria-label`; all current usages are `asChild` wrapping a `<Button>` with visible text so WCAG 4.1.2 is satisfied — deferred; add JSDoc note in Story 1.4 when standalone `DialogClose` is first used

#### Group D — Patches

- [x] [Review][Patch] P-D1: `slider.tsx` `getThumbProps` — two gaps: (a) array out-of-bounds gives `aria-label={undefined}`; (b) no-label path returns `{}` → silent axe `aria-required-name` failure — **fixed**: array branch now uses `thumbLabels[index] ?? \`Value ${index + 1}\``; final fallback returns `{ "aria-label": \`Value ${index + 1}\` }` — added `slider.test.tsx` test asserting fallback label [`sb-tryon/src/components/ui/slider.tsx`, `slider.test.tsx`]
- [x] [Review][Patch] P-D2: `TabsContent` has `outline-none` but no `focus-visible:` ring — Radix 1.x sets `tabIndex={0}` on `tabpanel` internally; suppressing the ring without a replacement violates WCAG 2.4.7 — **fixed**: added `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-accent-primary)` (same pattern as all other interactive elements) [`sb-tryon/src/components/ui/tabs.tsx`]
- [x] [Review][Patch] P-D3: `avatar.stories.tsx` `ImageLoaded` story used a live `pravatar.cc` URL — network dependency in Storybook CI; image fails silently to fallback in offline runners — **fixed**: replaced with a `data:` URI (reliable load without network) [`sb-tryon/src/components/ui/avatar.stories.tsx`]
- [x] [Review][Patch] P-D4: `separator.test.tsx` never tested `decorative={false}` path; `separator.tsx` `decorative` prop had no JSDoc — **fixed**: added JSDoc explaining `decorative={false}` → `role="separator"`; added test asserting `getByRole("separator")` and axe pass [`sb-tryon/src/components/ui/separator.tsx`, `separator.test.tsx`]

#### Group D — Defer

- [x] [Review][Defer] D-D1: `slider.tsx` `value=[]` edge case — explicit empty array causes 0 thumbs to render while Radix root still defaults to `[min]`, mismatching the rendered UI — deferred; TypeScript types guard against this in practice; add guard when first encountered
- [x] [Review][Defer] D-D2: `select.test.tsx` no open-state portal axe test — dropdown list renders via `SelectPrimitive.Portal`; axe on `container` misses options — deferred; consistent with D-C3 popover defer; add when first consumer story builds on Select
- [x] [Review][Defer] D-D3: `slider.tsx` single-string `thumbLabels` for multi-thumb — every thumb gets the same label; distinguishable only by `aria-valuenow` — deferred; single-string is documented for single-thumb use; multi-thumb callers should use array form

### Change Log

| Date | Change | Author |
|---|---|---|
| 2026-05-04 | Story dev guide created (create-story workflow). | claude-opus-4-7 (1M context) |
| 2026-05-04 | Story implemented: brand OKLCH `@theme` tokens + density variants in `globals.css`; 21 primitives in `src/components/ui/` (the 20 mandated + `toggle` as a shadcn dep) with colocated tests + stories; `renderWithProviders` + in-house `toHaveNoViolations` axe matcher; Storybook decorator wraps every story in `ProvidersContext` and runs a11y in error mode; legacy `src/stories/` removed; full CI gate chain green. Status → review. | claude-opus-4-7 (1M context) |
| 2026-05-05 | Code review — Group A (infrastructure) complete. 3 decision-needed, 8 patches, 3 deferred, 4 dismissed. Groups B–D (primitives) pending. | claude-sonnet-4-6 |
| 2026-05-05 | Code review complete — Groups B, C, D reviewed. Total: 4 decisions, 23 patches applied, 14 deferred, multiple dismissed. 102 unit tests passing, typecheck clean. Status → done. | claude-sonnet-4-6 |
