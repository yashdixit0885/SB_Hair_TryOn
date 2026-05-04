# Story 1.2: Define 9 Provider Contracts + Factory + ProvidersContext + ESLint Enforcement

**Status:** done

## Story

As a developer wiring future feature stories,
I want the 10 provider interfaces defined, the env-var-driven factory, the `<ProvidersContext>` provider, and the `useProvider()` hook in place — plus the ESLint rule that blocks vendor SDK imports outside provider implementations,
so that every subsequent story binds to provider abstractions and the demo→production swap stays a config change (NFR25, NFR26, NFR35-37, AR2-4).

> **Note on naming:** The epic title says "9 provider contracts" because the architecture originally enumerated 9 named interfaces. `EditorialProvider` was added as the 10th and is explicitly called out in the AC. Implement all 10.

## Acceptance Criteria

**AC1 — 10 contract files in `src/lib/providers/contracts/`**

Given the interfaces named in `architecture.md` §4 (`ARProvider`, `ReviewProvider`, `AuthProvider`, `AttributionProvider`, `NotificationProvider`, `BookingHandoffProvider`, `SalonProvider`, `BSGProvider`, `CalendarProvider`, `EditorialProvider`),  
When the developer creates `src/lib/providers/contracts/{ar-provider.ts, review-provider.ts, auth-provider.ts, attribution-provider.ts, notification-provider.ts, booking-handoff-provider.ts, salon-provider.ts, bsg-provider.ts, calendar-provider.ts, editorial-provider.ts}`,  
Then each file exports a TypeScript `interface` with method signatures specified by their consumer epics (see **Dev Notes → Interface Inventory** for exact signatures), every method is `async` (returns `Promise<T>`), and **no concrete vendor type is imported** in any contract file.

**AC2 — `factory.ts` with env-var-driven `createProviders()`**

Given the factory mechanism in `architecture.md` §4 ("Provider DI Mechanism"),  
When the developer creates `src/lib/providers/factory.ts`,  
Then it exports `createProviders()` that reads `NEXT_PUBLIC_PROVIDER_MODE` (`"mock"` | `"production"`) plus per-provider override env vars (e.g. `NEXT_PUBLIC_AR_PROVIDER`) and returns `{ ar, reviews, auth, attribution, notification, bookingHandoff, salon, bsg, calendar, editorial }` typed against the contract interfaces.

