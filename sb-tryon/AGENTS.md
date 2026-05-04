# AGENTS.md — sb-tryon coding agent rules

Single source of truth for AI coding agents and engineers working on this codebase. Mirrors `_bmad-output/planning-artifacts/architecture.md` §5 (Implementation Patterns & Consistency Rules). When in doubt, this file wins; if this file is silent, read the architecture document; if both are silent, surface the question rather than invent a convention.

> **This is NOT the Next.js you know.** Next.js 16 has breaking changes from 13/14/15 — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing route or rendering code. Heed deprecation notices.

---

## 1. The 10 cross-cutting concerns

These are the architectural invariants the system depends on. Every story, every PR is checked against them.

1. **Provider-vendor coupling** — feature code never imports a vendor SDK directly. All vendor SDKs (`@mediapipe/*`, Twilio, SendGrid, BSG, Sally Rewards, Booksy/Vagaro/Square, Google Places, etc.) live behind provider abstractions in `src/lib/providers/{mock,production}/*`. ESLint enforces this — see §6 below.
2. **Biometric privacy** — uploaded photos are in-memory only by default (React refs + `Blob` URLs). Photos are never sent to the server unless the user opts in via the consent state machine (`src/lib/security/consent-state.ts`). The `consent` Zustand store gates every photo-touching code path.
3. **Single codebase no fork** (NFR35) — Demo V1 and Production V1 ship from one codebase. The demo→production transition is an env-var swap (`NEXT_PUBLIC_PROVIDER_MODE=mock` → `production`) and a provider-implementation swap, not a code change in business logic. **No demo-only UI elements** anywhere in `src/components/*`.
4. **State tier ownership** (architecture §4 — State Management) — every piece of state lives in exactly one tier. URL state for shareable / SEO / back-nav-able state. TanStack Query for server state. Zustand stores (per-domain) for transient client UI state. IndexedDB for persisted client data (saved looks, MediaPipe model cache). React refs + `Blob` URLs for the active photo. **Never put server state in Zustand. Never put photo blobs in IndexedDB without the consent path.**
5. **Source attribution on every review** — every review surfaced anywhere in the app must include a `<SourceAttributionLabel>` chip declaring its source class (Native / Aggregated / Editorial / Salon-attested). FR13 + UX honesty pattern #1.
6. **Empty states are intentional** — no fallback "Coming soon" / "Nothing here yet" copy. `<HonestEmptyState>` requires an explicit `copy` prop with no default.
7. **Equal-weight exit affordances** on the render surface (UX-DR8) — "Find a salon," "Save this look," "Share this look," "Try another color" rendered as equal Secondary-tier buttons. Never funnel toward booking.
8. **Test colocation, no `__tests__/` directories** — every `Foo.tsx` ships with `Foo.test.tsx` next to it. Every `bar.ts` ships with `bar.test.ts` next to it. E2E tests live in `e2e/` at repo root (Playwright convention).
9. **Storybook colocation** — every component in `src/components/**` has a sibling `.stories.tsx`. CI's `pnpm check:stories` enforces. Components without stories block merge.
10. **Density variant at the layout level** (UX-DR3) — `density-comfortable` for consumer surfaces, `density-compact` for operator surfaces. Declared on the `(consumer)/` vs `(operator)/` route group's layout via Tailwind variants. Descendants read density from CSS variable, never via prop.

---

## 2. Naming patterns

### Database (Postgres + Drizzle ORM, Production V1)

| Element | Pattern | Example |
|---|---|---|
| Table name | `snake_case`, plural | `reviews`, `salon_partners`, `color_taxonomy_entries` |
| Column name | `snake_case` | `created_at`, `salon_id`, `outcome_dimensions` |
| Primary key | `id` (UUID) | `id uuid primary key default gen_random_uuid()` |
| Foreign key | `{referenced_table_singular}_id` | `salon_id`, `color_id`, `stylist_id` |
| Index | `idx_{table}_{columns}` | `idx_reviews_color_id`, `idx_attribution_nonce` |
| Timestamp | `created_at`, `updated_at`, `deleted_at` (soft delete only when needed) | always `timestamptz` |
| Boolean | positive phrasing | `is_published`, `has_brand_reply`, **never** `is_not_archived` |
| JSONB column | snake_case payload keys | `outcome_dimensions: { fade_weeks, accuracy_1_to_5, ... }` |

Drizzle column mapping converts at the ORM boundary; **TypeScript types are camelCase** even though DB columns are snake_case. Feature code never sees snake_case.

### API surface

