# Story 1.9: Build LightingToggle (3 calibrated presets) with ≤100ms response

**Status:** ready-for-dev

> Validation is optional. Run `validate-story` before `dev-story` if a quality second-pass is wanted.

## Story

As Maya the consumer,
I want to toggle between salon, daylight, and warm-interior lighting presets,
So that I see how the color reads under the lighting conditions I'll actually encounter outside the salon (FR4, NFR3, UX-DR4).

## Acceptance Criteria

**AC1 — `<LightingToggle>` renders a Radix ToggleGroup three-position toggle (Indoor / Daylight / Salon)**

Given UX-DR4's LightingToggle spec,
When the developer creates `src/components/render/LightingToggle.tsx` (Client Component, `"use client"`) with colocated `LightingToggle.test.tsx` and `LightingToggle.stories.tsx`,
Then the component renders:
- A `<ToggleGroup type="single">` (from `@/components/ui/toggle-group`) with `aria-label="Lighting preset"` and three `<ToggleGroupItem>` children with `value` of `"indoor" | "daylight" | "salon"`.
- Each `<ToggleGroupItem>` has a visible label (`Indoor`, `Daylight`, `Salon`) and an `aria-label` matching the preset's purpose (`Warm indoor lighting`, `Neutral daylight`, `Cool salon lighting`).
- The currently active preset is visually distinguished (Radix sets `data-state="on"` automatically; toggleVariants already styles it).
- The component is a controlled ToggleGroup whose `value` prop derives from the URL `?lighting=` param (initialised via `useTryOnParams()`).

**AC2 — Toggle change updates URL state `?lighting=<preset>` (AR6) and Zustand store**