And it exports `createMockProviders()` — same shape, always returns stub mock instances regardless of env vars (used by test fixtures and Story 1.3's Storybook `preview.ts` decorator).

> **Demo V1 note:** In the current implementation all `make*()` helpers ignore the resolved mode and return a Mock instance regardless of `NEXT_PUBLIC_PROVIDER_MODE`. This is intentional for Demo V1 — no production provider classes exist yet (post-funding work). The env-var resolution machinery is wired and correct; production wiring is a localized edit to each `make*()` helper when the corresponding vendor implementation ships. A misconfigured production env will silently serve mock data rather than crashing boot. This behaviour is tested and asserted in AC6.

**AC3 — `context.tsx` with `<ProvidersContext>` + strictly-typed `useProvider()` hook**

Given the hybrid factory + React Context decision in `architecture.md` §4,  
When the developer creates `src/lib/providers/context.tsx`,  
Then it exports `<ProvidersContext>` (a React Context holding the `Providers` type) and `useProvider(name)` typed strictly so `useProvider("ar")` returns `ARProvider`, `useProvider("reviews")` returns `ReviewProvider`, etc. — **zero `any` casts anywhere in the hook implementation or its return types**.

**AC4 — `index.ts` public re-export + `layout.tsx` wired up**

Given `src/lib/providers/index.ts` re-exports,  
When the developer authors the file,  
Then it re-exports all 10 contract types, `createProviders`, `createMockProviders`, and `useProvider` so that feature code has a single import path: `import { useProvider } from "@/lib/providers"` and `import type { ARProvider } from "@/lib/providers"`.

And `src/app/layout.tsx` wraps `{children}` in `<ProvidersContext.Provider value={createProviders()}>`. The `QueryClientProvider` from `@tanstack/react-query` is also added here (it is installed and required by Story 1.3+ feature components; wire it in this story since both are foundational root-level providers).

**AC5 — ESLint `no-restricted-imports` rule blocks vendor SDK imports in feature code**

Given AR4 in `architecture.md`,  
When the developer adds the rule to `eslint.config.mjs`,  
Then any file under `src/components/**`, `src/app/**`, or `src/lib/` that is NOT under `src/lib/providers/{mock,production}/` or `src/lib/providers/factory.ts` and imports from `@mediapipe/*`, `twilio`, `@sendgrid/*`, `@supabase/*`, or any other listed vendor package fails lint with the message from the architecture.

And the companion rule blocks importing directly from implementation subfolders (`@/lib/providers/mock/*` or `@/lib/providers/production/*`) everywhere except `factory.ts` — callers must import from `@/lib/providers` (the public barrel).

And TypeScript strictness rules `@typescript-eslint/no-explicit-any` and `@typescript-eslint/no-non-null-assertion` are set to `"error"` for all `src/**` files.

**AC6 — Vitest contract test in `src/lib/providers/contracts/index.test.ts`**

Given the contract test requirement,  
When the developer authors `src/lib/providers/contracts/index.test.ts`,  
Then it:
- Verifies that `createProviders()` and `createMockProviders()` both return objects with all 10 required keys (`ar`, `reviews`, `auth`, `attribution`, `notification`, `bookingHandoff`, `salon`, `bsg`, `calendar`, `editorial`)
- Verifies that each returned object has the required method signatures (using `typeof` / existence checks)
- Verifies that calling a method on the stub mock (e.g. `providers.ar.prewarm()`) rejects with a `ProviderError` whose `code` is `"NOT_IMPLEMENTED"` (validates that story-1.2 stubs are properly wired, not silently returning `undefined`)
- Confirms test passes with `pnpm test:unit`

## Tasks / Subtasks

- [x] **Task 1: Create `ProviderError` shared error class** (AC1, AC6)
  - [x] Create `src/lib/providers/errors.ts` exporting `ProviderError extends Error` with `code: string`, `userMessage: string`, `cause?: unknown` (matches architecture §5 pattern example exactly)
  - [x] Create companion test `src/lib/providers/errors.test.ts` (trivial; confirms class is constructable and `instanceof Error`)

- [x] **Task 2: Create 10 contract interface files** (AC1)
  - [x] `src/lib/providers/contracts/ar-provider.ts` — `ARProvider` interface with `prewarm()`, `segment(image: ImageBitmap): Promise<SegmentationResult>`, `dispose()`; export `SegmentationResult` type
  - [x] `src/lib/providers/contracts/review-provider.ts` — `ReviewProvider` with `list`, `get`, `submit`, `reply`, `getRanking`; full type set exported
  - [x] `src/lib/providers/contracts/auth-provider.ts` — `AuthProvider` + `AuthUser` discriminated union + `UserRole` literal union
  - [x] `src/lib/providers/contracts/attribution-provider.ts` — `AttributionProvider` + token payload + verify result + partner / stylist / color-choice aggregates
  - [x] `src/lib/providers/contracts/notification-provider.ts` — `NotificationProvider` + `NotificationChannel` literal union + payloads
  - [x] `src/lib/providers/contracts/booking-handoff-provider.ts` — `BookingHandoffProvider` + payload type
  - [x] `src/lib/providers/contracts/salon-provider.ts` — `SalonProvider` + `Salon`, `Stylist`, `Certification`, `SalonSearchFilters`
  - [x] `src/lib/providers/contracts/bsg-provider.ts` — `BSGProvider` + `BSGProduct`, `BSGReorderSuggestion`
  - [x] `src/lib/providers/contracts/calendar-provider.ts` — `CalendarProvider` + invite payload + invite return shape
  - [x] `src/lib/providers/contracts/editorial-provider.ts` — `EditorialProvider` (read + write) + 8 supporting types
  - [x] Verified NO vendor imports in contract files (`grep import.*from src/lib/providers/contracts/` returns empty)

- [x] **Task 3: Create placeholder stub mock implementations** (AC2, AC6)
  - [x] Created `src/lib/providers/mock/` directory with 10 stub class files. Each implements its contract; every method awaits a 50-200ms `sleep()` then throws `ProviderError("NOT_IMPLEMENTED", "Mock{X}.{method} is not yet implemented. See Story {N}.{M}.")`. Stubs use `_`-prefixed args to satisfy the no-unused-vars rule while keeping the contract argument shape visible.
  - [x] Created `src/lib/providers/production/` with a `README.md` documenting the naming convention (`{Vendor}{Interface}.ts`), the four implementation rules, and the link to the architecture's mock→production mapping.
  - [x] Realistic latency in all 10 stubs (`50 + Math.random() * 150` ms) — architecture §5 "Mock providers introduce realistic latency".

- [x] **Task 4: Create `factory.ts`** (AC2)
  - [x] Exported `createProviders()` — reads `NEXT_PUBLIC_PROVIDER_MODE` (default `"mock"`) and per-slot override env vars (`NEXT_PUBLIC_AR_PROVIDER`, etc.); returns `Providers` object via per-slot `make*()` constructors. Production branch is stubbed-but-falls-through-to-mock for Demo V1 so a misconfigured env doesn't crash boot; the production branch becomes `case "production": return new {Vendor}{Interface}()` post-funding.
  - [x] Exported `createMockProviders()` — env-var-independent; always returns mock instances. Story 1.3's Storybook decorator and the Vitest contract test both use this.
  - [x] Exported `Providers` type with all 10 keys typed against the contract interfaces.
  - [x] Used explicit object literal (not loop) so TypeScript narrows each property correctly without `any` casts.

- [x] **Task 5: Create `context.tsx` with `<ProvidersContext>` and `useProvider()` hook** (AC3)
  - [x] Added `"use client"` directive.
  - [x] `ProvidersContext = createContext<Providers | null>(null)` — null default forces explicit provider wrapping.
  - [x] `ProvidersContext.Provider` re-exported via the barrel (Story 1.3's Storybook decorator imports `ProvidersContext` from `@/lib/providers`).
  - [x] `useProvider` exported with **10 function overloads** (one per slot) plus a generic implementation `<K extends keyof Providers>(name: K): Providers[K]`. Zero `any` in types or implementation — `eslint --fix` confirmed.
  - [x] Throws `Error("useProvider must be used within <ProvidersContext.Provider>...")` when used outside the boundary; covered by `context.test.tsx`.

- [x] **Task 6: Create `src/lib/providers/index.ts` public barrel** (AC4)
  - [x] All 10 contract interfaces re-exported as types.
  - [x] All supporting types re-exported (SegmentationResult, AuthUser, UserRole, OutcomeDimensions, SourceClass, ReviewVisibility, DateRange, all attribution shapes, all notification shapes, all salon shapes, all editorial shapes, calendar shapes, BSG shapes, etc.).
  - [x] `ProviderError` re-exported from `./errors`.
  - [x] `Providers`, `createProviders`, `createMockProviders` re-exported from `./factory`.
  - [x] `useProvider`, `ProvidersContext` re-exported from `./context`.
  - [x] No `"use client"` on the barrel — Server Components import `createProviders`; Client Components import `useProvider` (the directive lives on `context.tsx`).

- [x] **Task 7: Update `src/app/layout.tsx`** (AC4)
  - [x] Created `src/components/root-providers.tsx` (`"use client"`) containing both `ProvidersContext.Provider` and `QueryClientProvider`. **Important deviation from the dev guide:** providers are constructed *inside* `RootProviders` via `useState(() => createProviders())`, not in `layout.tsx`. Reason: Next.js RSC serialization rejects class instances crossing the Server→Client boundary as props, so the original "create on server, pass to client" pattern fails the production build. Server Components that need providers call `createProviders()` directly from `@/lib/providers` (architecture §4 explicitly supports this).
  - [x] `RootProviders` instantiates `QueryClient` via `useState(() => new QueryClient(...))` per TanStack Query's Next App Router guidance (stable per-mount).
  - [x] `layout.tsx` now wraps `{children}` in `<RootProviders>` and remains a Server Component (metadata, fonts, caching semantics preserved).
  - [x] Metadata title updated to "Sally Beauty Hair Color Try-On" with a one-line description.

- [x] **Task 8: Update `eslint.config.mjs`** (AC5)
  - [x] Added the vendor-import restriction config object with the four pattern groups from architecture §5: `@mediapipe/*`, `twilio` + `@sendgrid/*`, `@supabase/*`, and `@/lib/providers/{mock,production}/*`. `ignores` excludes `src/lib/providers/{mock,production}/**` and `src/lib/providers/factory.ts` so implementation files can still import their vendor SDKs.
  - [x] Added the TypeScript strictness config object: `no-explicit-any: error`, `no-non-null-assertion: error`, plus a `no-unused-vars` config that allows `_`-prefixed args/vars (standard convention; needed because the contract method args in stub providers are part of the interface contract even when stubs don't read them).
  - [x] **Bonus fix:** `pnpm lint` was actually broken from Story 1.1 — the script was `next lint` but Next.js 16.2 removed that subcommand entirely, so the gate was silently failing in CI ("Invalid project directory provided, no such directory: …/lint"). Fixed by changing `package.json` lint script to `eslint .` and adding `coverage/`, `storybook-static/`, `test-results/`, `playwright-report/`, `.lighthouseci/`, `*.tsbuildinfo` to `globalIgnores` so ESLint stops trying to lint build artifacts. This is a Story-1.1 carry-over defect — flagged in the Change Log below for retrospective awareness.
  - [x] Verified `pnpm lint` is green (exit 0, zero violations).
  - [x] Verified the new rule fires correctly with a synthetic violation file (caught both `@mediapipe/tasks-vision` import and direct `@/lib/providers/mock/*` import — 2 errors as expected).

- [x] **Task 9: Update `.env.example`** (AC2, AC5)
  - [x] Already populated correctly during Story 1.1 (foresight): `NEXT_PUBLIC_PROVIDER_MODE=mock` plus all 10 commented per-provider override lines. Verified contents match what AC2 requires; no edit needed.

- [x] **Task 10: Author `src/lib/providers/contracts/index.test.ts`** (AC6)
  - [x] Imports `ProviderError`, `createProviders`, `createMockProviders`, `Providers` from `@/lib/providers`.
  - [x] Asserts both factories return objects with all 10 required keys, each non-null and with the expected method shape (per a `METHOD_SHAPE` map covering all 47 contract methods).
  - [x] Exercises **every contract method on every stub** via an `INVOKE` map of plausible no-op argument bundles, asserting each `rejects.toBeInstanceOf(ProviderError)` and `code === "NOT_IMPLEMENTED"`. This dual-purpose: (a) catches stubs that silently return `undefined` instead of throwing; (b) forces downstream stories that replace stubs to update or remove the corresponding assertions.
  - [x] Asserts `createMockProviders()` is env-var-independent (test sets `NEXT_PUBLIC_PROVIDER_MODE=production` and expects mock instances back).
  - [x] Asserts `createProviders()` per-slot override branches: garbage value falls through to global, `NEXT_PUBLIC_AR_PROVIDER=mock` and `=production` both work without crashing, `NEXT_PUBLIC_PROVIDER_MODE=production` falls through to mock for Demo V1.
  - [x] Added `src/lib/providers/context.test.tsx` to cover `useProvider` hook (renders a probe inside `<ProvidersContext.Provider>` and asserts the hook returns the expected provider; also asserts the "used outside provider" error path).
  - [x] `pnpm test:unit` green: **60 tests pass / 100% statement / 100% branch / 100% function / 100% line coverage** on `src/lib/**`.

- [x] **Task 11: Smoke-test the full gate chain**
  - [x] `pnpm typecheck` — exit 0, zero errors.
  - [x] `pnpm lint` — exit 0, zero violations. (Required the Task 8 bonus fix to even run; was silently broken before.)
  - [x] `pnpm test:unit` — 60/60 passing, 100% coverage on `src/lib/**` (NFR39 ≥70% threshold passes comfortably).
  - [x] `pnpm build` — production build compiles successfully (4 pages prerendered including `/_not-found`). Required the Task 7 RSC fix (constructing providers inside the client component) to pass.
  - [x] `pnpm size-limit` — 204.07 KB / 300 KB gzipped (NFR8 budget), up from 194 KB in Story 1.1. The +10 KB is `@tanstack/react-query`'s runtime, which is now wired into `RootProviders`. Still well under budget.
  - [x] `pnpm dev` skipped — covered by the Playwright e2e suite which auto-starts `pnpm dev` and hits the root route. Build success is the stronger smoke-test signal.

### Review Findings

#### Decision-Needed

- [x] [Review][Decision] **Production branch is dead code — all `make*()` ignore `_mode`** — Resolved: AC2 amended with explicit Demo V1 carve-out note. No code change. Production wiring is a localized edit to each `make*()` when the vendor implementation ships (post-funding).
- [x] [Review][Decision] **Barrel (`index.ts`) re-exports `"use client"` symbols without a `"use client"` directive** — Resolved: leave as-is. Next.js 16 handles the bundler boundary at the consuming file correctly. No action taken.
- [x] [Review][Decision] **`layout.tsx` deviates from AC4 canonical text — `<RootProviders>` vs `<ProvidersContext.Provider value={createProviders()}>` on the server** — Resolved: leave as-is. Dev notes document the RSC serialization constraint; epics.md amendment deferred as low priority.

#### Patch

- [x] [Review][Patch] **`root-providers.tsx` missing `.stories.tsx`** — Created `src/components/root-providers.stories.tsx` [`sb-tryon/src/components/root-providers.tsx`]
- [x] [Review][Patch] **`root-providers.tsx` missing `.test.tsx`** — Created `src/components/root-providers.test.tsx` with 3 tests [`sb-tryon/src/components/root-providers.tsx`]
- [x] [Review][Patch] **`no-restricted-syntax` rule for raw `<input type="file">` missing** — Added to `eslint.config.mjs` (JSX selector) [`sb-tryon/eslint.config.mjs`]
- [x] [Review][Patch] **`eslint .` drops `@next/next/*` plugin rules** — DISMISSED: `eslint.config.mjs` already imports `nextVitals` and `nextTs` from `eslint-config-next`; rules are present.
- [x] [Review][Patch] **Mock stubs sleep 50-200ms in tests — no `NODE_ENV=test` bypass** — Added `if (process.env.NODE_ENV === "test") return Promise.resolve()` with `/* c8 ignore next 2 */` to all 10 mock `sleep()` functions [`sb-tryon/src/lib/providers/mock/Mock*.ts`]
- [x] [Review][Patch] **`resolveGlobalMode` silently falls back on env var typos — no warning** — Added `console.warn` for unrecognized non-empty values; test added to `index.test.ts` [`sb-tryon/src/lib/providers/factory.ts`]
- [x] [Review][Patch] **`context.tsx` imports `Providers` from `./factory` directly** — DISMISSED: would create a circular import (`index.ts` → `context.tsx` → `index.ts`). Intra-library direct import is correct here.
- [x] [Review][Patch] **`no-restricted-imports` exempts `mock/**` from `@supabase/*` ban incorrectly** — Restructured into two separate rule objects: Part A (`@mediapipe/*`, `twilio/@sendgrid/*`) exempts `mock/**` + `production/**`; Part B (`@supabase/*`, barrel enforcement) exempts `production/**` only [`sb-tryon/eslint.config.mjs`]
- [x] [Review][Patch] **`void _x` + missing `await` in mock stub methods** — Removed all `void _x` lines (redundant with `_`-prefix); added `await` to all `return this.notImplemented(...)` calls across all 10 mocks [`sb-tryon/src/lib/providers/mock/Mock*.ts`]

#### Deferred

- [x] [Review][Defer] **`ProviderError` missing `Object.setPrototypeOf` — `instanceof` breaks below ES2015 target** [`sb-tryon/src/lib/providers/errors.ts`] — deferred, pre-existing; current tsconfig target is ES2015+, not a live risk
- [x] [Review][Defer] **`factory.ts` statically imports all 10 Mock classes — inflates server bundle** [`sb-tryon/src/lib/providers/factory.ts`] — deferred, pre-existing; acceptable for Demo V1, revisit before Production V1

## Dev Notes

### What Story 1.1 Delivered (Do Not Reinvent)

Story 1.1 is `done`. The `sb-tryon/` directory already exists with:
- Next.js 16.2.4 + React 19.2.4 + TypeScript 5.9.3 (strict mode)
- Tailwind v4 + shadcn/radix
- Vitest 4.1.5 + Playwright 1.59 + axe-core + Storybook 10.3.6
- pnpm 10.33.2 workspace; all scripts in `package.json` are wired
- `eslint.config.mjs` exists with Storybook flat config (no provider rules yet)
- `src/app/layout.tsx` exists with Geist font setup (no providers yet)
- `.env.example` exists (no PROVIDER_MODE yet)
- `src/lib/utils.ts` + `utils.test.ts` — do not touch
- CI gates all green

**All work for Story 1.2 happens inside `sb-tryon/`.** The `_bmad-output/` directory is documentation-only.

### Provider Interface Inventory (Complete Signatures)

These are the method signatures every contract file must export. Types referenced by interfaces should be co-defined in the same contract file (no cross-imports between contract files). Keep types minimal and explicit — no `Record<string, unknown>` catch-alls.

#### `ARProvider` (`ar-provider.ts`)
```typescript
export interface SegmentationResult {
  alphaMask: Uint8ClampedArray; // category-1 hair mask, same dims as input
  confidence: number;            // 0-1; below threshold → DemoFallbackPath
  width: number;
  height: number;
}

export interface ARProvider {
  prewarm(): Promise<void>;
  segment(image: ImageBitmap): Promise<SegmentationResult>;
  dispose(): Promise<void>;
}
```
> Story 1.5 implements `MockARProvider` using MediaPipe Tasks Vision. This story only defines the contract.

#### `ReviewProvider` (`review-provider.ts`)
```typescript
export type SourceClass = "native" | "aggregated" | "editorial" | "salon-attested";
export type ReviewVisibility = "public" | "operator"; // operator unlocks private outcome dimensions (FR16/Story 3.6)

export interface ReviewFilters {
  colorSlug?: string;
  brandId?: string;
  salonId?: string;
  stylistId?: string;
  sourceClass?: SourceClass;
  textureType?: string;
  visibility?: ReviewVisibility;
  dimension?: "color-outcome"; // FR16: public ranking shows color-outcome only
}

export interface OutcomeDimensions {
  fadeWeeks?: number;
  colorAccuracy?: number; // 1-5
  damage?: number;        // 1-5
  recommend?: boolean;
}

export interface Review {
  id: string;
  colorSlug: string;
  brandId: string;
  sourceClass: SourceClass;
  authorName?: string;
  body: string;
  outcomeDimensions: OutcomeDimensions;
  createdAt: string; // ISO-8601
  hasReply?: boolean;
}

export interface ReviewSubmitPayload {
  colorSlug: string;
  brandId: string;
  body: string;
  outcomeDimensions: OutcomeDimensions;
  onBehalfOfUserId?: string; // Stylist-assisted submission (Story 5.4)
}

export interface ReviewRanking {
  colorSlug: string;
  brands: Array<{ brandId: string; score: number }>;
}

export interface ReviewProvider {
  list(filters: ReviewFilters): Promise<Review[]>;
  get(reviewId: string): Promise<Review>;
  submit(payload: ReviewSubmitPayload): Promise<Review>;
  reply(reviewId: string, body: string): Promise<void>;
  getRanking(colorSlug: string): Promise<ReviewRanking>;
}
```

#### `AuthProvider` (`auth-provider.ts`)
```typescript
export type UserRole = "Consumer" | "Stylist" | "SalonPartner" | "EditorialCurator" | "Guest";

export type AuthUser =
  | { role: "Guest" }
  | {
      userId: string;
      role: Exclude<UserRole, "Guest">;
      displayName: string;
      sallyRewardsId?: string;
      partnerId?: string; // set for SalonPartner role
    };

export interface AuthProvider {
  getCurrentUser(): Promise<AuthUser>;
  login(): Promise<void>;
  logout(): Promise<void>;
  requireRole(role: Exclude<UserRole, "Guest">): Promise<void>; // throws ProviderError "UNAUTHORIZED" or "FORBIDDEN"
}
```

#### `AttributionProvider` (`attribution-provider.ts`)
```typescript
export interface DateRange {
  from: string; // ISO-8601 date
  to: string;
}

export interface AttributionTokenPayload {
  lookId: string;
  colorSlug: string;
  lighting: string;
  brandId: string;
  salonId: string;
  attributionNonce: string; // UUID; unique per issuance for idempotency (NFR33)
  issuedAt: number; // Unix ms
}

export type TokenVerifyResult =
  | { valid: true; payload: AttributionTokenPayload }
  | { valid: false; reason: "tampered" | "expired" | "malformed" };

export interface PartnerAttribution {
  totalAttributedBookings: number;
  target: number;
  byColor: Array<{ colorSlug: string; count: number }>;
  byStylist: Array<{ stylistId: string; count: number }>;
  byWeek: Array<{ week: string; count: number }>;
  conversionRate: number;
  attributedRevenue: number;
}

export interface StylistAttribution {
  stylistId: string;
  textureType: string;
  colorOutcomeAvg: number;
  attributedBookingCount: number;
  fadeWeeksAvg: number;
}

export interface ColorChoiceAnalytics {
  byColor: Array<{ colorSlug: string; brandId: string; count: number; timeRange: DateRange }>;
}

export interface AttributionProvider {
  issueToken(payload: Omit<AttributionTokenPayload, "attributionNonce" | "issuedAt">): Promise<string>; // returns signed token string
  verifyToken(token: string): Promise<TokenVerifyResult>;
  getAttributionForPartner(partnerId: string, range: DateRange): Promise<PartnerAttribution>;
  getAttributedBookingsForStylist(stylistId: string, range: DateRange): Promise<StylistAttribution[]>;
  getColorChoiceAnalytics(partnerId: string, range: DateRange): Promise<ColorChoiceAnalytics>;
}
```

#### `NotificationProvider` (`notification-provider.ts`)
```typescript
export type NotificationChannel = "sms-24h" | "email-7d" | "in-app-banner";

export interface ScheduleNotificationPayload {
  type: "post-booking";
  bookingId: string;
  channels: NotificationChannel[];
}

export interface NotificationPayload {
  recipientId: string;
  templateId: string;
  data: Record<string, string>; // template variables
}

export interface NotificationProvider {
  schedule(payload: ScheduleNotificationPayload): Promise<void>;
  send(channel: NotificationChannel, payload: NotificationPayload): Promise<void>;
}
```

#### `BookingHandoffProvider` (`booking-handoff-provider.ts`)
```typescript
export interface BookingHandoffPayload {
  salonId: string;
  lookId: string;
  token: string; // signed attribution token from AttributionProvider.issueToken()
}

export interface BookingHandoffProvider {
  handoff(payload: BookingHandoffPayload): Promise<{ deepLinkUrl: string }>;
}
```

#### `SalonProvider` (`salon-provider.ts`)
```typescript
export interface SalonSearchFilters {
  zip?: string;
  radius?: number; // miles
  colorSlug?: string;
  textureSpecialty?: string;
}

export interface Certification {
  type: string;
  issuedBy: string;
  earnedAt: string; // ISO-8601
}

export interface Stylist {
  stylistId: string;
  displayName: string;
  certifications: Certification[];
  textureSpecialties: string[];
}

export interface Salon {
  salonId: string;
  salonSlug: string;
  displayName: string;
  city: string;
  state: string;
  zip: string;
  certifications: Certification[];
  colorAccuracyRating: number; // 0-5
  textureSpecialties: string[];
}

export interface SalonProvider {
  search(filters: SalonSearchFilters): Promise<Salon[]>;
  getSalonBySlug(salonSlug: string): Promise<Salon>;
  getStylists(salonSlug: string): Promise<Stylist[]>;
  getCertifications(salonSlug: string): Promise<Certification[]>;
}
```

#### `BSGProvider` (`bsg-provider.ts`)
```typescript
export interface BSGProduct {
  productId: string;
  name: string;
  sku: string;
  brandId: string;
}

export interface BSGReorderSuggestion {
  product: BSGProduct;
  suggestedQuantity: number;
  reason: string;
}

export interface BSGProvider {
  suggestReorder(salonId: string): Promise<BSGReorderSuggestion[]>;
  getProductInfo(productId: string): Promise<BSGProduct>;
}
```

#### `CalendarProvider` (`calendar-provider.ts`)
```typescript
export interface CalendarInvitePayload {
  title: string;
  startAt: string; // ISO-8601
  durationMinutes: number;
  location?: string;
  description?: string;
  attendeeEmail?: string;
}

export interface CalendarInvite {
  inviteUrl: string;
  calendarFormat: "ical" | "google" | "outlook";
}

export interface CalendarProvider {
  createInvite(payload: CalendarInvitePayload): Promise<CalendarInvite>;
}
```

#### `EditorialProvider` (`editorial-provider.ts`)
```typescript
export interface ColorTaxonomy {
  slug: string;
  displayName: string;
  family: string;
  undertone: string;
  isSpecialtyTier: boolean;
  isActive: boolean;
}

export interface Brand {
  brandId: string;
  displayName: string;
  slug: string;
}

export interface BrandColorMapping {
  id: string;
  brandId: string;
  colorSlug: string;
  skuCode: string;
}

export interface AuditLogEntry {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  performedBy: string;
  performedAt: string; // ISO-8601
  before?: unknown;
  after?: unknown;
}

export interface ClassificationFilters {
  status?: "pending" | "accepted" | "rejected";
  sourceClass?: string;
}

export interface ClassificationItem {
  reviewId: string;
  body: string;
  proposedClass: string;
  status: "pending" | "accepted" | "rejected";
}

export interface ClassificationQuality {
  falsePositiveRate: number;
  sampleSize: number;
  calculatedAt: string; // ISO-8601
}

export type CreateColorPayload = Omit<ColorTaxonomy, "isActive"> & { isActive?: boolean };
export type CreateBrandColorMappingPayload = Omit<BrandColorMapping, "id">;

export interface EditorialProvider {
  // Read
  getColorTaxonomy(): Promise<ColorTaxonomy[]>;
  getColorBySlug(slug: string): Promise<ColorTaxonomy>;
  getBrands(): Promise<Brand[]>;
  getBrandColorMappings(): Promise<BrandColorMapping[]>;
  getSpecialtyTierFlag(colorSlug: string): Promise<boolean>;
  getAuditLog(entityType: string, entityId: string): Promise<AuditLogEntry[]>;
  getClassificationQueue(filters: ClassificationFilters): Promise<ClassificationItem[]>;
  getClassificationQuality(): Promise<ClassificationQuality>;
  // Write
  createColor(payload: CreateColorPayload): Promise<ColorTaxonomy>;
  updateColor(slug: string, patch: Partial<ColorTaxonomy>): Promise<ColorTaxonomy>;
  deactivateColor(slug: string, reason: string): Promise<void>;
  setSpecialtyTier(slug: string, isSpecialty: boolean): Promise<void>;
  createBrandColorMapping(payload: CreateBrandColorMappingPayload): Promise<BrandColorMapping>;
  updateBrandColorMapping(id: string, patch: Partial<BrandColorMapping>): Promise<BrandColorMapping>;
  classifyReview(reviewId: string, decision: "accept" | "reject"): Promise<void>;
}
```

### Factory and Context Pattern

The `factory.ts` file must not have `"use client"` — it runs on the server (root layout is a Server Component that calls `createProviders()`). The `context.tsx` file must have `"use client"` — it exports hooks.

**`createProviders()` shape:**
```typescript
export function createProviders(): Providers {
  const mode = process.env.NEXT_PUBLIC_PROVIDER_MODE ?? "mock";
  // per-provider override env vars allow surgical mixing during development
  return {
    ar: resolveProvider("ar", mode),
    reviews: resolveProvider("reviews", mode),
    // ... etc.
  };
}
```

**`useProvider()` strict typing — no `any`:**
```typescript
// 10 overloads, one per key
export function useProvider(name: "ar"): ARProvider;
export function useProvider(name: "reviews"): ReviewProvider;
// ... 8 more overloads
export function useProvider(name: keyof Providers): Providers[keyof Providers] {
  const ctx = useContext(ProvidersContext);
  if (!ctx) throw new Error("useProvider must be used within <ProvidersContext.Provider>");
  return ctx[name];
}
```

### Recommended layout.tsx Pattern (Next.js App Router)

The root layout.tsx is a Server Component. It cannot use hooks or `"use client"` directly. The recommended Next.js App Router pattern is to extract a `<RootProviders>` client component:

```typescript
// src/components/root-providers.tsx
"use client";
import { ProvidersContext } from "@/lib/providers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import type { Providers } from "@/lib/providers";

export function RootProviders({ providers, children }: { providers: Providers; children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 60_000 } },
  }));
  return (
    <QueryClientProvider client={queryClient}>
      <ProvidersContext.Provider value={providers}>
        {children}
      </ProvidersContext.Provider>
    </QueryClientProvider>
  );
}
```

Then in `layout.tsx` (Server Component):
```typescript
import { createProviders } from "@/lib/providers";
import { RootProviders } from "@/components/root-providers";

export default function RootLayout({ children }) {
  const providers = createProviders(); // called on the server
  return (
    <html>
      <body>
        <RootProviders providers={providers}>{children}</RootProviders>
      </body>
    </html>
  );
}
```

This keeps layout.tsx as a Server Component (important for metadata, font loading, and Next.js caching semantics) while wiring client-side context correctly.

> **Important:** `createProviders()` is called once per request on the server side in the root layout. Mock providers are in-memory objects (no network calls in their stub form), so this is fine for Demo V1. In Production V1, the factory would create Drizzle-client-backed provider instances.

### ESLint Rule — Exact Flat Config Addition

Read the current `eslint.config.mjs` first. Add these objects to the `defineConfig([...])` array:

```javascript
// Rule 1: Block vendor SDK imports in feature code (not in provider implementation files)
{
  files: ["src/**/*.{ts,tsx}"],
  ignores: [
    "src/lib/providers/mock/**",
    "src/lib/providers/production/**",
    "src/lib/providers/factory.ts",
  ],
  rules: {
    "no-restricted-imports": ["error", {
      patterns: [
        {
          group: ["@mediapipe/*"],
          message: "Import from @/lib/providers, not @mediapipe directly. Vendor SDKs are isolated to provider implementations.",
        },
        {
          group: ["twilio", "@sendgrid/*"],
          message: "Use providers.notification, not vendor SDKs directly.",
        },
        {
          group: ["@supabase/*"],
          message: "Use providers directly. Vendor SDKs are isolated to src/lib/providers/{mock,production}/*.",
        },
        {
          group: ["@/lib/providers/mock/*", "@/lib/providers/production/*"],
          message: "Import from @/lib/providers (the factory), not implementations directly.",
        },
      ],
    }],
  },
},
// Rule 2: TypeScript strictness (applies to all src files, including providers)
{
  files: ["src/**/*.{ts,tsx}"],
  rules: {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
  },
},
```

### Stub Mock Pattern (for Task 3)

All 10 stub files follow the same pattern:

```typescript
// src/lib/providers/mock/MockARProvider.ts
import { ProviderError } from "@/lib/providers/errors";
import type { ARProvider } from "@/lib/providers/contracts/ar-provider";

// STUB — placeholder so factory.ts compiles.
// Real implementation: see Story 1.5 (MockARProvider with MediaPipe Tasks Vision).
export class MockARProvider implements ARProvider {
  async prewarm(): Promise<void> {
    await this._notImplemented("prewarm");
  }
  async segment(): Promise<never> {
    return this._notImplemented("segment");
  }
  async dispose(): Promise<void> {
    await this._notImplemented("dispose");
  }
  private async _notImplemented(method: string): Promise<never> {
    await new Promise(r => setTimeout(r, 50 + Math.random() * 150)); // realistic latency
    throw new ProviderError(
      "NOT_IMPLEMENTED",
      `MockARProvider.${method} is not yet implemented. See Story 1.5.`,
    );
  }
}
```

> **Do NOT** silently return `undefined` or empty arrays from stubs. Throwing `ProviderError("NOT_IMPLEMENTED")` surfaces missing implementations early and makes the contract test meaningful.

### File Structure After This Story

```
sb-tryon/src/
├── app/
│   └── layout.tsx              ← UPDATED: adds RootProviders wrapper
├── components/
│   └── root-providers.tsx      ← NEW: "use client" wrapper for context + QueryClient
├── lib/
│   └── providers/
│       ├── contracts/          ← NEW DIRECTORY
│       │   ├── ar-provider.ts
│       │   ├── review-provider.ts
│       │   ├── auth-provider.ts
│       │   ├── attribution-provider.ts
│       │   ├── notification-provider.ts
│       │   ├── booking-handoff-provider.ts
│       │   ├── salon-provider.ts
│       │   ├── bsg-provider.ts
│       │   ├── calendar-provider.ts
│       │   ├── editorial-provider.ts
│       │   └── index.test.ts   ← NEW: Vitest contract test
│       ├── mock/               ← NEW DIRECTORY (stub placeholders)
│       │   ├── MockARProvider.ts
│       │   ├── MockReviewProvider.ts
│       │   ├── MockAuthProvider.ts
│       │   ├── MockAttributionProvider.ts
│       │   ├── MockNotificationProvider.ts
│       │   ├── MockBookingHandoffProvider.ts
│       │   ├── MockSalonProvider.ts
│       │   ├── MockBSGProvider.ts
│       │   ├── MockCalendarProvider.ts
│       │   └── MockEditorialProvider.ts
│       ├── production/         ← NEW DIRECTORY (empty; post-funding)
│       ├── errors.ts           ← NEW: ProviderError class
│       ├── errors.test.ts      ← NEW: trivial test
│       ├── factory.ts          ← NEW: createProviders(), createMockProviders()
│       ├── context.tsx         ← NEW: "use client"; ProvidersContext, useProvider()
│       └── index.ts            ← NEW: public barrel re-export
├── ...
```

### Downstream Story Handoff Contracts

Stories that depend on this story's output must find the following exports working:

| Downstream Story | Required Export | From |
|---|---|---|
| 1.3 (Design Tokens + Storybook) | `createMockProviders()` | `@/lib/providers` |
| 1.4 (Layout Shells) | `ProvidersContext`, `useProvider` | `@/lib/providers` |
| 1.5 (MockARProvider) | `ARProvider` interface, `MockARProvider` stub file to replace | `@/lib/providers` |
| 2.1 (MockEditorialProvider) | `EditorialProvider` interface, `MockEditorialProvider` stub to replace | `@/lib/providers` |
| 3.1 (MockReviewProvider) | `ReviewProvider` interface, `MockReviewProvider` stub to replace | `@/lib/providers` |
| 4.6 (AttributionProvider) | `AttributionProvider` interface | `@/lib/providers` |
| All feature stories | `useProvider(name)` with correct return type | `@/lib/providers` |

### Key Constraints from Architecture

- **No concrete vendor types in contract files.** `@mediapipe/tasks-vision`, `twilio`, `@sendgrid/*` must NOT appear as imports in any `contracts/*.ts` file. Contracts own their own types.
- **All methods async.** Every method in every interface returns `Promise<T>`. Never synchronous even for simple reads. Callers can't know whether they hit an in-memory mock or a network call.
- **Mock stubs are NOT the real mock providers.** The stub files created in Task 3 are replaced by real implementations in later stories (1.5, 2.1, 3.1, etc.). Do NOT implement any real logic in Task 3 — throw `ProviderError("NOT_IMPLEMENTED", ...)` and add a comment referencing the implementing story.
- **ESLint must not fire on any currently existing code.** Verify with `pnpm lint` before marking the task done.
- **Realistic latency in stubs.** 50-200ms per architecture §5 — "Mock providers introduce realistic latency (50-200ms) so demo feels real."
- **`useProvider` hook has ZERO `any` casts.** Use overloads to achieve strict return types. TypeScript will catch any drift.

### Architecture Source References

- Provider DI Mechanism: [architecture.md — Provider DI Mechanism](../_bmad-output/planning-artifacts/architecture.md) §4
- Provider Interface Inventory table: [architecture.md — Provider Interface Inventory](../_bmad-output/planning-artifacts/architecture.md) §4
- ESLint rules: [architecture.md — Enforcement Guidelines](../_bmad-output/planning-artifacts/architecture.md) §5
- File structure: [architecture.md — Project Structure](../_bmad-output/planning-artifacts/architecture.md) §6
- Pattern examples (correct/wrong provider usage): [architecture.md — Pattern Examples](../_bmad-output/planning-artifacts/architecture.md) §5
- ProviderError class pattern: [architecture.md — Error Handling](../_bmad-output/planning-artifacts/architecture.md) §5
- Story ACs (canonical): [epics.md — Story 1.2](../_bmad-output/planning-artifacts/epics.md) §Epic 1

## Dev Agent Record

### Agent Model Used

- claude-sonnet-4-6 (create-story workflow, 2026-05-03)
- claude-sonnet-4-6 (dev-story workflow, 2026-05-04)

### Debug Log References

- **TS narrowing in `factory.ts`**: First implementation used a loop over `PROVIDER_KEYS` with `result[slot] = instantiate(slot, ...)` and a generic `instantiate<K>` reading from a homomorphic mock-factory map. TypeScript widened the value type to the intersection of all provider interfaces and rejected the assignment (ts2322). Fix: replaced the loop with explicit per-slot construction via 10 dedicated `make*()` helpers and a single object literal. TS narrows each property contextually; zero `any` casts.
- **`pnpm lint` broken from Story 1.1**: Script was `next lint`, but Next.js 16.2 removed the `lint` subcommand. Symptom: "Invalid project directory provided, no such directory: …/lint", exit 1. CI was treating this as a hard failure but Story 1.1's smoke test recorded it as `✓ zero errors` — likely a misread. Fixed in this story by switching to `eslint .` and broadening `globalIgnores` to cover build/test artifacts.
- **RSC class-instance serialization**: Initial `layout.tsx` wiring constructed providers via `createProviders()` server-side and passed them as a prop to `<RootProviders>`. Build failed with "Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported." Fixed by moving construction inside `RootProviders` via `useState(() => createProviders())`. Server Components needing providers call `createProviders()` directly (architecture §4 explicitly supports both Server and Client paths).
- **Coverage gate**: First contract test draft only sampled 5 methods; coverage came in at 32% lines (below the 70% threshold) because most stub method bodies were never executed. Fixed by adding an `INVOKE` map covering all 47 contract methods plus per-slot env-override branches; coverage rose to 100% across all four metrics.

### Completion Notes List

- All 6 ACs satisfied; all 11 tasks (with subtasks) complete and verified by green CI gates.
- 100% coverage on `src/lib/**` (statements, branches, functions, lines) — NFR39 ≥70% target exceeded.
- Bundle size: 204.07 KB / 300 KB gzipped (up +10 KB from Story 1.1; the delta is `@tanstack/react-query`'s runtime now wired into `RootProviders`).
- Provider contracts are vendor-import-free at the type level (every contract type is self-contained; verified with `grep` and by lint).
- Stub mocks do realistic 50-200ms latency before throwing — demo will not feel suspiciously instant once real flows are added in Story 1.5+.
- ESLint rule fires correctly on synthetic violations (verified with a temporary `_synthetic-test.tsx` file: caught `@mediapipe/*` and `@/lib/providers/mock/*` imports as 2 errors).
- Pre-existing Storybook example assets in `src/stories/` (Button.tsx, Header.tsx, Page.tsx and accompanying CSS/PNGs) are untouched; Story 1.3 will replace them with real component stories.
- `useProvider` hook is strictly typed via 10 function overloads — `useProvider("ar")` returns `ARProvider`, etc., with zero `any` casts in the public type signature.

### File List

**New files:**
- `sb-tryon/src/lib/providers/errors.ts`
- `sb-tryon/src/lib/providers/errors.test.ts`
- `sb-tryon/src/lib/providers/contracts/ar-provider.ts`
- `sb-tryon/src/lib/providers/contracts/review-provider.ts`
- `sb-tryon/src/lib/providers/contracts/auth-provider.ts`
- `sb-tryon/src/lib/providers/contracts/attribution-provider.ts`
- `sb-tryon/src/lib/providers/contracts/notification-provider.ts`
- `sb-tryon/src/lib/providers/contracts/booking-handoff-provider.ts`
- `sb-tryon/src/lib/providers/contracts/salon-provider.ts`
- `sb-tryon/src/lib/providers/contracts/bsg-provider.ts`
- `sb-tryon/src/lib/providers/contracts/calendar-provider.ts`
- `sb-tryon/src/lib/providers/contracts/editorial-provider.ts`
- `sb-tryon/src/lib/providers/contracts/index.test.ts`
- `sb-tryon/src/lib/providers/mock/MockARProvider.ts`
- `sb-tryon/src/lib/providers/mock/MockReviewProvider.ts`
- `sb-tryon/src/lib/providers/mock/MockAuthProvider.ts`
- `sb-tryon/src/lib/providers/mock/MockAttributionProvider.ts`
- `sb-tryon/src/lib/providers/mock/MockNotificationProvider.ts`
- `sb-tryon/src/lib/providers/mock/MockBookingHandoffProvider.ts`
- `sb-tryon/src/lib/providers/mock/MockSalonProvider.ts`
- `sb-tryon/src/lib/providers/mock/MockBSGProvider.ts`
- `sb-tryon/src/lib/providers/mock/MockCalendarProvider.ts`
- `sb-tryon/src/lib/providers/mock/MockEditorialProvider.ts`
- `sb-tryon/src/lib/providers/production/README.md`
- `sb-tryon/src/lib/providers/factory.ts`
- `sb-tryon/src/lib/providers/context.tsx`
- `sb-tryon/src/lib/providers/context.test.tsx`
- `sb-tryon/src/lib/providers/index.ts`
- `sb-tryon/src/components/root-providers.tsx`

**Modified files:**
- `sb-tryon/src/app/layout.tsx` — wraps children in `<RootProviders>`; updates metadata title + description
- `sb-tryon/eslint.config.mjs` — adds vendor-import restriction rule, TS strictness rules, broadened `globalIgnores`
- `sb-tryon/package.json` — `lint` script changed from `next lint` to `eslint .` (Story 1.1 carry-over defect; see Change Log)

**Unchanged (deliberately):**
- `sb-tryon/.env.example` — already populated with `NEXT_PUBLIC_PROVIDER_MODE=mock` and per-slot overrides during Story 1.1.
- `sb-tryon/src/lib/utils.ts`, `sb-tryon/src/lib/utils.test.ts` — Story 1.1 scaffolding, untouched.
- `sb-tryon/src/stories/**` — create-next-app / shadcn onboarding examples, untouched (replaced in Story 1.3).

### Change Log

| Date | Change | Author |
|---|---|---|
| 2026-05-03 | Story dev guide created (create-story workflow) | claude-sonnet-4-6 |
| 2026-05-04 | Story implemented — 10 provider contracts, factory, ProvidersContext, useProvider hook (10 overloads), 10 stub mocks with 50-200ms latency + NOT_IMPLEMENTED throws, ESLint vendor-import rule, root-providers client wrapper. 60 unit tests, 100% coverage on src/lib/**. | claude-sonnet-4-6 |
| 2026-05-04 | **Carry-over fix from Story 1.1**: repaired broken `pnpm lint` script (`next lint` → `eslint .`); added `coverage/`, `storybook-static/`, `test-results/`, `playwright-report/`, `.lighthouseci/`, `*.tsbuildinfo` to ESLint global ignores. Story 1.1's lint gate had been silently failing in CI. Flag for Epic 1 retrospective. | claude-sonnet-4-6 |
| 2026-05-04 | **Architecture clarification**: provider construction moved from `layout.tsx` (Server) to `RootProviders` (Client) via `useState(() => createProviders())`. Reason: Next.js RSC serialization rejects class instances crossing Server→Client. Server Components needing providers call `createProviders()` directly. The architecture §4 already supports both call sites, so no architecture amendment is needed — only the Story 1.2 dev-guide example was misleading and is corrected by this implementation. | claude-sonnet-4-6 |