| Element | Pattern | Example |
|---|---|---|
| Route path | `kebab-case`, plural for collections | `/api/reviews`, `/api/booking-handoff`, `/api/webhooks/booking` |
| Route param | `[paramName]` (camelCase inside brackets) | `/api/reviews/[reviewId]`, `/api/colors/[colorSlug]` |
| Query param | `camelCase` | `?textureFilter=4a&colorId=auburn-1` |
| HTTP method | semantic — GET read, POST create, PATCH update, DELETE remove | always-idempotent webhooks use POST + idempotency key |
| Status codes | 200 success, 201 created, 400 validation, 401 unauth, 403 forbidden, 404 not found, 409 conflict, 422 zod fail, 500 server | **no 200-with-error-body** |
| Response shape | bare data on 2xx; `{ error: { code, message, details? } }` on 4xx/5xx | no `{ data, error }` envelope |

### Code (TypeScript)

| Element | Pattern | Example |
|---|---|---|
| Component | `PascalCase`, file matches | `ColorRender.tsx`, `FadeSimulator.tsx`, `SourceAttributionLabel.tsx` |
| Non-component file | `kebab-case` | `color-shift.ts`, `attribution-token.ts`, `consent-state.ts` |
| Hook | `use{Noun}` for stores and queries | `useTryOnStore()`, `useReviews()`, `useSubmitReview()` |
| Function | `camelCase`, verb-first | `signAttributionToken`, `revokeConsent`, `loadColorTaxonomy` |
| Type / Interface | `PascalCase`, **no `I` prefix** | `Review`, `ARProvider`, `ConsentRecord` |
| Provider impl | `{Vendor}{Interface}` or `Mock{Interface}` | `MediaPipeARProvider`, `MockReviewProvider`, `TwilioNotificationProvider` |
| Const | `UPPER_SNAKE_CASE` for module-level immutables; `camelCase` for inferred | `MAX_PHOTO_SIZE_BYTES`, `DEFAULT_LIGHTING_PRESET` |
| Env var | `UPPER_SNAKE_CASE`; `NEXT_PUBLIC_` prefix only when client-bundled | `NEXT_PUBLIC_PROVIDER_MODE`, `ATTRIBUTION_TOKEN_SECRET` |
| Test file | colocated, `.test.ts(x)` suffix | `ColorRender.tsx` ↔ `ColorRender.test.tsx` |
| Storybook story | colocated, `.stories.tsx` suffix | `ColorRender.tsx` ↔ `ColorRender.stories.tsx` |

### ID conventions

- Database PK: UUID v4 / v7 (`gen_random_uuid()` for now; v7 once Postgres support stabilizes).
- API-exposed ID: opaque string; never integers exposed to clients.
- Slug: `kebab-case`, e.g. `auburn`, `crown-and-coil`, `wella`. Slugs are stable; UUIDs are internal.

---

## 3. Structure patterns

```
sb-tryon/
├── src/app/                          # ROUTES ONLY (Next.js App Router)
│   ├── (consumer)/                   # density-comfortable + Editorial Magazine
│   ├── (operator)/                   # density-compact + Pro Tool
│   ├── (stylist)/                    # iPad chair-side
│   ├── api/                          # Route Handlers
│   ├── layout.tsx                    # Root layout — ProvidersContext, QueryClient, OTel
│   └── page.tsx                      # Home / value-prop landing
├── src/components/                   # UI components (test + story colocation enforced)
│   ├── ui/                           # shadcn/Radix primitives
│   ├── render/                       # AR render surface
│   ├── reviews/, discovery/, dashboard/, stylist/, layout/
├── src/lib/                          # Shared logic, no JSX
│   ├── providers/                    # Provider abstractions (contracts/, mock/, production/, factory.ts, context.tsx, index.ts)
│   ├── db/, schemas/, stores/, queries/, fixtures/
│   ├── ar/, security/, observability/, auth/, notifications/, reviews/, color-science/, copy/, persistence/, url-state/, utils/
└── src/styles/                       # Tailwind v4 @theme tokens (OKLCH)
e2e/                                  # Playwright tests (5 journeys + smoke specs)
```

**Hard rules:**

- **Route file size:** App Router `page.tsx` and `route.ts` files stay **≤150 lines** (AR10). Business logic lives in `src/lib/`.
- **No `src/components/` directory subtree may exceed three levels deep** — flatten when it grows. Use kebab-case filename to disambiguate.
- **No `__tests__/` directories.** Tests are siblings.
- **No barrel files in feature directories** (`src/components/render/index.ts` is forbidden — import the explicit file). Barrels are reserved for `src/lib/providers/index.ts` (the public provider re-export surface).
- **Server Components by default; `"use client"` is opt-in.** Mark a file Client Component only when it needs hooks, browser APIs, or event handlers.

---

## 4. Format patterns

**API responses:**

- **Success (2xx):** bare data, no envelope.
  ```typescript
  // GET /api/reviews/[reviewId]
  { id, colorId, fadeWeeks, accuracy, ... }
  // GET /api/reviews?colorId=auburn-1
  [{ id, ... }, { id, ... }]
  ```