Given the architecture's AR6 URL-state tier and the `useTryOnStore` Zustand store,
When the user activates a different preset (via mouse, touch, or keyboard arrow + Enter/Space),
Then:
- The handler calls `useTryOnStore().setLightingPreset(preset)` to keep the store in sync (single source of truth invariant from Story 1.7 / cross-cutting concern #4).
- The handler calls `router.replace(pathname + "?" + params.toString(), { scroll: false })` with `?lighting=<preset>` to persist shareability and back-navigation via URL state (AR6).
- The new URL preset is consumed by `ColorRender`'s Effect 2 (which already depends on `lightingPreset` from `useTryOnParams()`), triggering a re-composite with the calibrated lighting profile via `applyLightingPreset()`.
- Radix `ToggleGroup` with `type="single"` may emit `""` (empty string) on de-activation when the user re-clicks the active item. Guard the handler: ignore empty strings; never write `?lighting=` (no value) or `setLightingPreset("")` — `LightingPreset` is `"indoor" | "daylight" | "salon"`, no empty.

**CRITICAL DESIGN NOTE** — Story 1.7's `ColorRender` reads `lightingPreset` from `useTryOnParams()` (URL), NOT from the store. So updating the URL is what triggers the re-composite. We update the store too for invariant consistency (other components like the future `/try-on` page composition may read store directly), but the visible render shift is driven by the URL update path. The Story 1.8 FadeSimulator pattern that writes to store on every drag frame does NOT apply here — lighting toggle is a discrete event, not a 60fps drag.

**AC3 — Toggle response ≤100ms (NFR3) — no expensive work in the change handler**

Given NFR3's ≤100ms toggle response budget,
When the user activates a preset,
Then the handler path performs only: input validation (empty-string guard) → store write → URL write → local state update for visual feedback. No fetching, no shader recompile, no texture allocation. The lighting math (`applyLightingPreset()` in `src/lib/ar/lighting-postprocess.ts`) is pure CPU and runs in microseconds during `ColorRender`'s next composite — the budget is met without explicit caching.

The epic's claim "pre-computed per (color, lighting) pair and cached in WebGL textures at color-selection time" describes `src/lib/ar/lighting-postprocess.ts`'s constant-time calibration table (`LIGHTING_CALIBRATION`, fixed at module load), not a runtime cache built by this story. **Do NOT add a `Map<colorId, Record<LightingPreset, ColorVector>>` cache** — `applyLightingPreset()` is already fast enough that the budget is met without one.

A synthetic Vitest performance test asserts the handler returns within 16ms wall-time per toggle when 3 sequential toggles fire (indoor → daylight → salon → indoor); the actual user-perceived 100ms budget is end-to-end (toggle → composite re-render) and is dominated by `ColorRender`'s Effect 2 + WebGL2 redraw, which Story 1.7 already exercises.

**AC4 — Active preset persists in URL `?lighting=` and is read back on mount (AR6)**

Given the user shares a link or hits browser-back,
When the page re-renders,
Then `useTryOnParams()` parses `?lighting=indoor|daylight|salon` (already implemented), and the ToggleGroup `value` prop reflects that preset so the correct item shows as active. Unknown / missing values fall back to `daylight` (already validated by `useTryOnParams()` and `try-on-params.test.ts`).

**AC5 — Keyboard arrow navigation between presets + screen-reader announcement on change**

Given UX-DR13's keyboard accessibility requirement,
When the user tabs into the toggle group and presses Arrow Left / Arrow Right,
Then Radix `ToggleGroup` handles the roving tabindex and arrow navigation automatically (no custom code). Enter / Space activates the focused item.

**And** a visually-hidden `<div aria-live="polite" aria-atomic="true">` updates its `textContent` on every preset change to:
`"Lighting changed to {preset}"` (e.g., `"Lighting changed to daylight"`).

The live region is always in the DOM (not conditionally rendered) to ensure screen-reader association — same pattern as `FadeSimulator` (Story 1.8).

**AC6 — `prefers-reduced-motion: reduce` results in an instant toggle (no cross-fade, NFR24, UX-DR13)**

Given `prefers-reduced-motion: reduce` in the user's OS/browser settings,
When the user changes the preset,
Then the toggle's visual transition is instant. There is no cross-fade between renders driven by `LightingToggle` — `ColorRender` does not cross-fade between lighting states (instant re-composite). The `ToggleGroupItem`'s built-in `data-state` styling change is a discrete CSS state, not an animation. **No additional JS branch or CSS variant is required** — confirm via the axe-core / story render that no `transition-*` rules animate `[data-state]` changes on the toggle items.

If a future polish pass adds a cross-fade between lighting states (in `ColorRender`), it would gate on `motion-reduce:transition-none` at that site, not this one.

**AC7 — Vitest tests cover all listed scenarios**

Required test cases (using the FadeSimulator test mocking strategy as the template):

1. `renders three toggle items labeled Indoor / Daylight / Salon`
2. `defaults active item to daylight when ?lighting is missing` (mock `useTryOnParams` to return `{ lightingPreset: "daylight" }`)
3. `reflects URL ?lighting=salon by marking Salon as the active item` (mock `useTryOnParams` to return `{ lightingPreset: "salon" }`)
4. `clicking Indoor calls setLightingPreset("indoor") on the store`
5. `clicking Indoor calls router.replace("/try-on?lighting=indoor", { scroll: false })`
6. `clicking the currently-active preset (Radix emits "") does NOT call setLightingPreset or router.replace` (AC2 empty-string guard)
7. `live region announces "Lighting changed to indoor" after switching to indoor`
8. `live region is always in DOM (role="status")`
9. **Performance test** — fire 3 sequential preset changes via `act()` + the captured `onValueChange`; assert total elapsed wall-time / 3 ≤ 16ms (AC3 synthetic budget)
10. `keeps existing search params intact` — initialise mock `useSearchParams` with `color=auburn&week=4`, fire a preset change, assert `router.replace` is called with all three params present (`color=auburn`, `week=4`, and the new `lighting=`)

Mock strategy mirrors `FadeSimulator.test.tsx`:
- `vi.mock("next/navigation")` for `useRouter`, `usePathname`, `useSearchParams`
- `vi.mock("@/lib/url-state/try-on-params")` returning a mutable `mockLightingPreset` closure
- `vi.mock("@/lib/stores/try-on")` returning `{ setLightingPreset: mockSetLightingPreset }`
- `vi.mock("@/components/ui/toggle-group")` exposing a captured `onValueChange` callback so tests can fire it directly (avoids Radix roving-tabindex jsdom limitations; consistent with how Slider/Select are mocked in `FadeSimulator.test.tsx`)

**AC8 — Colocated Storybook stories cover all visual states (CI gate)**

Given the CI gate `pnpm check:stories`: every `src/components/**` file must have a `.stories.tsx` colocated (cross-cutting concern #9),
When the developer creates `LightingToggle.stories.tsx`,
Then the following story variants are covered (all must pass axe-core, enforced by the Storybook Vitest a11y addon):
- `Default` — daylight active (the truthful default per UX spec)
- `Indoor` — indoor active (warmer cast)
- `Salon` — salon active (the "looked different in the salon" reveal — kills the #1 trust complaint per UX spec line 122)
- `WithSiblingControls` — composed alongside a placeholder `FadeSimulator` to validate visual hierarchy as it will appear on the `/try-on` route (Story 1.10 wires this up for real)

Use the Story 1.8 `withStoreReset` decorator pattern + the `parameters.nextjs.navigation` block to seed initial URL state per story (Storybook's `@storybook/nextjs-vite` reads this; see `FadeSimulator.stories.tsx` for the canonical setup).

## Tasks / Subtasks

- [ ] **Task 1 — Add LightingToggle copy strings to `src/lib/copy/render.ts`** (AC5)
  - [ ] Read `src/lib/copy/render.ts` fully first (already exists; Story 1.7 added `confidenceBanner`; Story 1.8 added `fadeSimulator`).
  - [ ] Add `lightingToggle` key to `renderCopy` following the same `Object.freeze` pattern:
    ```typescript
    lightingToggle: Object.freeze({
      groupLabel: "Lighting preset",
      indoorLabel: "Indoor",
      daylightLabel: "Daylight",
      salonLabel: "Salon",
      indoorAriaLabel: "Warm indoor lighting",
      daylightAriaLabel: "Neutral daylight",
      salonAriaLabel: "Cool salon lighting",
      liveRegion: (preset: string): string => `Lighting changed to ${preset}`,
    }),
    ```
  - [ ] Do NOT change `renderCopy.confidenceBanner` or `renderCopy.fadeSimulator` — leave Story 1.7 / 1.8 copy untouched.

- [ ] **Task 2 — Create `src/components/render/LightingToggle.tsx`** (AC1–AC6)
  - [ ] Add `"use client"` directive — uses `useRouter`, `usePathname`, `useSearchParams`, `useCallback`, `useRef`.
  - [ ] Import `ToggleGroup`, `ToggleGroupItem` from `@/components/ui/toggle-group`.
  - [ ] Import `useTryOnStore` from `@/lib/stores/try-on`.
  - [ ] Import `useTryOnParams` from `@/lib/url-state/try-on-params`.
  - [ ] Import `renderCopy` from `@/lib/copy/render`.
  - [ ] Import `type LightingPreset` from `@/lib/ar/lighting-postprocess`.
  - [ ] Do NOT import `applyLightingPreset` — `LightingToggle` does not call the lighting math; `ColorRender` owns that via Effect 2.
  - [ ] Do NOT import `@mediapipe/*` or `@/lib/providers/mock/*` (ESLint blocks).
  - [ ] Wrap the export in a `<Suspense fallback={null}>` boundary so callers don't need to manage it. Same reason as Story 1.7's `ColorRender` (calling `useSearchParams()` requires a Suspense ancestor in Next.js App Router; otherwise SSG bail-out occurs).
  - [ ] Empty-string guard in the `onValueChange` handler (AC2): `if (value === "" || !VALID_PRESETS.includes(value as LightingPreset)) return;`.
  - [ ] See Dev Notes for full component design.

- [ ] **Task 3 — Create `src/components/render/LightingToggle.test.tsx`** (AC1–AC7)
  - [ ] Mock `next/navigation` (`useRouter`, `usePathname`, `useSearchParams`), `@/lib/url-state/try-on-params`, `@/lib/stores/try-on`, and `@/components/ui/toggle-group` per the strategy in `FadeSimulator.test.tsx`.
  - [ ] Use `vi.clearAllMocks()` + reset `mockLightingPreset` and `mockSearchParams` in `beforeEach`.
  - [ ] Use `fireEvent` + the captured `onValueChange` from the mocked ToggleGroup. Do NOT install `@testing-library/user-event` — it is NOT in the project (Story 1.8 debug log).
  - [ ] All 10 test cases from AC7.

- [ ] **Task 4 — Create `src/components/render/LightingToggle.stories.tsx`** (AC8)
  - [ ] Wrap each story in a `withStoreReset` decorator that calls `useTryOnStore.setState({ ...INITIAL })` to prevent state leakage (Story 1.8 pattern).
  - [ ] Provide the 4 variants listed in AC8 with correct `parameters.nextjs.navigation.searchParams`.
  - [ ] Use `import type { Decorator, Meta, StoryObj } from "@storybook/nextjs-vite"` (NOT `@storybook/react`).
  - [ ] DO NOT import from `storybook/test` or `@storybook/test` — Story 1.8 does not require them and they have caused churn in prior stories; the a11y addon runs axe-core automatically.

- [ ] **Task 5 — CI gates verification**
  - [ ] `pnpm typecheck` — no TS errors.
  - [ ] `pnpm lint` — no ESLint errors. Especially no `@mediapipe/*` or `@/lib/providers/mock/*` imports.
  - [ ] `pnpm vitest run --coverage` — all new tests pass, coverage ≥70% on the new files.
  - [ ] `pnpm storybook build` — 4 new stories render without errors.
  - [ ] `pnpm check:stories` — colocation requirement satisfied.
  - [ ] `pnpm build` + `pnpm size-limit` — bundle ≤300KB gzipped excluding `@mediapipe/*` (NFR8). LightingToggle is a small component; size should not change materially from Story 1.8.
  - [ ] Document file list and completion notes in Dev Agent Record below.

## Dev Notes

### Why this story exists (FR4 + NFR3 + UX commitment)

The lighting toggle is the demo's *"looked different in the salon"* reveal. Designed correctly, it kills the #1 trust complaint in the AR-try-on category in 2 seconds of interaction (UX spec lines 122, 174, 474). The toggle is one of the two interactions that, with `FadeSimulator` (Story 1.8) and `ColorRender` (Story 1.7), defines the entire product hook (UX spec line 425: *"The interactive try-on triple: color render + fade scrub + lighting toggle"*).

Daylight is the **default** preset (UX spec line 528: *"Daylight (default), Salon lights, Warm interior. Current state visually emphasized."*). This is the honesty-first design choice — every other AR try-on defaults to flattering salon-warm light. We refuse that pattern.

Stories 1.10 (`/try-on` route composition) and 1.11 (`ShareLook`) compose ON TOP of what this story produces. Story 1.10's e2e test (`maya.spec.ts`) asserts the full upload → consent → render → fade scrub → **lighting toggle** → "Find a salon" exit path.

### Files to READ completely before coding

The dev agent MUST read these files completely before writing code. Skipping this is the primary cause of implementation failures and review cycles. For each file, understand the current state and what (if anything) this story must not break.

1. **`sb-tryon/src/lib/ar/lighting-postprocess.ts`** (UPDATE: zero changes — read for context only). Exports `type LightingPreset = "indoor" | "daylight" | "salon"`, the `LIGHTING_CALIBRATION` table, and `applyLightingPreset(source, preset)`. The `daylight` preset is fast-pathed to return `source` unchanged (deliberate identity to prevent Lab→RGB→Lab quantization drift). `LightingToggle` does NOT call `applyLightingPreset` — `ColorRender` (Story 1.7) does, during composite.

2. **`sb-tryon/src/lib/stores/try-on.ts`** (UPDATE: zero changes — read for context only). The store already has `lightingPreset: LightingPreset` (defaulting to `"daylight"`) and the `setLightingPreset(preset)` action. Initial state matches the UX truthful-default invariant.

3. **`sb-tryon/src/lib/url-state/try-on-params.ts`** (UPDATE: zero changes — read for context only). `useTryOnParams()` already parses `?lighting=` and returns one of `"indoor" | "daylight" | "salon"`. Unknown values fall back to `"daylight"`. Validated against `VALID_LIGHTING_PRESETS`.

4. **`sb-tryon/src/components/ui/toggle-group.tsx`** (UPDATE: zero changes). The Radix-wrapped primitive. `ToggleGroup` accepts standard Radix props: `type="single"`, `value`, `onValueChange`, `aria-label`. `ToggleGroupItem` accepts `value`, `aria-label`. Radix `ToggleGroup` with `type="single"` is the right primitive for a three-state mutually-exclusive selector — DO NOT use `RadioGroup` (Radix `Toggle*` ships keyboard arrow nav out of the box; `RadioGroup` would require redesign for our visual treatment).

5. **`sb-tryon/src/components/render/ColorRender.tsx`** (UPDATE: zero changes — read to confirm the contract). Effect 2's dep array (line 311) is `[colorId, lightingPreset, fadeWeek, washesPerWeek, composite]` where `lightingPreset` comes from `useTryOnParams()` (URL). This means an URL `?lighting=` update IS what re-fires the composite. Do not change ColorRender; just make sure LightingToggle updates the URL.

6. **`sb-tryon/src/components/render/FadeSimulator.tsx`** (UPDATE: zero changes — read as the canonical pattern). Mirrors the patterns this story uses: client component, useRouter / usePathname / useSearchParams, useTryOnParams to seed initial state, useTryOnStore for the corresponding setter, useCallback handlers, sr-only live region with `role="status"` + `aria-live="polite"`.

7. **`sb-tryon/src/components/render/FadeSimulator.test.tsx`** (UPDATE: zero changes — read as the test-strategy template). Captures Slider callbacks via factory closure inside a `vi.mock` call so tests can fire them directly without Radix portal / pointer-event complications in jsdom. Apply the same trick to mock `ToggleGroup`.

8. **`sb-tryon/src/components/render/FadeSimulator.stories.tsx`** (UPDATE: zero changes — read as the Storybook template). Sets `parameters.nextjs.navigation.searchParams` per-story to seed the URL state. Uses a `withStoreReset` decorator from `@storybook/nextjs-vite`'s `Decorator` type.

9. **`sb-tryon/src/lib/copy/render.ts`** (UPDATE: ADD a `lightingToggle` key). See Task 1.

10. **`sb-tryon/AGENTS.md`** (UPDATE: zero changes — read for the cross-cutting rules). Cross-cutting concerns #4 (state tier ownership), #8 (test colocation), #9 (Storybook colocation), and the ESLint rules in §6 are all relevant.

### Component design

```typescript
"use client";

import { Suspense, useCallback, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { type LightingPreset } from "@/lib/ar/lighting-postprocess";
import { renderCopy } from "@/lib/copy/render";
import { useTryOnStore } from "@/lib/stores/try-on";
import { useTryOnParams } from "@/lib/url-state/try-on-params";
import { cn } from "@/lib/utils";

const VALID_PRESETS: readonly LightingPreset[] = ["indoor", "daylight", "salon"];

export interface LightingToggleProps {
  className?: string;
}

function LightingToggleInner({ className }: LightingToggleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Seed from URL via useTryOnParams (validated; falls back to daylight).
  const { lightingPreset: urlPreset } = useTryOnParams();
  const setLightingPreset = useTryOnStore((s) => s.setLightingPreset);

  // Local state mirrors URL preset for instant visual feedback — avoids the
  // microsecond delay between router.replace and useSearchParams re-emit.
  // Initialised once from URL; updated synchronously in the handler.
  const [activePreset, setActivePreset] = useState<LightingPreset>(urlPreset);

  const liveRegionRef = useRef<HTMLDivElement>(null);

  const updateLiveRegion = useCallback((preset: LightingPreset) => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent =
        renderCopy.lightingToggle.liveRegion(preset);
    }
  }, []);

  const handleValueChange = useCallback(
    (value: string) => {
      // Radix ToggleGroup type="single" emits "" when the user re-activates
      // the current item (de-selection). LightingPreset cannot be empty —
      // guard and bail (AC2).
      if (value === "" || !VALID_PRESETS.includes(value as LightingPreset)) {
        return;
      }
      const preset = value as LightingPreset;

      // 1. Local state — instant visual feedback (no URL round-trip lag).
      setActivePreset(preset);

      // 2. Zustand store — single source of truth invariant.
      setLightingPreset(preset);

      // 3. URL — persist for shareability + back-nav + ColorRender Effect 2.
      const params = new URLSearchParams(searchParams.toString());
      params.set("lighting", preset);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });

      // 4. Accessibility — screen-reader announcement (AC5).
      updateLiveRegion(preset);
    },
    [setLightingPreset, router, pathname, searchParams, updateLiveRegion],
  );

  const copy = renderCopy.lightingToggle;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <ToggleGroup
        type="single"
        value={activePreset}
        onValueChange={handleValueChange}
        aria-label={copy.groupLabel}
      >
        <ToggleGroupItem value="indoor" aria-label={copy.indoorAriaLabel}>
          {copy.indoorLabel}
        </ToggleGroupItem>
        <ToggleGroupItem value="daylight" aria-label={copy.daylightAriaLabel}>
          {copy.daylightLabel}
        </ToggleGroupItem>
        <ToggleGroupItem value="salon" aria-label={copy.salonAriaLabel}>
          {copy.salonLabel}
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Visually-hidden live region — always in DOM for AT association (AC5) */}
      <div
        ref={liveRegionRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
    </div>
  );
}

// Suspense wrapper — same reason as ColorRender (Story 1.7). useSearchParams()
// requires a Suspense ancestor in Next.js App Router; wrapping here lets
// callers (Story 1.10's /try-on page) compose without managing boundaries.
export function LightingToggle(props: LightingToggleProps) {
  return (
    <Suspense fallback={null}>
      <LightingToggleInner {...props} />
    </Suspense>
  );
}
```

### Key design decisions (do NOT relitigate)

1. **No texture / Lab-vector cache.** The epic's "pre-computed per (color, lighting) pair and cached in WebGL textures" describes the static `LIGHTING_CALIBRATION` table that's already constant-time and module-loaded in Story 1.5. `applyLightingPreset()` is pure CPU math (a single Lab→RGB→clamp→pow→RGB→Lab roundtrip). The toggle handler does NO lighting math; the math runs in `ColorRender`'s composite during the next animation frame and is microseconds-cheap. **Building a runtime cache here would be premature optimization that adds state-tier confusion** (where is the cache invalidated when color changes?). Do not add one.

2. **URL is the source of truth for `ColorRender`.** Story 1.7's `ColorRender` reads `lightingPreset` from `useTryOnParams()` (URL), not the Zustand store. So `router.replace(?lighting=)` is what drives the visible re-render. We also call `setLightingPreset` on the store for cross-cutting concern #4 (state tier ownership — every piece of state lives in exactly one tier; lighting lives in URL, mirrored in store so other components reading store stay consistent).

3. **Local state for instant visual feedback.** The ToggleGroup is controlled. If we passed `value={urlPreset}` (URL-derived), there would be a brief tick between `router.replace()` and `useSearchParams()` re-emitting where the visual still shows the OLD preset. Local `activePreset` state seeded once from URL gives the toggle a synchronous visual update, while URL + store updates fire on the same call. Pattern parallels `FadeSimulator`'s `sliderDay` local state.

4. **`"use client"` required.** Uses `useRouter`, `usePathname`, `useSearchParams`, `useState`, `useRef`, `useCallback`.

5. **Suspense wrapper.** `useSearchParams()` requires a Suspense ancestor in Next.js 16's App Router; wrapping the export pattern matches Story 1.7's `ColorRender`. The fallback can be `null` since the toggle is a small overlay control.

6. **Empty-string handler guard.** Radix `ToggleGroup` with `type="single"` emits `""` (empty string) when the user re-clicks the currently-active item (the Radix default is "deselectable" behavior). Without a guard, the handler would call `setLightingPreset("" as LightingPreset)` and write `?lighting=` to URL — both invalid. The validation in `useTryOnParams()` would catch the URL side (fall back to daylight) but the store would hold an invalid value until the next render. **Guard at the source.**

7. **No `prefers-reduced-motion` JS branch.** There is no transition / animation on the toggle's `data-state` change. The toggle is instant by default. No `motion-reduce:transition-none` variants needed on `LightingToggle`'s own DOM. (If Story 1.10+ adds a cross-fade in `ColorRender`, that's gated at the `ColorRender` site, not here.)

8. **No `aria-live="assertive"`.** Recoverable state changes (lighting preset) use `"polite"`. Only destructive or urgent errors use `"assertive"`. Confirmed from Stories 1.6, 1.7, 1.8 patterns.

9. **No `e2e/keyboard-only.spec.ts` extension here.** ToggleGroup keyboard nav (Arrow Left/Right, Enter/Space) is built into Radix and exercised when LightingToggle is composed into `/try-on` in Story 1.10. Story 1.10 will extend the keyboard-only spec to cover the lighting toggle keypath end-to-end. This story tests the unit behavior; full keyboard journey is Story 1.10.

10. **No `?lighting=daylight` on default.** `useTryOnParams()` already falls back to `daylight` when the param is absent. Do NOT write `?lighting=daylight` to the URL on initial mount — keep the URL clean. URL update happens only on explicit user action.

11. **Copy lives in `src/lib/copy/render.ts`.** Inline string literals in render components are blocked by code review (AC8 of Story 1.7). All labels, ARIA labels, and the live-region template go in `renderCopy.lightingToggle`.

### Vitest test mocking strategy

```typescript
// LightingToggle.test.tsx — module-level mocks
import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

import { LightingToggle } from "./LightingToggle";

const mockSetLightingPreset = vi.fn();
const mockReplace = vi.fn();

// Mutable per-test state — factories read these via closure at render time.
let mockLightingPreset: "indoor" | "daylight" | "salon" = "daylight";
let mockSearchParamsString = "";

// ToggleGroup callback capture — mock stores latest onValueChange so tests
// can invoke it directly without Radix roving-tabindex / pointer events.
const tgCbs: { onValueChange?: (value: string) => void } = {};

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/try-on",
  useSearchParams: () => new URLSearchParams(mockSearchParamsString),
}));

vi.mock("@/lib/url-state/try-on-params", () => ({
  useTryOnParams: () => ({
    colorId: "auburn",
    lightingPreset: mockLightingPreset,
    fadeWeek: 0,
  }),
}));

vi.mock("@/lib/stores/try-on", () => ({
  useTryOnStore: (selector: (s: { setLightingPreset: typeof mockSetLightingPreset }) => unknown) =>
    selector({ setLightingPreset: mockSetLightingPreset }),
}));

vi.mock("@/components/ui/toggle-group", () => ({
  ToggleGroup: ({
    value,
    onValueChange,
    children,
    "aria-label": ariaLabel,
  }: {
    value?: string;
    onValueChange?: (value: string) => void;
    children?: ReactNode;
    "aria-label"?: string;
  }) => {
    tgCbs.onValueChange = onValueChange;
    return (
      <div
        role="radiogroup"
        aria-label={ariaLabel}
        data-testid="lighting-toggle-group"
        data-value={value}
      >
        {children}
      </div>
    );
  },
  ToggleGroupItem: ({
    value,
    children,
    "aria-label": ariaLabel,
  }: {
    value?: string;
    children?: ReactNode;
    "aria-label"?: string;
  }) => (
    <button
      type="button"
      role="radio"
      aria-label={ariaLabel}
      data-testid={`lighting-toggle-item-${value}`}
      onClick={() => tgCbs.onValueChange?.(value ?? "")}
    >
      {children}
    </button>
  ),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockLightingPreset = "daylight";
  mockSearchParamsString = "";
  tgCbs.onValueChange = undefined;
});
```

**Note on the `useTryOnStore` mock** — The component reads via the selector form `useTryOnStore((s) => s.setLightingPreset)`. The mock above calls the selector with a partial state object to return the mocked setter. If the component is later updated to read multiple fields from the store (e.g., `useTryOnStore((s) => ({ setLightingPreset: s.setLightingPreset, lightingPreset: s.lightingPreset }))`), extend the mock state object accordingly.

**`useTryOnStore` mock — alternative (simpler) shape if the component does not use selector form:**

```typescript
vi.mock("@/lib/stores/try-on", () => ({
  useTryOnStore: () => ({ setLightingPreset: mockSetLightingPreset }),
}));
```

Pick the shape that matches the component's actual usage in Task 2. The selector form is recommended in the AGENTS.md §5 communication patterns ("Selectors are direct field access") and reduces re-renders.

### Storybook stories — required variants (AC8)

Use Story 1.8's `withStoreReset` decorator pattern. Each story sets `parameters.nextjs.navigation.searchParams` to seed the URL preset:

```typescript
// Default — daylight active (the truthful default)
export const Default: Story = {
  decorators: [withStoreReset],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/try-on",
        searchParams: new URLSearchParams("lighting=daylight"),
      },
    },
  },
};

// Indoor — warm cast active
export const Indoor: Story = { /* searchParams: lighting=indoor */ };

// Salon — cool / fluorescent cast active (the trust-killer reveal)
export const Salon: Story = { /* searchParams: lighting=salon */ };

// WithSiblingControls — composed with a placeholder FadeSimulator to validate
// visual hierarchy as it will appear on the /try-on route in Story 1.10
export const WithSiblingControls: Story = {
  decorators: [
    withStoreReset,
    (Story) => (
      <div className="flex flex-col gap-4">
        <Story />
        <div className="h-6 w-full bg-(--color-bg-elevated) rounded" />
        {/* Visual stand-in for FadeSimulator; not the real component */}
      </div>
    ),
  ],
  parameters: { /* lighting=daylight */ },
};
```

### Scope boundary — what Story 1.9 does NOT do

- Does NOT implement the `/try-on` route composition (Story 1.10 — wires `<PhotoUploader>` → `<ConsentPrompt>` → `<ColorRender>` with `<FadeSimulator>`, `<LightingToggle>`, `<ShareLook>` as children).
- Does NOT implement `ShareLook` (Story 1.11) — but the URL `?lighting=` written here IS the state Share Look will encode in the share artifact.
- Does NOT add a runtime `(color, lighting) → ColorVector` cache. `applyLightingPreset()` is cheap; the calibration table is constant. Premature optimization risks state-tier confusion.
- Does NOT add a smoke harness page — `LightingToggle` is a sub-component; integration testing happens via Story 1.10's route composition.
- Does NOT extend `e2e/keyboard-only.spec.ts` — Radix `ToggleGroup` keyboard nav is built-in and exercised when the component is composed into `/try-on` in Story 1.10.
- Does NOT cross-fade between renders during preset change — `ColorRender` re-composites instantly. If a polish pass adds a cross-fade later, it goes in `ColorRender`, not here.
- Does NOT modify `src/lib/ar/lighting-postprocess.ts`, `src/lib/stores/try-on.ts`, `src/lib/url-state/try-on-params.ts`, or `src/components/render/ColorRender.tsx`. All four are read-only context for this story; the contracts they exposed in Stories 1.5 and 1.7 are sufficient.

### Previous story learnings — MUST apply

From Story 1.7 (ColorRender) and Story 1.8 (FadeSimulator) debug logs:

1. **`@testing-library/user-event` is NOT installed** — use `fireEvent` from `@testing-library/react` throughout. Do NOT add `userEvent` calls.
2. **`storybook/test` vs `@storybook/test`** — neither is needed for this story since the a11y addon runs axe-core automatically. Story 1.7 found `@storybook/test` not present; Story 1.8 worked without importing either. Follow Story 1.8's pattern: zero imports from those packages.
3. **ESLint `react-hooks/refs`** — never mutate refs in the render body. All ref reads/writes go in effects, callbacks, or event handlers.
4. **`aria-live="polite"` not `"assertive"`** for recoverable state changes (lighting toggle is recoverable).
5. **Storybook store-reset decorator** — wrap every story in a decorator that calls `useTryOnStore.setState({ ...INITIAL_STATE })` to prevent state leakage between stories. Include `selectedColorId`, `lightingPreset`, `fadeWeek`, `washesPerWeek`.
6. **No `__tests__/` directory** — tests are siblings of their component file (AR13, AGENTS.md §1 cross-cutting concern #8).
7. **No `index.ts` barrel** in `src/components/render/` — import the explicit file (AGENTS.md §3).
8. **`useSearchParams()` needs a Suspense ancestor** — wrap the export in `<Suspense fallback={null}>` like `ColorRender` does. Otherwise SSG bail-out or Next.js dev-mode warning.
9. **CI gate order**: `pnpm typecheck` → `pnpm lint` → `pnpm vitest run --coverage` → `pnpm storybook build` → `pnpm check:stories` → `pnpm build` + `pnpm size-limit`. Earlier gates short-circuit later ones on failure.
10. **`toHaveValue(number)` returns string for `type="range"`** — irrelevant here (no range inputs), but Story 1.8's debug log notes this for `@testing-library/jest-dom` v6. For toggle group `data-value` attribute reads, use string comparison directly.

### Latest technical information

- **Next.js 16 App Router** — `useRouter()` from `next/navigation` (NOT `next/router` which is the Pages Router). `router.replace(url, { scroll: false })` is the right call (avoids the scroll-to-top default behavior, which would jar the render surface mid-toggle).
- **Radix UI `react-toggle-group` (`radix-ui` v1+)** — `ToggleGroup` with `type="single"` is the canonical three-state mutually-exclusive selector. Built-in: roving tabindex, Arrow Left/Right keyboard nav, Enter/Space activation, ARIA `role="radiogroup"` automatically applied. Emits `""` on de-selection by default; can be disabled via `disableDeselection` if Radix exposes that prop (check the installed version — it varies). The empty-string guard in our handler is defensive even if `disableDeselection` is set, since older versions did not have that prop. **Do NOT add a Radix version bump as part of this story** — work with what Story 1.3 installed.
- **Storybook 9 / `@storybook/nextjs-vite`** — `parameters.nextjs.navigation.searchParams` is read by the Next.js Storybook adapter to mock `useSearchParams()` per story. Same shape as Story 1.8 uses.

### Project context reference

- **Architecture binding doc:** `_bmad-output/planning-artifacts/architecture.md` §3 ("AR Pipeline — Segmentation + Compositing" — stage 5, lighting post-process), §4 ("State Management — Ownership Boundaries" — URL state for shareable / back-nav-able state), §5 (Naming, Structure, Format, Communication, Process patterns), §6 (Provider Inventory).
- **PRD binding doc:** `_bmad-output/planning-artifacts/prd.md` — FR4 (multi-lighting toggle), NFR3 (<100ms toggle response).
- **UX binding doc:** `_bmad-output/planning-artifacts/ux-design-specification.md` lines 60, 74, 111, 122, 174, 425, 460, 470, 474, 482, 491, 525-529, 552-557, 1156-1160, 1550, 1605 (lighting toggle, three calibrated presets, daylight default, contrast undeniable in 2 seconds).
- **Agent rulebook:** `sb-tryon/AGENTS.md` — 10 cross-cutting concerns, naming patterns, ESLint rules, CI gates. Especially: cross-cutting #4 (state tier ownership), #8 (test colocation), #9 (Storybook colocation).
- **Predecessor stories:**
  - `_bmad-output/implementation-artifacts/1-5-implement-mediapipe-tasks-vision-mockarprovider-segmentation-pipeline.md` — landed `lighting-postprocess.ts` math + `LIGHTING_CALIBRATION` table.
  - `_bmad-output/implementation-artifacts/1-7-build-colorrender-component-texture-preserving-webgl2.md` — landed `ColorRender` with Effect 2 reading `lightingPreset` from URL.
  - `_bmad-output/implementation-artifacts/1-8-build-fadesimulator-90-day-fade-timeline.md` — canonical pattern for client-component overlay control with URL + store dual-write.
- **Successor stories blocked by this one:**
  - Story 1.10 (`/try-on` route composition) — composes LightingToggle as a child overlay.
  - Story 1.11 (ShareLook) — the share artifact will encode the current `?lighting=` so the share link reproduces the exact render.

### Open questions (none blocking)

- **Q1:** Should `LightingToggle` also expose a tap-and-hold side-by-side comparison gesture (UX spec line 111 / 529: *"Tap-and-hold for previous-vs-current"*)? UX spec marks this as *"design exploration; consider for V1.5 if it complicates the demo."* Answer: NOT in Story 1.9. Tracked as a Story 1.10+ polish if the exec demo dry-run shows demand.

### Deferred items to check

- No new deferred items expected; all dependencies (lighting math, store, URL parser, ToggleGroup primitive) are already complete and tested.
- Cross-reference D-D1, D-D2 in `_bmad-output/implementation-artifacts/deferred-work.md` — Slider / Select deferred items, neither apply to ToggleGroup.

## Dev Agent Record

### Agent Model Used

_To be filled by the dev agent on implementation start._

### Debug Log References

_To be filled by the dev agent._

### Completion Notes List

_To be filled by the dev agent._

### File List

**Expected new files:**
- `sb-tryon/src/components/render/LightingToggle.tsx`
- `sb-tryon/src/components/render/LightingToggle.test.tsx`
- `sb-tryon/src/components/render/LightingToggle.stories.tsx`

**Expected modified files:**
- `sb-tryon/src/lib/copy/render.ts` — add `lightingToggle` copy object
- `_bmad-output/implementation-artifacts/1-9-build-lightingtoggle-3-calibrated-presets.md` — story status, tasks, record
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — story status → review (on dev-story completion)

## Change Log

- 2026-05-14: Story 1.9 created — comprehensive context for LightingToggle (Indoor / Daylight / Salon ToggleGroup with ≤100ms response budget, URL state, store mirror, live-region announcement). Status: ready-for-dev.
