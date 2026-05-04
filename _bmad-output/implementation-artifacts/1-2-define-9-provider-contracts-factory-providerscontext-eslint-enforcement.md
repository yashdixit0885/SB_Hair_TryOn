# Story 1.2: Define 9 Provider Contracts + Factory + ProvidersContext + ESLint Enforcement

**Status:** ready-for-dev

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

- [ ] **Task 1: Create `ProviderError` shared error class** (AC1, AC6)
  - [ ] Create `src/lib/providers/errors.ts` exporting `ProviderError extends Error` with `code: string`, `userMessage: string`, `cause?: unknown` (matches architecture §5 pattern example exactly)
  - [ ] Create companion test `src/lib/providers/errors.test.ts` (trivial; confirms class is constructable and `instanceof Error`)

- [ ] **Task 2: Create 10 contract interface files** (AC1)
  - [ ] `src/lib/providers/contracts/ar-provider.ts` — `ARProvider` interface with `prewarm()`, `segment(image: ImageBitmap): Promise<SegmentationResult>`, `dispose()`; export `SegmentationResult` type (`{ alphaMask: Uint8ClampedArray; confidence: number; width: number; height: number }`)
  - [ ] `src/lib/providers/contracts/review-provider.ts` — `ReviewProvider` with `list(filters: ReviewFilters): Promise<Review[]>`, `get(reviewId: string): Promise<Review>`, `submit(payload: ReviewSubmitPayload): Promise<Review>`, `reply(reviewId: string, body: string): Promise<void>`, `getRanking(colorSlug: string): Promise<ReviewRanking>`; export all referenced types
  - [ ] `src/lib/providers/contracts/auth-provider.ts` — `AuthProvider` with `getCurrentUser(): Promise<AuthUser>`, `login(): Promise<void>`, `logout(): Promise<void>`, `requireRole(role: UserRole): Promise<void>`; export `AuthUser` type (`{ userId: string; role: UserRole; displayName: string; sallyRewardsId?: string } | { role: "Guest" }`), `UserRole` (`"Consumer" | "Stylist" | "SalonPartner" | "EditorialCurator" | "Guest"`)
  - [ ] `src/lib/providers/contracts/attribution-provider.ts` — `AttributionProvider` with `issueToken(payload: AttributionTokenPayload): Promise<string>`, `verifyToken(token: string): Promise<TokenVerifyResult>`, `getAttributionForPartner(partnerId: string, range: DateRange): Promise<PartnerAttribution>`, `getAttributedBookingsForStylist(stylistId: string, range: DateRange): Promise<StylistAttribution>`, `getColorChoiceAnalytics(partnerId: string, range: DateRange): Promise<ColorChoiceAnalytics>`; export all referenced types; `TokenVerifyResult` = `{ valid: true; payload: AttributionTokenPayload } | { valid: false; reason: "tampered" | "expired" | "malformed" }`
  - [ ] `src/lib/providers/contracts/notification-provider.ts` — `NotificationProvider` with `schedule(payload: ScheduleNotificationPayload): Promise<void>`, `send(channel: NotificationChannel, payload: NotificationPayload): Promise<void>`; export `NotificationChannel` (`"sms-24h" | "email-7d" | "in-app-banner"`), `ScheduleNotificationPayload` (`{ type: "post-booking"; bookingId: string; channels: NotificationChannel[] }`)
  - [ ] `src/lib/providers/contracts/booking-handoff-provider.ts` — `BookingHandoffProvider` with `handoff(payload: BookingHandoffPayload): Promise<{ deepLinkUrl: string }>`; export `BookingHandoffPayload` (`{ salonId: string; lookId: string; token: string }`)
  - [ ] `src/lib/providers/contracts/salon-provider.ts` — `SalonProvider` with `search(filters: SalonSearchFilters): Promise<Salon[]>`, `getSalonBySlug(salonSlug: string): Promise<Salon>`, `getStylists(salonSlug: string): Promise<Stylist[]>`, `getCertifications(salonSlug: string): Promise<Certification[]>`; export all referenced types
  - [ ] `src/lib/providers/contracts/bsg-provider.ts` — `BSGProvider` with `suggestReorder(salonId: string): Promise<BSGReorderSuggestion[]>`, `getProductInfo(productId: string): Promise<BSGProduct>`; export all referenced types
  - [ ] `src/lib/providers/contracts/calendar-provider.ts` — `CalendarProvider` with `createInvite(payload: CalendarInvitePayload): Promise<CalendarInvite>`; export `CalendarInvitePayload`, `CalendarInvite` (`{ inviteUrl: string; calendarFormat: "ical" | "google" | "outlook" }`)
  - [ ] `src/lib/providers/contracts/editorial-provider.ts` — `EditorialProvider` with read methods: `getColorTaxonomy(): Promise<ColorTaxonomy[]>`, `getColorBySlug(slug: string): Promise<ColorTaxonomy>`, `getBrands(): Promise<Brand[]>`, `getBrandColorMappings(): Promise<BrandColorMapping[]>`, `getSpecialtyTierFlag(colorSlug: string): Promise<boolean>`, `getAuditLog(entityType: string, entityId: string): Promise<AuditLogEntry[]>`, `getClassificationQueue(filters: ClassificationFilters): Promise<ClassificationItem[]>`, `getClassificationQuality(): Promise<ClassificationQuality>` and write methods: `createColor(payload: CreateColorPayload): Promise<ColorTaxonomy>`, `updateColor(slug: string, patch: Partial<ColorTaxonomy>): Promise<ColorTaxonomy>`, `deactivateColor(slug: string, reason: string): Promise<void>`, `setSpecialtyTier(slug: string, isSpecialty: boolean): Promise<void>`, `createBrandColorMapping(payload: CreateBrandColorMappingPayload): Promise<BrandColorMapping>`, `updateBrandColorMapping(id: string, patch: Partial<BrandColorMapping>): Promise<BrandColorMapping>`, `classifyReview(reviewId: string, decision: "accept" | "reject"): Promise<void>`; export all referenced types
  - [ ] Verify NO concrete vendor package imports anywhere in these 10 files (only TypeScript built-in types or types defined within the file/contracts folder)