- **Error (4xx/5xx):** `{ error: { code, message, details? } }`.
  ```typescript
  { error: { code: "VALIDATION_FAILED", message: "fadeWeeks must be a positive integer", details: { field: "fadeWeeks" } } }
  ```

**Data exchange:**

- **Casing:** `camelCase` in API JSON (matches TS); Drizzle does the conversion at the DB boundary.
- **Dates:** ISO-8601 strings (`"2026-05-03T17:24:00.000Z"`). Never epoch numbers in JSON.
- **Money:** never floats. Integer cents (`priceCents: 35000` for $350.00).
- **Booleans:** `true` / `false`. Never `0`/`1` or `"yes"`/`"no"`.
- **Nullable fields:** explicit `null`. Never `undefined` in API JSON.
- **Arrays vs object:** "0 or 1" → nullable scalar. "0 or N" → array (empty array, never `null`).

---

## 5. Communication patterns

**OTel event naming:** `{domain}.{verb_past_tense_or_state_change}` — concise, namespaced, past-tense. Examples: `tryon.session_started`, `tryon.color_selected`, `tryon.render_completed`, `booking.handoff_initiated`, `webhook.booking_received`, `consent.granted`, `consent.declined`. Event names are stable contracts. Never include user-identifying or biometric data in payloads.

**Zustand actions:** imperative verbs, camelCase. Selectors are direct field access, no `selectFoo` getters. Keep stores small; split when a store grows past ~10 actions or fields.

**TanStack Query keys:** array form, hierarchical, immutable, defined in `src/lib/queries/keys.ts`. Never inline a query key.

**State updates:** immutable in Zustand (the library enforces). Server state mutations through `useMutation` with `onSuccess: invalidateQueries`. **No direct `state.foo = bar` mutations.**

---

## 6. Process patterns

### Error handling

- **Boundary at the provider call.** Provider methods may throw `ProviderError` (typed error class with `code`, `cause`, `userMessage`). TanStack Query catches and exposes via `error` state.
- **No silent catches.** Every `catch` either logs via OTel `error` span, surfaces to UI via banner/toast, or rethrows.

### ESLint enforcement (mandatory, blocks merge)

The following rules ship in `eslint.config.mjs` (Story 1.2 lands the provider-import rule; Story 1.1 leaves it at the create-next-app baseline):

```javascript
{
  rules: {
    "no-restricted-imports": ["error", {
      patterns: [
        { group: ["@mediapipe/*"], message: "Import from @/lib/providers, not @mediapipe directly. Vendor SDKs are isolated to provider implementations." },
        { group: ["twilio", "@sendgrid/*"], message: "Use providers.notifications, not vendor SDKs directly." },
        { group: ["@/lib/providers/mock/*", "@/lib/providers/production/*"], message: "Import from @/lib/providers (the factory), not implementations directly." },
      ],
    }],
    "no-restricted-syntax": ["error", {
      selector: "Identifier[name='input'][type='file']",
      message: "Use <PhotoUploader> — consent flow must wrap photo upload.",
    }],
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
  }
}
```

### CI gates (binding order)

1. `pnpm typecheck` — TS strict, zero errors
2. `pnpm lint` — including the rules above
3. `pnpm test:unit` — Vitest with `≥70%` coverage on `src/lib/**` (NFR39)
4. `pnpm test:e2e` — Playwright 5-journey + keyboard-only + consent + attribution suites (NFR23, NFR29)
5. `pnpm build` + `pnpm size-limit` — bundle ≤300KB gzipped excluding `@mediapipe/*` (NFR8)
6. `pnpm lhci` — Web Vitals budgets per `lighthouserc.cjs` (NFR5, NFR8)
7. `pnpm check:stories` — every `src/components/**/*.tsx` has a `.stories.tsx` (UX-DR15)

Earlier gates short-circuit the rest on failure.

### Required imports / wrappers per surface

| Surface | Must include | Reason |
|---|---|---|
| Photo upload | `<PhotoUploader>` (which renders `<ConsentPrompt>` internally) | FR46 + cross-cutting concern #2 |
| Any review display | `<SourceAttributionLabel>` per review | FR13 + UX honesty #1 |
| Color browse | `<SpecialtyTierLabel>` for <3-brand colors | FR11 + UX honesty #4 |
| Render surface | `<HonestFallback>` / `<DemoFallbackPath>` for low-confidence render | UX honesty #2 |
| Empty states | `<HonestEmptyState>` with explicit `copy` prop | UX spec §13 + Tone & Voice |
| Toast confirms touching identity data | `<ToastWithProvenance>` (privacy hint) | UX honesty #3 |

---

## 7. How to add a new feature

1. **Define the contract.** New external service or domain capability → start by adding an interface in `src/lib/providers/contracts/`. No vendor types in the contract.
2. **Ship the mock.** Add `Mock{Interface}` in `src/lib/providers/mock/` reading from `src/lib/fixtures/`. Realistic latency (`120 + Math.random() * 80`), Zod validation on fixture parse.
3. **Stub production.** Add `{Vendor}{Interface}` in `src/lib/providers/production/` with method bodies that throw `not implemented`. Production V1 stories fill these in.
4. **Wire factory + context.** Update `src/lib/providers/factory.ts` to select between mock and production based on env var. The `<ProvidersContext>` already exposes via `useProvider("kind")`.
5. **Wire query hook.** Add a `use{Noun}.ts` query hook in `src/lib/queries/hooks/` calling the provider via `useProvider()`. Add the query key to `src/lib/queries/keys.ts`.
6. **Build the component.** PascalCase `.tsx` in `src/components/{domain}/`. Colocate `.test.tsx` and `.stories.tsx`. Prefer Server Components; opt into Client only when needed.
7. **Compose into a route.** `src/app/(consumer|operator|stylist)/.../page.tsx`. Route file ≤150 lines.
8. **Add E2E.** Update or add the relevant `e2e/{persona}.spec.ts`.

## 8. How to add a new external dependency

**Always behind a provider.** Direct vendor SDK imports outside `src/lib/providers/{mock,production}/*` are blocked by ESLint. The recipe:

1. Identify which existing provider contract this fits (or define a new one in `contracts/`).
2. Implement against the contract in `production/`.
3. Add the env-var selector to `factory.ts`.
4. Document the env var in `.env.example`.
5. Update this file's "Provider Interface Inventory" table if it's a new contract.

---

## 9. Provider interface inventory

Defined in `src/lib/providers/contracts/` (Story 1.2 lands these):

| Interface | Mock implementation | Production implementation |
|---|---|---|
| `ARProvider` | `MediaPipeARProvider` (in-browser MediaPipe Tasks Vision + WebGL color shift) | Licensed AR SDK (Perfect Corp / ModiFace / Banuba) post-DPA |
| `ReviewProvider` | `MockReviewProvider` (curated JSON fixtures) | Composite: Google Places ingestion + brand feeds + native review store |
| `AuthProvider` | `MockAuthProvider` (in-memory guest + scripted "logged in" Maya) | Sally Rewards SSO via OAuth 2.0 PKCE |
| `AttributionProvider` | `MockAttributionProvider` (sample data on Marcus's dashboard) | Deep-link + webhook + BSG product-pull join |
| `NotificationProvider` | `MockNotificationProvider` (toast mockups for SMS/email steps) | Twilio SMS + SendGrid email |
| `BookingHandoffProvider` | `MockBookingHandoffProvider` (placeholder confirmation page) | Booksy / Vagaro / Square / GlossGenius webhooks |
| `SalonProvider` | `MockSalonProvider` (10 curated DFW salons) | Real signed-partner catalog from DB |
| `BSGProvider` | `MockBSGProvider` (one-tap re-order confirmation toast) | Real BSG product-pull + re-order endpoints |
| `CalendarProvider` | `MockCalendarProvider` (mock invite link to web view) | Real iCalendar / Google Calendar / Outlook integration |
| `EditorialProvider` | `MockEditorialProvider` (taxonomy + audit-queue fixtures) | DB-backed editorial admin |

---

## 10. Anti-patterns (block merge)

```typescript
// ❌ vendor SDK imported in feature code
import { ImageSegmenter } from "@mediapipe/tasks-vision";  // ESLint blocks

// ❌ synchronous mock; demo will look fake; breaks when prod swaps in
async getByColorId(colorId: string) {
  return reviewsFixture.filter((r) => r.colorId === colorId);  // no latency, no validation
}

// ❌ server data in Zustand
const useReviewsStore = create((set) => ({ reviews: [], fetchReviews: async () => { /* … */ set({ reviews }); } }));

// ❌ photo blob in IndexedDB without consent path
function uploadPhoto(file: File) { idb.set("activePhoto", file); }

// ❌ empty-state placeholder
<EmptyState>Reviews coming soon!</EmptyState>

// ❌ review without source attribution
<div>{review.body}</div>

// ❌ any cast
const data = response as any;
```

---

## 11. Documents that override this file

This file is the agent rulebook. The authoritative planning artifacts are at the repo root:

- `_bmad-output/planning-artifacts/architecture.md` — full architecture, binding
- `_bmad-output/planning-artifacts/prd.md` — product requirements
- `_bmad-output/planning-artifacts/ux-design-specification.md` — UX spec
- `_bmad-output/planning-artifacts/epics.md` — epic + story BDD ACs
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — current sprint state
- `_bmad-output/implementation-artifacts/{epic}-{story}-{slug}.md` — per-story dev guide

If this file disagrees with the architecture document, the architecture document wins. PR a fix to this file in the same change set.