- [ ] **Task 3: Create placeholder stub mock implementations** (AC2, AC6)
  - [ ] Create `src/lib/providers/mock/` directory (it doesn't exist yet)
  - [ ] Create 10 stub files: `MockARProvider.ts`, `MockReviewProvider.ts`, `MockAuthProvider.ts`, `MockAttributionProvider.ts`, `MockNotificationProvider.ts`, `MockBookingHandoffProvider.ts`, `MockSalonProvider.ts`, `MockBSGProvider.ts`, `MockCalendarProvider.ts`, `MockEditorialProvider.ts` — each implements its interface with all methods throwing `new ProviderError("NOT_IMPLEMENTED", "This provider is not yet implemented. See the story that implements this provider for the real implementation.")` — these stubs keep TypeScript happy and allow the factory to compile; later stories (1.5, 2.1, 3.1, etc.) replace each stub with real implementations
  - [ ] Create `src/lib/providers/production/` directory with a placeholder `README.md` (or `.gitkeep`) — post-funding implementations land here
  - [ ] Add realistic latency simulation to stubs (50-200ms `await new Promise(r => setTimeout(r, 50 + Math.random() * 150))`) so demo feels real from day one (see architecture §5 "Always async, always typed")

- [ ] **Task 4: Create `factory.ts`** (AC2)
  - [ ] Export `createProviders()` — reads `process.env.NEXT_PUBLIC_PROVIDER_MODE` (default `"mock"`), reads per-provider overrides, returns `Providers` object using stub mocks for `"mock"` mode and stub production stubs for `"production"` (production stubs also throw `NOT_IMPLEMENTED` for now — real production implementations are post-funding)
  - [ ] Export `createMockProviders()` — always returns `Providers` object using mock stubs regardless of env vars; used by tests and Storybook (Story 1.3 depends on this export)
  - [ ] Export `Providers` type: `{ ar: ARProvider; reviews: ReviewProvider; auth: AuthProvider; attribution: AttributionProvider; notification: NotificationProvider; bookingHandoff: BookingHandoffProvider; salon: SalonProvider; bsg: BSGProvider; calendar: CalendarProvider; editorial: EditorialProvider }`

- [ ] **Task 5: Create `context.tsx` with `<ProvidersContext>` and `useProvider()` hook** (AC3)
  - [ ] Add `"use client"` directive at top (this file contains React hooks; Server Components import from factory directly)
  - [ ] Create `ProvidersContext` via `React.createContext<Providers | null>(null)` (null default forces provider wrapping to be explicit)
  - [ ] Export `<ProvidersContext.Provider>` component (re-export or thin wrapper)
  - [ ] Export `useProvider` with function overloads for each key: `function useProvider(name: "ar"): ARProvider`, `function useProvider(name: "reviews"): ReviewProvider`, etc. — 10 overloads total; implementation uses `useContext(ProvidersContext)` and asserts non-null (throws if used outside provider boundary); **zero `any` in types or implementation**
  - [ ] Guard: if `useContext` returns `null`, throw `new Error("useProvider must be used within <ProvidersContext.Provider>")` — gives a clear DX error message

- [ ] **Task 6: Create `src/lib/providers/index.ts` public barrel** (AC4)
  - [ ] Re-export all 10 contract interfaces as types: `export type { ARProvider } from "./contracts/ar-provider"`, etc.
  - [ ] Re-export shared types from contracts (SegmentationResult, AuthUser, UserRole, etc.)
  - [ ] Re-export `ProviderError` from `./errors`
  - [ ] Re-export `Providers`, `createProviders`, `createMockProviders` from `./factory`
  - [ ] Re-export `useProvider`, `ProvidersContext` from `./context`
  - [ ] This file is NOT `"use client"` — Server Components can import from it; hooks are client-only by their own directive

- [ ] **Task 7: Update `src/app/layout.tsx`** (AC4)
  - [ ] Read the current layout.tsx before editing (it has Geist font setup and basic structure)
  - [ ] Add `"use client"` wrapping via a separate `Providers.tsx` client component (recommended Next.js App Router pattern to keep the root layout as a Server Component) OR wrap inline — see Dev Notes for the recommended pattern
  - [ ] Wire `<ProvidersContext.Provider value={createProviders()}>` around `{children}`
  - [ ] Wire `<QueryClientProvider client={queryClient}>` around children (create a `QueryClient` instance outside the component per TanStack Query docs for Next.js App Router — use `React.useMemo` or module-level singleton)
  - [ ] Update metadata title from "Create Next App" to "Sally Beauty Hair Color Try-On" (housekeeping while touching this file)

- [ ] **Task 8: Update `eslint.config.mjs`** (AC5)
  - [ ] Read current eslint.config.mjs before editing
  - [ ] Add a config object with `files: ["src/**/*.{ts,tsx}"]`, `ignores: ["src/lib/providers/mock/**", "src/lib/providers/production/**", "src/lib/providers/factory.ts"]`, containing the vendor-SDK restriction rule (exact `no-restricted-imports` patterns from architecture §5)
  - [ ] Add a separate config object with `files: ["src/**/*.{ts,tsx}"]` containing `@typescript-eslint/no-explicit-any: "error"` and `@typescript-eslint/no-non-null-assertion: "error"` (no `ignores` override — these apply everywhere including provider files)
  - [ ] Verify `pnpm lint` still passes after changes (the new rules should have zero violations in current codebase since there are no vendor imports or `any` uses yet)

- [ ] **Task 9: Update `.env.example`** (AC2, AC5)
  - [ ] Add `NEXT_PUBLIC_PROVIDER_MODE=mock` with a comment explaining valid values (`mock` | `production`) and that mock is the Demo V1 default
  - [ ] Add per-provider override example: `# NEXT_PUBLIC_AR_PROVIDER=mediapipe  # Override individual providers during development`

- [ ] **Task 10: Author `src/lib/providers/contracts/index.test.ts`** (AC6)
  - [ ] Import `createProviders` and `createMockProviders` from `@/lib/providers`
  - [ ] Test: both functions return objects with all 10 keys
  - [ ] Test: each value is non-null and has the expected method names (check `typeof providers.ar.prewarm === "function"` etc.)
  - [ ] Test: calling a stub method (e.g. `await providers.ar.prewarm()`) rejects with `ProviderError` where `code === "NOT_IMPLEMENTED"`
  - [ ] Test: `createMockProviders()` result is independent of `process.env.NEXT_PUBLIC_PROVIDER_MODE` (set env to `"production"` in test, still returns mock stubs)
  - [ ] Run `pnpm test:unit` and confirm green

- [ ] **Task 11: Smoke-test the full gate chain**
  - [ ] `pnpm typecheck` — zero errors (strict mode on new provider files)
  - [ ] `pnpm lint` — zero violations (new ESLint rules must not fire on provider files themselves)
  - [ ] `pnpm test:unit` — contract test passes + existing `utils.test.ts` still passes
  - [ ] `pnpm build` — production build compiles without errors
  - [ ] `pnpm dev` — dev server starts; root route renders (providers are wired but produce no visible UI change)

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

claude-sonnet-4-6 (create-story workflow, 2026-05-03)

### Debug Log References

_None yet — pre-implementation_

### Completion Notes List

_To be filled in by dev agent after implementation_

### File List

_To be filled in by dev agent after implementation_
