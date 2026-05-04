---
stepsCompleted: ["step-01-validate-prerequisites", "step-02-design-epics", "step-03-create-stories", "step-04-final-validation"]
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
  - _bmad-output/planning-artifacts/implementation-readiness-report-2026-05-03.md
  - _bmad-output/planning-artifacts/product-brief-SB_Project-distillate.md
---

# SB_Project (Sally Beauty Hair Color Try-On) - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for SB_Project, decomposing the requirements from the PRD, UX Design Specification, and Architecture into implementable stories.

The product is a brand-neutral hair color try-on experience supporting two co-existing phases off a **single codebase**:

- **Demo V1** (8 weeks, now) — production-quality build that runs locally on laptop + mobile, mocked vendors via provider-pattern abstractions, walked through to Sally Beauty execs across all 5 personas (Maya, Janelle, Aliyah, Marcus, Elena).
- **Production V1** (16 weeks, post-funding) — same codebase, real vendor integrations via production provider implementations, cloud-deployed in DFW with full BIPA/CUBI/GDPR compliance.

Architecture is binding (status complete, 2026-05-03). Stories below should respect, not relitigate, the locked decisions documented in `architecture.md`.

## Requirements Inventory

### Functional Requirements

**Photo Capture & Try-On Visualization**

- **FR1:** Consumer can upload a photo from their device (file picker or drag-drop) for use in try-on rendering.
- **FR2:** Consumer can see their hair rendered in a selected color, with the rendered output preserving their hair texture (curl pattern, porosity, individual coil structure where present).
- **FR3:** Consumer can adjust a 90-day fade simulator timeline parameterized by washes-per-week to preview how the selected color will fade over time.
- **FR4:** Consumer can toggle between three calibrated lighting presets (salon, daylight, warm interior) to preview the selected color under different lighting conditions.
- **FR5:** Consumer can view their rendered hair color combined under the texture, lighting, and fade-stage they have selected.
- **FR6:** Consumer can generate a shareable image of their try-on result with an embedded salon-routing link.
- **FR7:** System retains the consumer's photo only for the active session by default; consumer can opt to save the photo to their account for later use.

**Color & Brand Discovery**

- **FR8:** Consumer can browse the curated color taxonomy organized by color (not by brand).
- **FR9:** Consumer can see, for any selected color, the list of brands that offer that color, ranked by outcome-anchored review metrics.
- **FR10:** Consumer can view structured outcome metrics per (brand × color × texture) tuple: fade weeks, accuracy 1-5, damage 1-5, would-recommend percentage.
- **FR11:** Consumer can identify specialty-tier colors visibly labeled "1 brand only — unique look" when a color is offered by fewer than three brands.
- **FR12:** System enforces that a color appears in the standard taxonomy only when offered by ≥3 brands within color tolerance.

**Outcome Reviews & Source Attribution**

- **FR13:** Consumer can view reviews for a (brand × color) cell with each review labeled by source: Google Places, brand-published, SB user who booked through the app, or stylist-assisted submission.
- **FR14:** Consumer can filter reviews by hair texture type (Type 1 through Type 4).
- **FR15:** Consumer can submit a native review post-booking covering: color outcome (1-5), stylist execution (1-5), salon environment (1-5), fade weeks elapsed, damage (1-5), would-recommend (yes/no), and optional photo.
- **FR16:** System ensures public-facing color rankings use only the color-outcome dimension; stylist execution and salon environment dimensions are surfaced privately to salon partners only.
- **FR17:** System segregates brand-published reviews into a clearly labeled "brand-published" tab and never blends them into headline rankings.
- **FR18:** System never permits deletion of native reviews except for documented ToS violations.
- **FR19:** System never permits ranking adjustments by brand request.
- **FR20:** System retains native reviews after a brand contract terminates.
- **FR21:** System displays ingested third-party reviews verbatim with source attribution; the system does not modify or remove ingested third-party review content.

**Salon Discovery & Booking Handoff**

- **FR22:** Consumer can search for salons by location (within a configurable radius) that offer a selected color.
- **FR23:** Consumer can view a salon profile including color-specific certifications, color-specific accuracy ratings, and per-stylist accuracy scorecards.
- **FR24:** Consumer can view per-stylist texture certifications on the salon profile.
- **FR25:** Consumer can initiate a booking handoff from a salon profile that opens the salon's booking flow with the color preference, lighting preset, and brand preference preserved as context.
- **FR26:** System records the consumer's pre-booking context (color, lighting, brand) in the deep-link handoff and emits an attribution token recoverable by the salon's confirmation webhook.

**Stylist Workflow & In-Chair Tools**

- **FR27:** Stylist can access a consumer's saved-look context via a web link delivered in the salon's appointment calendar.
- **FR28:** Stylist can view the consumer's pre-booking context (color, lighting, fade-stage selection, brand preference) on a chair-side device.
- **FR29:** Stylist can submit a review on a consumer's behalf with the consumer's verbal consent captured; the system labels the review as "stylist-assisted submission" for source attribution.
- **FR30:** Stylist can view their own color-specific accuracy aggregated across appointments routed through the app, segmented by hair texture.
- **FR31:** Stylist can view their attributed-booking count for the current month.

**Salon Partner Operations**

- **FR32:** Salon Partner can view a partner dashboard showing total attributed bookings for the current month against the partner's target.
- **FR33:** Salon Partner can view per-stylist scorecards including color-specific accuracy ratings across all three review dimensions.
- **FR34:** Salon Partner can view brand pull-through analytics showing which colors clients are choosing and the implied brand-reorder demand.
- **FR35:** Salon Partner can initiate a one-tap reorder of brand inventory pre-filled from actual usage data via their BSG account.
- **FR36:** Salon Partner can manage color-specific certifications for their salon and stylists.
- **FR37:** Salon Partner can reply publicly to any review on their salon's surface; the salon partner cannot delete or alter reviews.
- **FR38:** System enforces that salon partner ranking position cannot be altered by request to platform operators.

**Editorial Administration**

- **FR39:** Editorial Curator can manage the canonical color taxonomy (create, update, deactivate canonical colors).
- **FR40:** Editorial Curator can manage brand-SKU-to-canonical-color mappings, with full audit logging on every change.
- **FR41:** Editorial Curator can flag colors as specialty-tier (offered by 1-2 brands) with the "1 brand only — unique look" label exposed in consumer surfaces.
- **FR42:** Editorial Curator can review LLM-classified ingested reviews in an audit queue and accept, reject, or edit each classification.
- **FR43:** Editorial Curator can moderate brand replies for ToS compliance only (not for content).
- **FR44:** System surfaces classification false-positive rate as a quality metric available to the Editorial Curator.

**User Identity, Consent & Notifications**

- **FR45:** Consumer can sign in with their Sally Rewards identity (Production V1) or use the app without an account in guest mode (both phases).
- **FR46:** Consumer is prompted for affirmative consent before any photo is processed; consent is re-prompted on every photo upload (no implicit re-consent).
- **FR47:** Consumer can request deletion of all photos and associated personal data from their account settings; deletion propagates to upstream vendors within 30 days.
- **FR48:** System retains consumer photos for at most 30 days unless the consumer explicitly opts to save them to their account.
- **FR49:** Consumer receives a post-booking review prompt via SMS at +24 hours, email at +7 days, and an in-app banner on their next visit.
- **FR50:** Consumer can earn Sally Rewards points for verified post-booking reviews submitted with photos.

### NonFunctional Requirements

**Performance**

- **NFR1:** Hair segmentation + recoloring completes within 500ms on demo laptop (MacBook Pro 14"+ class) and within 800ms on demo mobile (iPhone 14 Pro / Pixel 7+ class). Production V1 target: 400ms regardless of device class.
- **NFR2:** Fade simulator slider scrub maintains 60fps (≤16ms per frame) on target hardware in both phases.
- **NFR3:** Multi-lighting toggle response ≤100ms perceived (post-processing chain pre-computed and cached per color).
- **NFR4:** Color browse navigation between colors completes ≤200ms render swap.
- **NFR5:** Initial application load (cold cache) ≤3s on demo hardware; ≤2.5s on median 4G mobile in Production V1 (Web Vitals LCP green).
- **NFR6:** Partner dashboard initial load ≤2s with current month's data.
- **NFR7:** Editorial admin audit queue renders 50 items ≤1s.
- **NFR8:** Initial JavaScript bundle ≤300KB gzipped (excluding ML models) in Demo V1; ≤250KB gzipped in Production V1.

**Security**

- **NFR9:** Consumer photos are processed on-device by default. If server-side processing is enabled in Production V1 as a fallback path, photos are encrypted in transit (TLS 1.3) and at rest (AES-256), and deleted within 30 days.
- **NFR10:** All actor-specific surfaces (Stylist, Salon Partner, Editorial Curator) require authentication and enforce role-based access controls. Cross-actor data access is rejected at the API boundary, not at the UI layer.
- **NFR11:** Attribution tokens are cryptographically signed and unforgeable. Tampering with attribution data invalidates the token at the webhook receiver.
- **NFR12:** All data in transit between consumer browser and Production V1 servers uses TLS 1.3 minimum.
- **NFR13:** Consent records (consumer consent for photo processing, stylist verbal-consent capture for in-chair review submission) are timestamped, immutable, and audit-logged.
- **NFR14 (Production V1):** Signed Data Processing Agreement (DPA) with the AR SDK vendor is in place before any real user photo touches production. Vendor contractually agrees to no third-party sharing, no model training without opt-in, deletion on request within 30 days, and 72-hour breach notification.
- **NFR15 (Production V1):** Legal counsel reviews and approves BIPA / TX CUBI / GDPR consent flow language before any real user uploads a photo. Pre-Production Compliance Gate is passed in full.
- **NFR16 (Demo V1):** Demo runtime processes only team-provided or curated stock photos. No real user data, no external telemetry, no external API calls during the meeting-room walkthrough.

**Scalability**

- **NFR17:** Production V1 supports 5,000 weekly active users in DFW launch geography by Week 4 post-launch with no degradation against the performance NFRs.
- **NFR18:** Architecture supports horizontal scale-out for the consumer-facing AR rendering, salon search, and review surfaces.
- **NFR19:** Geographic expansion (DFW → Atlanta → additional metros) does not require codebase changes, only deployment configuration.
- **NFR20:** Color taxonomy expansion from 30 V1 colors to ≥200 colors is supported without re-architecture; the canonicalization table is data, not code.
- **NFR21:** Native review submission throughput supports ≥25% of post-booking events (~10K reviews/month) without queue backlogs.

**Accessibility**

- **NFR22:** Both Demo V1 and Production V1 meet WCAG 2.2 AA conformance across all consumer, stylist, salon-partner, and editorial-admin surfaces.
- **NFR23:** Automated accessibility testing (axe-core or Pa11y) runs on every CI build. Manual screen-reader walkthrough (VoiceOver / NVDA) of all 5 user journeys is required before each exec demo and before each Production V1 release.
- **NFR24:** Reduced-motion preference (`prefers-reduced-motion`) is honored across all animations including fade simulator transitions and lighting-toggle changes; static fallback views are available.

**Integration**

- **NFR25:** Every external integration (AR SDK, Sally Rewards SSO, BSG product-pull, salon booking webhooks, Google Places, Twilio SMS, SendGrid email, calendar) is wrapped in a provider-pattern abstraction with both a mock implementation (used in Demo V1) and a real implementation (used in Production V1 post-funding).
- **NFR26:** The demo→production transition for any single integration is a provider-swap configuration change, not a code change in business logic.
- **NFR27 (Production V1):** Salon webhook integration is gated as a V1-partner qualifier: a salon that cannot return a confirmed-booking webhook with attribution token intact does not qualify for Production V1.
- **NFR28 (Production V1):** Google Places API usage operates under a hard monthly cost cap with circuit-breaker degradation to cached-only mode rather than uncapped spend.

**Reliability**

- **NFR29 (Demo V1):** Live exec walkthrough completes 100% of claimed-live journey steps without failure on the demo hardware. Pre-meeting dry runs verify the full Playwright E2E suite passes on the actual demo laptop, mobile, and tablet hardware in the meeting room before the exec session.
- **NFR30 (Demo V1):** Demo runtime requires zero external API calls during the meeting. All data loads from local fixtures so meeting-room WiFi instability cannot cause demo failure.
- **NFR31 (Production V1):** Uptime ≥99.5% for consumer-facing surfaces; ≥99.0% for partner dashboard and editorial admin.
- **NFR32 (Production V1):** Attribution chain coverage ≥70% on deep-link + webhook and ≥60% on BSG product-pull join, measured monthly.
- **NFR33 (Production V1):** Booking-webhook receiver is idempotent on attribution token (tolerates duplicate webhook deliveries) and tolerates out-of-order delivery within a 24-hour window.
- **NFR34 (Production V1):** Post-booking trigger sequence (SMS +24h, email +7d, in-app banner) tolerates upstream provider outages with retry logic and at-most-once delivery semantics per channel per booking.

**Maintainability & Codebase Architecture**

- **NFR35:** Single codebase serves both Demo V1 and Production V1; no fork.
- **NFR36:** Provider-pattern abstractions (`ARProvider`, `ReviewProvider`, `AuthProvider`, `AttributionProvider`, `NotificationProvider`, `BookingHandoffProvider`, `SalonProvider`, `BSGProvider`, `CalendarProvider`) define stable interfaces that both mock and real implementations satisfy.
- **NFR37:** Adding a new external integration follows the same pattern: define provider interface, ship mock implementation, swap to real implementation post-procurement.
- **NFR38:** TypeScript strict mode enforced across the codebase; no implicit `any`, no unchecked casts at provider boundaries.
- **NFR39:** Unit test coverage ≥70% for business logic. E2E test coverage covers all 5 user journey paths as smoke tests on every CI build.

**Observability**

- **NFR40 (Production V1):** The #1 success metric (salon-attributed bookings per partner per month) is instrumented with end-to-end visibility from try-on session → deep-link click → webhook receipt → BSG product-pull join → POS reconciliation.
- **NFR41 (Production V1):** All Production V1 kill-criteria thresholds have alerting dashboards visible to PM and leadership.
- **NFR42 (Production V1):** Texture-diversity metric (≥30% non-Type-1/2 in user base) is instrumented in a privacy-aware manner.
- **NFR43 (Demo V1):** Local logging during demo runtime is sufficient for post-demo debugging. No telemetry is sent externally.

### Additional Requirements

Architecture-derived requirements that affect implementation. See `architecture.md` for the full rationale; these are the implementation-relevant facts.

- **AR1:** Use `create-next-app@latest` (Next.js 16.2 App Router, TypeScript strict, Tailwind v4, ESLint, src dir, Turbopack, pnpm) + `shadcn@latest init --base radix` as the project starter. Initialization is the first implementation story.
- **AR2:** Define 9 provider interfaces in `src/lib/providers/contracts/` — `ARProvider`, `ReviewProvider`, `AuthProvider`, `AttributionProvider`, `NotificationProvider`, `BookingHandoffProvider`, `SalonProvider`, `BSGProvider`, `CalendarProvider` — each with a `Mock*Provider` (Demo V1) and a Production V1 implementation.
- **AR3:** Provider DI mechanism is a hybrid factory + React Context: factory in `src/lib/providers/index.ts` driven by `NEXT_PUBLIC_PROVIDER_MODE` env var (`mock` | `production`), exposed via `<ProvidersContext>` at the root layout, consumed in Client Components via `useProvider("ar" | "reviews" | …)` hook; Server Components import providers directly.
- **AR4:** ESLint `no-restricted-imports` rule blocks vendor SDK imports (`@mediapipe/*`, Twilio, Sally Rewards, BSG, etc.) outside provider implementation files. Lint failures block CI.
- **AR5:** AR pipeline uses `@mediapipe/tasks-vision` for hair segmentation + WebGL2 fragment shader for HSL/Lab color shift, fade blend, and lighting post-process. MediaPipe model (~3MB) cached in IndexedDB after first session. Canvas 2D fallback when WebGL2 unavailable; `DemoFallbackPath` curated photos when segmentation confidence below threshold.
- **AR6:** State management is a 4-tier model — URL state (Next.js `useSearchParams`) · Server state (TanStack Query v5) · Client UI state (Zustand per-domain stores) · Persistence (IndexedDB via `idb`) · in-memory only (React refs + `Blob` URLs for the active photo). One piece of state lives in exactly one tier.
- **AR7:** Persistence layer in Production V1 is PostgreSQL via Drizzle ORM. In Demo V1, mock providers read JSON fixtures in `src/lib/fixtures/` shaped to the same TypeScript types Drizzle generates from the schema. Schema-design happens during Demo V1.
- **AR8:** Auth in Production V1 is OAuth 2.0 with PKCE for Sally Rewards SSO; signed HTTP-only cookies (HMAC-SHA256, secret rotated quarterly); refresh tokens server-side in Postgres. Authorization is role-based (`Consumer` / `Stylist` / `SalonPartner` / `EditorialCurator`), enforced by `requireRole()` middleware on every Route Handler.
- **AR9:** Attribution tokens are HMAC-SHA256-signed compact tokens carrying `{lookId, color, lighting, brand, salonId, issuedAt, nonce}`. Webhook receiver at `/api/webhooks/booking` verifies HMAC, performs `INSERT booking_event` with `UNIQUE(attribution_nonce)` for idempotency, tolerates 24-hour out-of-order delivery.
- **AR10:** Server-side data access uses Next.js Route Handlers with Zod-validated request/response schemas. Database access is via Drizzle (production) or fixture readers (demo). Route Handlers do not exceed ~150 lines; business logic lives in `src/lib/`.
- **AR11:** Telemetry seam is `src/lib/observability/track(event, payload)` + exporters in `src/lib/observability/exporters.ts`. Demo V1 logs locally only (NFR43); Production V1 wires OTel exporters to Sally-chosen vendor.
- **AR12:** CI pipeline gates (every PR + main): typecheck, ESLint, Vitest (≥70% coverage on `lib/`), Playwright (5-journey + keyboard-only suites), bundle-size assertion (≤300KB gzipped excluding `@mediapipe`), Lighthouse, axe-core, Chromatic visual regression, Storybook story coverage check.
- **AR13:** Test colocation is enforced — every `Foo.tsx` ships with `Foo.test.tsx` + `Foo.stories.tsx` in the same directory. E2E tests live in `e2e/` at the repo root (Playwright convention).
- **AR14:** Demo V1 runtime is local-only — no cloud dependency, no external API calls during exec walkthrough (NFR16, NFR30). Production V1 deploys via Docker to chosen cloud (AWS Fargate / GCP Cloud Run / Azure Container Apps), DFW-region for CUBI residency; Drizzle migrations run as pre-deploy job; secrets via cloud secret manager.
- **AR15:** Single codebase no fork (NFR35); demo→production transition is provider-implementation swap + env-var change, not a code change in business logic. No demo-only UI elements anywhere in `src/components/*`.

### UX Design Requirements

UX spec-derived requirements that the component library and surface compositions must satisfy. Each is specific enough to ground a story with testable acceptance criteria.

- **UX-DR1:** Implement OKLCH design token system in `tailwind.config.ts` covering neutral foundation (`bg-base`/`bg-elevated`/`bg-sunken`/`border-subtle`/`border-strong`/`text-primary`/`text-secondary`/`text-tertiary`), single restrained accent (`accent-primary`/`accent-primary-hover`/`accent-subtle`), semantic states (`success`/`warning`/`error`), source-attribution chip colors (Google / brand-published / SB user / stylist-assisted), 4-size type scale (`text-xs`/`text-base`/`text-lg`/`text-xl`/`text-display`) with 3 weight tokens (400/500/600 only), 4px-base spacing scale, and motion tokens (durations 150-300ms, eased curves only — no spring physics).
- **UX-DR2:** Build foundation primitive wrappers in `src/components/ui/*` — Button (custom; verb-driven copy enforced via prop docs), Dialog, AlertDialog, Popover, Select, Slider, Toast, Tabs, ToggleGroup/Toggle, Tooltip, Form/Label/Input/Textarea/Checkbox/RadioGroup, Switch, Separator, ScrollArea, Avatar (each Radix-wrapped, Tailwind-styled, source-owned per shadcn pattern). All ship with axe-core unit tests + a11y Storybook addon coverage.
- **UX-DR3:** Build cross-cutting layout components — `PageShell` (consistent page chrome), `AppHeader` (consumer + operator variants), `DensityContainer` (declares `density-comfortable` for consumers / `density-compact` for operators at the layout level via Tailwind variants — descendants read density from CSS variable, never via prop), `HonestEmptyState` (requires explicit `copy` prop, no default fallback), `ToastWithProvenance` (extension of base Toast for state-change confirmations carrying provenance hint).
- **UX-DR4:** Build `src/components/render/*` AR surface components — `PhotoUploader` (drag-drop or click; client-side image + face validation via MediaPipe Face Landmarker; explicit "Delete photo" affordance always visible while photo active), `ConsentPrompt` (Dialog, ESC disabled, three-option layout: Process locally only / Process + save / Decline; routes Decline to `DemoFallbackPath`), `ColorRender` (WebGL canvas; equal-weight exit affordances; descriptive `aria-label` updates per render state; confidence-threshold check → fallback), `FadeSimulator` (Radix Slider 0-90 days primary + Select for washes/week 1/2/3/4+; snap points week 2/4/8; 60fps target; live-region announces "Week N, X washes per week"), `LightingToggle` (Radix ToggleGroup three-position Indoor/Daylight/Salon; each preset applies calibrated color-temperature + intensity profile, not a generic filter), `ShareLook` (privacy Switch "Include my face / Show color-only swatch"; clipboard copy + Toast confirmation), `DemoFallbackPath` / `HonestFallback` (3-5 curated photos tagged by texture Type 4A/4B/4C; explicit "We can't confidently render this color on your hair texture" copy).
- **UX-DR5:** Build `src/components/reviews/*` — `ReviewCard` (semantic `<article>`; composes OutcomeMetrics + SourceAttributionLabel + reviewer-attributed swatch + body + BrandReplyAffordance), `OutcomeMetrics` (4 canonical dimensions: fade weeks / accuracy / damage / recommend; each badge opens definitional Popover), `SourceAttributionLabel` (4 variants — Native / Aggregated / Editorial / Salon-attested — color-coded chip + single-letter glyph + label; Popover with longer-form provenance explanation), `TextureFilter` (ToggleGroup Type 1/2/3/4 with sub-types; visible at top of any review surface; selection persists via URL state across navigation), `ReviewSubmissionForm` (Radix Form; multi-step intentional weight; required 4 outcome dimensions + texture + optional photo; identity attribution "self" or "on-behalf-of with consent flag"; inline Public Review Integrity Policy summary), `BrandReplyAffordance` (semantic `<aside>` linked to parent review; visually subordinate; "From [Brand]" attribution).
- **UX-DR6:** Build `src/components/discovery/*` — `ColorGrid` (`role="list"`, dense filterable grid; loading skeletons; honest empty state on no-match), `ColorCard` (`role="listitem"`; canonical color name + reference swatch on calibrated reference scalp tone — never a single brand's photography; tier label; brand count; entire card one tab stop), `SpecialtyTierLabel` ("Specialty Tier — fewer than 3 brands carry this color" chip; only rendered for specialty colors; Popover explainer), `SalonSearch` (ZIP/city + radius + texture-specialty filter + sort; results count announced via live region), `SalonProfile` (composes StylistScorecard instances + salon-attested reviews + BookingHandoff), `StylistScorecard` (consumer variant for "does this stylist work with my texture?" + operator variant for Marcus's per-stylist throughput in density-compact).
- **UX-DR7:** Build `src/components/dashboard/*` operator surfaces — `AttributedBookings` (semantic `<table>` with sortable columns + sort state announcement; time-range filter; aggregate metrics; CSV export), `BSGReorderCard` (product + suggested-quantity from attribution × usage rate + one-click re-order CTA + Toast confirmation), `BrandPullThrough` (color-choice analytics → implied reorder demand), `CertificationManager` (color-specific certifications for salon + stylists, FR36), `ReviewReplyQueue` (FR37 public reply composer; cannot delete or alter reviews), `AuditQueue` (Elena's 90-min/40-item flow: virtualized list with pre-loaded next item; keyboard shortcuts J/K previous-next, A/R/E accept-reject-edit, ?/H help; current focus position announced via live region; honest celebration empty state), `TaxonomyAdmin` (searchable inline-edit color list + bulk re-tier/merge/split + per-change audit trail), `BrandReplyModeration` (ToS-only moderation queue; AlertDialog for rejection with required reason logging), `ClassificationQualityMeter` (NFR44/FR44 false-positive metric display).
- **UX-DR8:** Render surface enforces the **equal-weight exit affordances** pattern — "Find a salon," "Save this look," "Share this look," "Try another color" all rendered as visually equal Secondary-tier buttons in a row, never funneled toward "Find a salon." Codifies the journey principle of "last honest mirror, not flattering filter."
- **UX-DR9:** Implement consistent **3-tier button hierarchy** (Primary / Secondary / Tertiary-link) with verb-driven copy enforcement (no "Submit"/"Continue"/"OK"); 44×44 CSS-pixel touch targets on consumer surfaces, 32×32 acceptable in pro-dense desktop tables; destructive actions are Tertiary visual weight + AlertDialog confirmation (never red-fill primaries). Loading state spinner replaces button text with width preserved (no layout shift); `aria-disabled` for disabled state (never visual-only).
- **UX-DR10:** Implement 5 canonical **feedback patterns** with anti-pattern guardrails — Toast (auto-dismiss 5s, past-tense outcome, no celebration animation, no emoji), Dialog (critical first-time moments only, explicit dismissal), inline error text (red text + icon + `aria-describedby`, recovery-action-specific copy — never "Invalid input" or "Something went wrong"), surface banner (full-width, dismissible, narrate next step), Popover (user-triggered only, never auto-shown).
- **UX-DR11:** **Form patterns** — on-blur validation (never on focus or each keystroke); inline error display via `aria-describedby` (never red background fill, never summary at top); multi-step reserved for `ReviewSubmissionForm` only (max 3 steps; visible step indicator; "Back" preserves entered values; never "Save as draft"); submit button shows spinner with form values preserved; required-field asterisk + leading legend; optional fields unmarked.
- **UX-DR12:** **Navigation patterns** — top-anchored `AppHeader` for consumer surfaces with logo / "Browse colors" / "Find a salon" / utility group (no bottom mobile nav — render needs full viewport); left-anchored persistent sidebar for operator surfaces (Marcus + Elena); breadcrumbs on color browse + salon profile preserving filter state via URL; browser back is canonical (no custom back buttons that conflict with history); skip-to-content link on every page; focus moves to new page's `<h1>` on route change.
- **UX-DR13:** **Accessibility implementation** — WCAG 2.2 AA across all surfaces (NFR22), AAA target on high-priority surfaces (try-on render labels, review submission form, consent prompts, error states); 2px solid `accent-primary` outline + 2px offset on every focusable element (never `outline: none`); `prefers-reduced-motion` honored throughout (fade scrub still functional, transitions removed; lighting toggle becomes instant); render surface `aria-label` updates per state ("Render of warm copper on your hair, daylight preset, week 4 of fade"); fade slider `aria-live` region announces current week + fade state; full keyboard traversal end-to-end of all 5 journeys; Deuteranopia/Protanopia/Tritanopia simulator testing on every primary surface.
- **UX-DR14:** Implement the **hybrid design direction** — Editorial Magazine for consumer surfaces (Maya + Janelle journeys, public color-browse, salon discovery, share-this-look, review submission, post-booking) using `density-comfortable`; Pro Tool / System for operator surfaces (Marcus partner dashboard, Aliyah stylist saved-look view, Elena editorial admin) using `density-compact`. Same component library; differentiation lives only at the layout / density / information-hierarchy layer.
- **UX-DR15:** **Storybook + Chromatic** — every custom component ships with at least one story per state variant; Chromatic visual-regression baselines run in CI; designer-and-engineer collaboration happens in Storybook before any component appears in a page; visual regression catches drift across the demo→production provider swap.
- **UX-DR16:** **Tone enforcement at the component-API level** — `Button` defaults to verb-driven copy in prop documentation; `HonestEmptyState` requires a custom `copy` prop with no fallback (no default "Reviews coming soon" / "Nothing here yet"); `Toast` defaults to past-tense outcome notifications (no celebration emojis or animations); motion utilities wrap Tailwind transitions with named tokens (`motion-calm-fast`, `motion-calm-slow`) to discourage ad-hoc bouncy / spring animations.

### FR Coverage Map

Each FR maps to exactly one epic. NFRs cross-cut all epics (each story ties relevant NFRs into its acceptance criteria). UX-DRs and ARs are foundational and intersect Epic 1 most heavily but inform every epic.

| FR | Epic | Capability |
|---|---|---|
| FR1 | Epic 1 | Photo upload (file picker / drag-drop) |
| FR2 | Epic 1 | Texture-preserving color render |
| FR3 | Epic 1 | 90-day fade simulator with washes/week |
| FR4 | Epic 1 | Three calibrated lighting presets |
| FR5 | Epic 1 | Composite render: texture × lighting × fade-stage |
| FR6 | Epic 1 | Shareable image with embedded salon-routing link |
| FR7 | Epic 1 | Session-only photo retention; opt-in account save |
| FR8 | Epic 2 | Color-first taxonomy browse |
| FR9 | Epic 2 | Outcome-anchored brand ranking per color |
| FR10 | Epic 2 | Outcome metrics per (brand × color × texture) |
| FR11 | Epic 2 | Specialty-tier label ("1 brand only — unique look") |
| FR12 | Epic 2 | ≥3-brand standard-tier enforcement |
| FR13 | Epic 3 | Source-labeled reviews per (brand × color) |
| FR14 | Epic 3 | Texture-typed review filter |
| FR15 | Epic 3 | Native review submission (4 outcome dimensions + texture + photo) |
| FR16 | Epic 3 | Public ranking uses color-outcome only; private dimensions to partners |
| FR17 | Epic 3 | Brand-published review segregation tab |
| FR18 | Epic 3 | Native-review deletion forbidden except ToS |
| FR19 | Epic 3 | Ranking-by-brand-request forbidden |
| FR20 | Epic 3 | Native reviews retained after brand contract terminates |
| FR21 | Epic 3 | Third-party reviews displayed verbatim with attribution |
| FR22 | Epic 4 | Geo + color-aware salon search |
| FR23 | Epic 4 | Salon profile (certifications, accuracy, scorecards) |
| FR24 | Epic 4 | Per-stylist texture certifications on salon profile |
| FR25 | Epic 4 | Booking handoff with preserved context (saved look) |
| FR26 | Epic 4 | Attribution token emission + webhook recoverability |
| FR27 | Epic 5 | Stylist saved-look access via calendar link |
| FR28 | Epic 5 | Chair-side pre-booking context view |
| FR29 | Epic 5 | Stylist-assisted review submission with verbal-consent capture |
| FR30 | Epic 5 | Stylist accuracy aggregated by texture |
| FR31 | Epic 5 | Stylist's monthly attributed-booking count |
| FR32 | Epic 6 | Partner dashboard: monthly attributed bookings vs. target |
| FR33 | Epic 6 | Per-stylist scorecards (3 review dimensions) |
| FR34 | Epic 6 | Brand pull-through analytics |
| FR35 | Epic 6 | One-tap BSG re-order from usage data |
| FR36 | Epic 6 | Color-specific certification management |
| FR37 | Epic 6 | Public review reply (no delete/alter) |
| FR38 | Epic 6 | Ranking immutability against operator request |
| FR39 | Epic 7 | Canonical color taxonomy management |
| FR40 | Epic 7 | Brand-SKU-to-canonical-color mapping with audit log |
| FR41 | Epic 7 | Specialty-tier flagging |
| FR42 | Epic 7 | LLM-classification audit queue (accept/reject/edit) |
| FR43 | Epic 7 | Brand-reply ToS-only moderation |
| FR44 | Epic 7 | Classification false-positive quality metric |
| FR45 | Epic 8 | Sally Rewards SSO (Production V1) + guest mode (both phases) |
| FR46 | Epic 8 | Affirmative consent re-prompted on every photo upload _(consent-prompt UI built in Epic 1; account-level extensions live in Epic 8)_ |
| FR47 | Epic 8 | User-initiated photo + data deletion with 30-day vendor propagation |
| FR48 | Epic 8 | 30-day photo retention default; opt-in indefinite save |
| FR49 | Epic 8 | Post-booking review prompts (SMS +24h, email +7d, in-app banner) |
| FR50 | Epic 8 | Sally Rewards points for verified post-booking reviews |

**Cross-epic dependencies (forward-only — flagged for sequencing in Step 3):**

- **Epic 1 → 8:** `ConsentPrompt` component is built in Epic 1's photo-upload flow (Maya's first story sequence). Epic 8 extends with account-level deletion preferences (FR47), retention controls (FR48), and notification preferences (FR49).
- **Epic 4 → 5:** Saved-look mechanism (FR25, attribution token wrapping look context in deep-link) must exist before Epic 5's stylist calendar-link entry (FR27 reads the same look payload).
- **Epic 4 → 6:** Attribution token emission (FR26) must exist before Epic 6's dashboard reads attributed bookings (FR32). Epic 4 ships the token signer + webhook receiver scaffolding even when Epic 6's read side is still mock-only.
- **Epic 1 → all consumer-facing epics:** Epic 1's first story sequence scaffolds the architectural foundation (provider contracts, factory + `<ProvidersContext>`, design tokens + `/components/ui/*` primitives, MediaPipe spike, CI gates). No separate "Epic 0" — the scaffold lives inside Epic 1 because it's a precondition for the very first user-visible story.
- **Epic 7 → 2 + 3:** Editorial taxonomy + classification surfaces (Elena's tools) write the data that Epic 2 reads (color taxonomy, specialty-tier flags) and Epic 3 reads (LLM-classified ingested reviews). For Demo V1, fixtures pre-populate this so Epic 2 + 3 are demonstrable before Epic 7 ships; for Production V1, Epic 7's writes feed the read sides.

## Epic List

The 8 epics align 1:1 with PRD's capability areas and architecture's `Requirements to Structure Mapping` table. Architecture letters (A-H) are preserved as cross-references; this document uses numeric epic IDs (Epic 1-8) per BMad convention, used as the parent ID for stories below.

### Epic 1: Photo Capture & Try-On Visualization _(Architecture: Epic A)_

Consumer can upload a photo, give explicit consent, see her hair rendered in a chosen color with her texture preserved, scrub a 90-day fade timeline parameterized by washes-per-week, toggle between three calibrated lighting presets, and share the result. This epic is the product's "defining experience" — the interactive try-on triple (color render + fade scrub + lighting toggle) is the visceral exec demo moment and the basis for the entire trust claim against TikTok/Snapchat filter aesthetics.

The epic also delivers the architectural scaffold (provider contracts, factory + `<ProvidersContext>`, design tokens, `/components/ui/*` primitives, MediaPipe Tasks Vision spike, CI pipeline) inside its first story sequence — no separate "Epic 0".

**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7
**Personas served:** Maya (happy path), Janelle (texture edge case via `DemoFallbackPath`)
**Primary providers:** `ARProvider`, plus the foundational infrastructure for all 9 contracts

### Epic 2: Color & Brand Discovery _(Architecture: Epic B)_

Consumer can browse the curated color taxonomy organized by canonical color name (not by brand), see brand options ranked by outcome metrics within any color, view outcome data per (brand × color × texture) tuple, identify specialty-tier colors with the "1 brand only — unique look" label, and trust that any color in the standard taxonomy meets the ≥3-brand coverage rule. The epic delivers the brand-neutral marketplace stance — the "color-first, not brand-first" claim that distinguishes the product from Madison Reed's DTC funnel pattern.

**FRs covered:** FR8, FR9, FR10, FR11, FR12
**Personas served:** Maya, Janelle (Type-4-filtered browse)
**Primary providers:** `EditorialProvider` (taxonomy read), `ReviewProvider` (outcome metrics)

### Epic 3: Outcome Reviews & Source Attribution _(Architecture: Epic C)_

Consumer can view source-labeled reviews for any (brand × color) cell, filter reviews by hair texture (Type 1-4 with sub-types), and submit native post-booking reviews across the four outcome dimensions (color outcome, fade weeks, damage, would-recommend). The epic enforces the Public Review Integrity Policy — public rankings use the color-outcome dimension only; brand-published reviews are visually segregated; native reviews cannot be deleted at brand request; rankings cannot be adjusted by brand request; third-party ingested reviews display verbatim with attribution.

**FRs covered:** FR13, FR14, FR15, FR16, FR17, FR18, FR19, FR20, FR21
**Personas served:** Maya (read + submit post-booking), Janelle (texture-filtered read)
**Primary providers:** `ReviewProvider`

### Epic 4: Salon Discovery & Booking Handoff _(Architecture: Epic D)_

Consumer can search salons by location and color offering, view salon profiles (color certifications, accuracy ratings, per-stylist scorecards with texture certifications), and initiate a booking handoff that preserves her color / lighting / brand context across the deep-link with an attribution token recoverable by the salon's confirmation webhook. This epic delivers the demo→production attribution chain that powers the #1 success metric (salon-attributed bookings per partner per month, NFR40).

**FRs covered:** FR22, FR23, FR24, FR25, FR26
**Personas served:** Maya (primary), Janelle (texture-aware search)
**Primary providers:** `SalonProvider`, `BookingHandoffProvider`, `AttributionProvider`

### Epic 5: Stylist Workflow & In-Chair Tools _(Architecture: Epic E)_

Stylist accesses a consumer's saved-look context via a calendar-delivered web link, views the pre-booking context (color, lighting, fade-stage, brand) on a chair-side device (iPad landscape optimized), submits a review on the consumer's behalf with verbal consent captured, and views her own color-specific accuracy aggregated across appointments routed through the app (segmented by texture) plus her monthly attributed-booking count. This epic is Aliyah's surface — the in-chair amplifier that turns the platform into a stylist's competitive moat.

**FRs covered:** FR27, FR28, FR29, FR30, FR31
**Personas served:** Aliyah (primary)
**Primary providers:** `CalendarProvider`, `ReviewProvider` (submit-on-behalf), `AuthProvider` (Stylist role), `AttributionProvider` (read-only)

### Epic 6: Salon Partner Operations _(Architecture: Epic F)_

Salon Partner views a partner dashboard showing monthly attributed bookings against target, per-stylist scorecards across all three review dimensions (private to operator), brand pull-through analytics, and a one-tap BSG re-order CTA pre-filled from actual usage. Partner manages color-specific certifications for the salon and stylists, replies publicly to reviews (without deleting or altering them), and operates under the platform's ranking-immutability commitment (no positional changes by request). This is Marcus's Monday-morning surface — desktop-native, density-compact.

**FRs covered:** FR32, FR33, FR34, FR35, FR36, FR37, FR38
**Personas served:** Marcus (primary)
**Primary providers:** `AttributionProvider`, `BSGProvider`, `ReviewProvider` (reply), `AuthProvider` (SalonPartner role)

### Epic 7: Editorial Administration _(Architecture: Epic G)_

Editorial Curator manages the canonical color taxonomy (create/update/deactivate), brand-SKU-to-canonical-color mappings with full audit logging, specialty-tier flagging, the LLM-classification audit queue (40+ items in 90 minutes via keyboard-driven J/K/A/R/E shortcuts), and brand-reply ToS-only moderation. The epic also surfaces the classification false-positive rate as a quality metric. This is Elena's surface — desktop-native, density-compact, keyboard-first for the audit-queue workflow.

**FRs covered:** FR39, FR40, FR41, FR42, FR43, FR44
**Personas served:** Elena (primary)
**Primary providers:** `EditorialProvider` (write side), `AuthProvider` (EditorialCurator role)

### Epic 8: User Identity, Consent & Notifications _(Architecture: Epic H)_

Consumer can sign in with Sally Rewards (Production V1) or use the app in guest mode (both phases), receives explicit re-prompted consent before any photo is processed, requests deletion of all photos and personal data (with 30-day vendor propagation), benefits from default 30-day retention with opt-in indefinite save, receives post-booking review prompts (SMS +24h, email +7d, in-app banner on next visit), and earns Sally Rewards points for verified post-booking reviews submitted with photos. This epic delivers the BIPA / TX CUBI / GDPR compliance backbone (timestamped immutable consent records, audit-logged) plus the loyalty integration that converts post-booking reviewers into repeat customers.

**FRs covered:** FR45, FR46, FR47, FR48, FR49, FR50
**Personas served:** Maya (primary), all consumer-facing personas
**Primary providers:** `AuthProvider`, `NotificationProvider`, plus consumer-side delete API extending the consent state machine



---

## Epic 1: Photo Capture & Try-On Visualization

Consumer can upload a photo, give explicit consent, see her hair rendered in a chosen color with her texture preserved, scrub a 90-day fade timeline, toggle between calibrated lighting presets, and share the result. The epic also delivers the architectural scaffold — provider contracts, factory + `<ProvidersContext>`, design tokens + `/components/ui/*` primitives, MediaPipe Tasks Vision spike, and the CI pipeline — inside its first story sequence.

### Story 1.1: Initialize Next.js + shadcn project scaffold with CI gates

As a developer on the team,
I want the project scaffolded with Next.js 16.2, shadcn/Radix, the full tooling chain, and CI gates wired,
So that every subsequent story builds on the locked stack from `architecture.md` step 3 with no scaffold-drift.

**Acceptance Criteria:**

**Given** a fresh empty directory and the architect's initialization commands documented in `architecture.md` step 3,
**When** the developer runs `pnpm create next-app@latest sb-tryon` with the documented flags (`--typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --turbopack`) followed by `pnpm dlx shadcn@latest init --base radix --template next-app --yes`,
**Then** the repo contains `next.config.ts`, `tsconfig.json` with strict mode, `tailwind.config.ts`, `eslint.config.mjs`, `components.json`, `.env.example`, `.nvmrc` (Node 20 LTS), `Dockerfile`, `docker-compose.yml`, and `src/app/{globals.css,layout.tsx,page.tsx,error.tsx,not-found.tsx}` per `architecture.md` §6.

**And** the foundational dev/runtime dependencies are installed exactly per the architect's command list — `zustand`, `@tanstack/react-query`, `@tanstack/react-query-devtools`, `vitest`, `@vitest/ui`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@playwright/test`, `axe-core`, `@axe-core/playwright`, `@storybook/nextjs`, `@storybook/addon-a11y`, `@storybook/addon-essentials`, `@storybook/test`, `@chromatic-com/storybook` (NFR38, AR1).

**And** Playwright is initialized via `pnpm dlx playwright install --with-deps chromium webkit firefox` and Storybook via `pnpm dlx storybook@latest init --type nextjs --yes`.

**Given** the CI pipeline is required by NFR23, NFR39, and AR12,
**When** the developer authors `.github/workflows/ci.yml` and `.github/workflows/chromatic.yml`,
**Then** the CI workflow runs (in this order) `pnpm typecheck`, `pnpm lint`, `pnpm test:unit` (Vitest with ≥70% coverage threshold on `src/lib/`), `pnpm test:e2e` (Playwright with `e2e/maya.spec.ts`, `e2e/janelle.spec.ts`, `e2e/aliyah.spec.ts`, `e2e/marcus.spec.ts`, `e2e/elena.spec.ts`, `e2e/keyboard-only.spec.ts`, `e2e/consent-flow.spec.ts`, `e2e/attribution-token.spec.ts`), bundle-size assertion (≤300KB gzipped excluding `@mediapipe/*`), Lighthouse against `lighthouserc.cjs` budgets, and Storybook story-coverage check.

**And** the Chromatic workflow runs visual-regression on every PR.

**Given** AGENTS.md / CLAUDE.md are required to mirror `architecture.md` §5 patterns,
**When** the developer authors them at the repo root,
**Then** they document the naming patterns (kebab-case files, PascalCase components, camelCase identifiers), structure patterns (`src/app/`/`src/components/`/`src/lib/` boundary; `app/` route files ≤150 lines), and the provider-import-restriction rule from architecture.

**And** `pnpm dev`, `pnpm storybook`, `pnpm build`, `pnpm test:unit`, `pnpm test:e2e` all execute without error against the empty scaffold.

### Story 1.2: Define 9 provider contracts + factory + ProvidersContext + ESLint enforcement

As a developer wiring future feature stories,
I want the 9 provider interfaces defined, the env-var-driven factory, the `<ProvidersContext>` provider, and the `useProvider()` hook in place — plus the ESLint rule that blocks vendor SDK imports outside provider implementations,
So that every subsequent story binds to provider abstractions and the demo→production swap stays a config change (NFR25, NFR26, NFR35-37, AR2-4).

**Acceptance Criteria:**

**Given** the 9 provider interfaces named in `architecture.md` step 4 (`ARProvider`, `ReviewProvider`, `AuthProvider`, `AttributionProvider`, `NotificationProvider`, `BookingHandoffProvider`, `SalonProvider`, `BSGProvider`, `CalendarProvider`) plus `EditorialProvider`,
**When** the developer creates `src/lib/providers/contracts/{ar-provider.ts,review-provider.ts,auth-provider.ts,attribution-provider.ts,notification-provider.ts,booking-handoff-provider.ts,salon-provider.ts,bsg-provider.ts,calendar-provider.ts,editorial-provider.ts}`,
**Then** each file exports a TypeScript `interface` with method signatures specified by their consumer epic (ARProvider: `prewarm()`, `segment(image)`, `dispose()`; ReviewProvider: `list(filters)`, `get(id)`, `submit(payload)`, `reply(reviewId, body)`; AuthProvider: `getCurrentUser()`, `login()`, `logout()`, `requireRole(role)`; AttributionProvider: `issueToken(payload)`, `verifyToken(token)`, `getAttributionForPartner(partnerId, range)`; etc.) and **no concrete vendor types are imported** in any contract file.

**And** every interface method is `async` (returns `Promise<T>`) so callers don't know whether they hit a Server Component, Route Handler, or in-memory mock.

**Given** the factory mechanism specified in `architecture.md` step 4,
**When** the developer creates `src/lib/providers/factory.ts`,
**Then** it exports a `createProviders()` function that reads `NEXT_PUBLIC_PROVIDER_MODE` (`"mock"` | `"production"`) plus per-provider override env vars (e.g. `NEXT_PUBLIC_AR_PROVIDER`) and returns `{ ar, reviews, auth, attribution, notification, bookingHandoff, salon, bsg, calendar, editorial }` typed against the contract interfaces.

**And** `src/lib/providers/context.tsx` exports `<ProvidersContext>` (a React Context) and `useProvider("ar" | "reviews" | …)` typed strictly so `useProvider("ar")` returns `ARProvider` (no `any` casts).

**And** `src/lib/providers/index.ts` re-exports the contracts and the factory for Server Component use, and `src/app/layout.tsx` wraps `{children}` in `<ProvidersContext.Provider value={createProviders()}>`.

**Given** the `no-restricted-imports` ESLint rule per AR4,
**When** the developer adds the rule to `eslint.config.mjs`,
**Then** any file under `src/components/**`, `src/app/**`, or `src/lib/!(providers)/**` that imports from `@mediapipe/*`, `twilio`, `@sendgrid/*`, `@supabase/*`, BSG SDK packages, or any other listed vendor package fails lint with the message "Import providers via `@/lib/providers` — vendor SDKs are isolated to `src/lib/providers/{mock,production}/*`."

**And** the Vitest contract test in `src/lib/providers/contracts/index.test.ts` verifies that every contract exports an interface (no class, no concrete impl) and verifies that `createProviders()` returns objects matching every interface.

### Story 1.3: Implement OKLCH design tokens + foundation primitives + Storybook + axe-core

As a developer building any UI surface,
I want the OKLCH design token system in `tailwind.config.ts`, the full set of `/components/ui/*` Radix-wrapped primitives, Storybook scaffolding, and axe-core integrated into Vitest,
So that every subsequent component story inherits WCAG 2.2 AA structural correctness, the locked tone (UX-DR1, UX-DR2, UX-DR16), and density variants (UX-DR3) without retrofitting.

**Acceptance Criteria:**

**Given** UX spec §8 design token tables (neutrals, accent, semantic, source-attribution chips, 4-size type scale, 3-weight scale, 4px spacing scale, motion tokens, density variants),
**When** the developer authors `tailwind.config.ts` and `src/styles/globals.css` (or `src/app/globals.css`),
**Then** every token from UX-DR1 is declared as a Tailwind theme token in OKLCH (`bg-base oklch(0.99 0.005 90)`, `accent-primary oklch(0.55 0.12 45)`, `success oklch(0.45 0.10 145)`, etc.), the type scale is `text-xs`/`text-base`/`text-lg`/`text-xl`/`text-display` with the documented sizes, the spacing scale is `space-1` through `space-32`, motion durations are 150-300ms with `cubic-bezier(0.4, 0, 0.2, 1)`, and `density-comfortable`/`density-compact` are Tailwind variants applied at the layout container level.

**Given** UX-DR2's foundation primitive list,
**When** the developer adds shadcn-pattern Radix-wrapped components,
**Then** `src/components/ui/{button,dialog,alert-dialog,popover,select,slider,toast,tabs,toggle-group,tooltip,form,label,input,textarea,checkbox,radio-group,switch,separator,scroll-area,avatar}.tsx` each exist with Radix imports, Tailwind styling using the new tokens, and a colocated `*.test.tsx` and `*.stories.tsx` per AR13.

**And** `src/components/ui/button.tsx` enforces verb-driven copy via prop documentation (TSDoc on the `children` prop describes the rule) and exposes `variant: "primary" | "secondary" | "tertiary" | "destructive"` (UX-DR9) with focus styles using `outline: 2px solid var(--accent-primary); outline-offset: 2px;` (never `outline: none`).

**Given** Storybook is required for design surface collaboration (UX-DR15),
**When** the developer authors `.storybook/main.ts` and `.storybook/preview.ts`,
**Then** Storybook loads Tailwind globals, wraps every story in `<ProvidersContext.Provider value={createMockProviders()}>`, registers the a11y addon, and the story glob is `**/*.stories.tsx`.

**And** Vitest's `vitest.config.ts` registers `@axe-core/react` setup so every `<Component />` rendered in a `.test.tsx` file under `src/components/**` is automatically passed through `expect(axe(container)).toHaveNoViolations()` via a setup file.

**And** Storybook's a11y addon flags any violation in any story as a CI failure (NFR23).

### Story 1.4: Build cross-cutting layout shells (PageShell, AppHeader, DensityContainer, HonestEmptyState, ToastWithProvenance, SkipToContent)

As a developer composing any page,
I want the cross-cutting layout primitives — page shell, headers (consumer + operator variants), density container, honest empty state, provenance-aware toast, and skip-to-content link,
So that every page surface inherits consistent chrome, density, accessibility (skip link, focus on `<h1>` on route change), and tone enforcement (UX-DR3, UX-DR12, UX-DR16, NFR22).

**Acceptance Criteria:**

**Given** UX-DR3 cross-cutting layout component list,
**When** the developer creates `src/components/layout/{PageShell,AppHeader,DensityContainer,HonestEmptyState,ToastWithProvenance,SkipToContent,ErrorBanner}.tsx` with colocated tests + stories,
**Then** `<PageShell>` renders a header / main / footer scaffold with `<SkipToContent>` as the first focusable element and moves focus to the new page's `<h1>` on route change (UX-DR12, NFR22).

**And** `<AppHeader variant="consumer">` renders the consumer top-anchored header (logo / "Browse colors" / "Find a salon" / utility group with "Saved looks" + "Sign in/account") and `<AppHeader variant="operator">` renders the operator-side persistent left sidebar (sections vary by role; declared via the `sections` prop).

**And** `<DensityContainer density="comfortable" | "compact">` applies the corresponding Tailwind variant to all descendants via a CSS variable + `data-density` attribute. Components do **not** accept `density` props directly — they read it from the cascade (UX-DR3).

**And** `<HonestEmptyState>` accepts a **required** `copy` prop with no default fallback; rendering it without `copy` produces a TypeScript compile error and a runtime invariant violation in dev (UX-DR16).

**And** `<ToastWithProvenance>` extends the base Toast to include a `provenance` prop (e.g., `"stored locally only"`) that renders as subdued italic suffix text after the past-tense outcome message.

**And** the keyboard-only Playwright test `e2e/keyboard-only.spec.ts` confirms tab order through every PageShell route lands on SkipToContent first, then `<h1>`, then primary nav.

### Story 1.5: Implement MediaPipe Tasks Vision MockARProvider + segmentation pipeline

As a developer building the AR render surface,
I want `MockARProvider` implemented against `@mediapipe/tasks-vision` for hair segmentation plus the `src/lib/ar/*` pure-math modules for HSL/Lab color shift, fade blend, and lighting post-process,
So that Story 1.7 (ColorRender) has a working `ARProvider.segment()` to render against, and the binary trust gate for Janelle's flow (Type-4 segmentation acceptance) is feasibility-validated before the rest of Epic 1 builds (AR5, NFR1, architecture handoff step 5).

**Acceptance Criteria:**

**Given** the AR pipeline decision in `architecture.md` step 4,
**When** the developer creates `src/lib/providers/mock/MockARProvider.ts`,
**Then** it implements the `ARProvider` contract by using `ImageSegmenter` from `@mediapipe/tasks-vision` to return a category-1 alpha mask from an `ImageBitmap`, exposes `prewarm()` that fetches the ~3MB model and caches it via `src/lib/persistence/model-cache.ts` in IndexedDB (so subsequent sessions skip the network).

**And** `src/lib/ar/{color-shift.ts,color-shift.glsl.ts,fade-blend.ts,lighting-postprocess.ts,canvas-2d-fallback.ts,webgl-context.ts}` exist with pure functions that:
- `color-shift.ts` converts RGB → HSL/Lab and applies a target color vector (porosity-aware adjustment for Type-4 hair declared as a parameter, not hardcoded)
- `color-shift.glsl.ts` exports the WebGL2 fragment shader source as a template literal
- `fade-blend.ts` interpolates `colorVec(week=0)` to `colorVec(week=12)` parameterized by washes-per-week
- `lighting-postprocess.ts` exposes 3 calibrated post-process functions (indoor / daylight / salon — color-temperature shift + white-balance offset + gamma curve per UX spec FR4)
- `canvas-2d-fallback.ts` exposes a Canvas 2D compositor used when WebGL2 is unavailable (NFR1 fallback path)
- `webgl-context.ts` detects WebGL2 capability and returns either a context or `null`

**And** `MockARProvider.segment()` measures end-to-end latency and emits a `tryon.segmentation_completed` telemetry event with `{durationMs, deviceClass}` via `src/lib/observability/track.ts` so NFR1 (≤500ms laptop / ≤800ms mobile) is verifiable from logs.

**And** a Vitest contract test in `MockARProvider.test.ts` validates that `prewarm()` is idempotent (called twice → only one model load) and that `segment()` rejects with a typed error when the input has no detected hair region.

**And** the Playwright `e2e/janelle.spec.ts` test stub asserts that segmentation runs without error on at least one Type-4 fixture photo from `e2e/fixtures/photos/` (acceptance bar; full Type-4 quality validation is in Story 1.13 with `DemoFallbackPath`).

### Story 1.6: Build PhotoUploader + ConsentPrompt with consent state machine

As Maya the consumer,
I want to upload a photo via drag-drop or click and provide explicit consent before my photo is processed (re-prompted every upload),
So that I trust this is a salon-grade tool that respects my biometric data, not a surveillance app (FR1, FR46, NFR13, UX-DR4, cross-cutting concern #2).

**Acceptance Criteria:**

**Given** UX-DR4's PhotoUploader spec,
**When** the developer creates `src/components/render/PhotoUploader.tsx` with colocated tests + stories,
**Then** the component supports drag-drop and click-to-upload via a labeled `<input type="file">`, performs client-side validation (image type + size), runs MediaPipe Face Landmarker to confirm a face is detected, displays states: `empty` (default with copy "Upload a clear front-facing photo, even lighting"), `uploading`, `validating`, `validated`, `error` (with specific message: "We couldn't find a face — try a brighter, front-facing photo"), and a "Delete photo" affordance that's always visible while a photo is active.

**And** error states are announced via `aria-live="polite"` and the keyboard upload path lands on the `<input type="file">` with a visible focus ring (UX-DR13).

**Given** UX-DR4's ConsentPrompt spec and FR46 ("re-prompted every photo upload, no implicit re-consent"),
**When** the developer creates `src/components/render/ConsentPrompt.tsx`,
**Then** it renders as a Radix Dialog with **ESC disabled**, three options ("Process locally only — default selected" / "Process + save to my account" / "Decline"), three-option layout with screen-reader announcement of all options + descriptions, and **does not return** until an explicit choice is made.

**And** "Decline" routes to `src/components/render/DemoFallbackPath.tsx` rather than the AR render surface (Story 1.13 implements DemoFallbackPath).

**And** the consent state machine in `src/lib/security/consent-state.ts` transitions from `not-consented` → `consented-local` | `consented-saved` | `declined` and refuses to transition back to a prior consent without a new explicit prompt (no implicit re-consent).

**And** `src/lib/stores/consent.ts` (Zustand) is wired to consume the state machine and exposes `consentStatus`, `lastPromptedAt`, `consentVersion`.

**And** every consent grant POSTs to `/api/consent/grant` (added in Story 8.2 for production audit logging; for Demo V1 a stub Route Handler exists that logs to `console`).

**Given** the e2e contract `e2e/consent-flow.spec.ts`,
**When** the user uploads a first photo, completes the prompt, then uploads a second photo within the same session,
**Then** the prompt is re-displayed for the second upload (FR46 acceptance criterion).

### Story 1.7: Build ColorRender component (texture-preserving WebGL2 color render)

As Maya the consumer,
I want to see my hair rendered in a selected color with my texture preserved (curl pattern, porosity, individual coil structure),
So that I can trust what I'm seeing is what I'd actually look like — not an idealized straight-hair model with my face pasted on (FR2, NFR1, UX-DR4).

**Acceptance Criteria:**

**Given** UX-DR4's ColorRender spec and the AR pipeline modules from Story 1.5,
**When** the developer creates `src/components/render/ColorRender.tsx` with colocated tests + stories,
**Then** it renders a `<canvas>` element where `MockARProvider.segment()` produces the alpha mask, the `src/lib/ar/color-shift.glsl.ts` WebGL2 fragment shader applies the HSL/Lab color shift only on segmented hair pixels, and texture (luminance variations within the mask) is preserved by shifting hue + chroma rather than replacing pixel values.

**And** the canvas exposes a descriptive `aria-label` that updates per render state — e.g., "Render of warm copper on your hair, indoor lighting, week 0" (UX-DR13).

**And** the component reads target color from URL state (`?color=auburn`) via `src/lib/url-state/try-on-params.ts` (AR6 — URL-state tier).

**And** when WebGL2 is unavailable, the component uses `src/lib/ar/canvas-2d-fallback.ts` with reduced color-shift fidelity (HSL only).

**And** if `MockARProvider.segment()` returns confidence below threshold (declared as a constant in `src/lib/ar/color-shift.ts`), the component renders `<RenderConfidenceBanner>` ("We can't confidently render this color on your hair texture — here's what it looks like on a Type-4 model with similar undertones") and routes the user to `<DemoFallbackPath>` (Story 1.13).

**And** the per-render latency is measured and emitted as `tryon.render_completed` telemetry with `{durationMs}`; the Vitest test asserts the synthetic budget of ≤500ms on a known-good fixture (NFR1).

**And** every overlay control (FadeSimulator, LightingToggle, ShareLook, equal-weight exit affordances) is keyboard-reachable via the canvas's tab order.

### Story 1.8: Build FadeSimulator (90-day fade timeline with washes/week)

As Maya the consumer,
I want to scrub a 90-day fade simulator timeline parameterized by washes-per-week,
So that I see the visceral truth of what this color looks like at week 8 (the moment that converts skeptics) (FR3, NFR2, UX-DR4).

**Acceptance Criteria:**

**Given** UX-DR4's FadeSimulator spec,
**When** the developer creates `src/components/render/FadeSimulator.tsx` with colocated tests + stories,
**Then** the component composes a Radix Slider (0-90 days primary) plus a Radix Select for washes/week (1, 2, 3, 4+), invokes `src/lib/ar/fade-blend.ts` to compute the rendered color vector at the current `(week, washesPerWeek)` and updates the `<ColorRender>` render via URL state `?week=N` (AR6).

**And** snap points exist at week 2 / week 4 / week 8 with visual emphasis — these are the "perceived milestones" UX-DR4 specifies.

**And** Slider arrow-key + Page Up/Down navigation works (Radix default) and a live region announces "Week 4, two washes per week" on each change (UX-DR13).

**And** the Vitest test measures `requestAnimationFrame` callback frequency during a 0→90 sweep and asserts ≤16ms per frame (60fps target; NFR2). The test runs on synthetic input — actual hardware measurement happens in the dry-run validation in Story 1.13 + the Playwright spec.

**And** in `prefers-reduced-motion: reduce` mode, scrub still produces real-time render updates but the *transition smoothing* between sample points is removed (UX-DR13, NFR24).

### Story 1.9: Build LightingToggle (3 calibrated presets) with ≤100ms response

As Maya the consumer,
I want to toggle between salon, daylight, and warm-interior lighting presets,
So that I see how the color reads under the lighting conditions I'll actually encounter outside the salon (FR4, NFR3, UX-DR4).

**Acceptance Criteria:**

**Given** UX-DR4's LightingToggle spec,
**When** the developer creates `src/components/render/LightingToggle.tsx` with colocated tests + stories,
**Then** the component renders a Radix ToggleGroup three-position toggle (Indoor / Daylight / Salon) with `aria-label="Lighting preset"`, each preset applies the corresponding `src/lib/ar/lighting-postprocess.ts` calibrated profile to the rendered color (color-temperature + white-balance offset + gamma curve — NOT a generic Instagram filter).

**And** the lighting transition latency is ≤100ms because the post-processing chain is pre-computed and cached per `(color, lighting)` pair in WebGL textures at color-selection time, not on toggle (NFR3).

**And** the active preset is persisted to URL state `?lighting=daylight` (AR6) so back-navigation and share-link reproduction work.

**And** keyboard arrow navigation between presets works (ToggleGroup default), and a screen-reader announcement fires on change ("Lighting changed to daylight").

**And** in `prefers-reduced-motion: reduce` mode, lighting toggle is instant (no cross-fade) (NFR24, UX-DR13).

### Story 1.10: Compose /try-on route with full upload→consent→render→fade→lighting flow

As Maya the consumer,
I want one single `/try-on` route that integrates upload, consent, color render, fade scrubbing, and lighting toggling,
So that the defining experience (color render + fade scrub + lighting toggle on a personal photo) is a single coherent surface, not a multi-page workflow (FR5, UX-DR8, UX-DR14).

**Acceptance Criteria:**

**Given** the `(consumer)/try-on/page.tsx` route file declared in `architecture.md` §6,
**When** the developer authors the page,
**Then** it renders as a Client Component with `<PageShell>` + `<AppHeader variant="consumer">` + `<DensityContainer density="comfortable">` and composes `<PhotoUploader>` → `<ConsentPrompt>` → `<ColorRender>` (with `<FadeSimulator>`, `<LightingToggle>`, `<ShareLook>` as child overlays).

**And** the four exit affordances — "Find a salon," "Save this look," "Share this look," "Try another color" — render as **visually equal** Secondary-tier buttons in a row (UX-DR8: equal-weight exit affordances; never funneled toward "Find a salon").

**And** the `/try-on` page reads its full state from URL params (`?color`, `?lighting`, `?week`, `?washesPerWeek`) so back-navigation and share-link reproduction restore the exact render (AR6).

**And** the page invokes `MockARProvider.prewarm()` on mount (per AR5 pre-warm strategy) so the first segmentation latency is dominated by inference, not network/init.

**And** Editorial Magazine direction is honored — generous whitespace (`space-6` between major elements), large render hero, restrained chrome, `text-display`-class color name, no decorative animations on idle (UX-DR14).

**And** `e2e/maya.spec.ts` asserts the full upload → consent → render → fade scrub → lighting toggle → "Find a salon" exit path completes without error.

### Story 1.11: Build ShareLook with privacy controls + share image generation

As Maya the consumer,
I want to share my try-on result (with the option to include or exclude my face) via a copyable link with embedded salon-routing context,
So that I can show my best friend what I'm considering and so the salon receives my color/lighting/brand context if I book through the link (FR6, UX-DR4).

**Acceptance Criteria:**

**Given** UX-DR4's ShareLook spec and FR6,
**When** the developer creates `src/components/render/ShareLook.tsx` with colocated tests + stories,
**Then** it generates a snapshot from the `<ColorRender>` canvas, exposes a privacy Switch labeled "Include my face / Show color-only swatch" (default: color-only swatch), copies a share link to the clipboard via the navigator clipboard API, and confirms via `<ToastWithProvenance>` ("Link copied — your photo isn't included unless you chose to include it").

**And** the share link is generated via `src/lib/url-state/share-link.ts` and lands on `/share/[lookId]` with embedded color/lighting/brand context recoverable downstream by Story 4.7's BookingHandoff.

**And** `src/app/api/share/[lookId]/route.ts` returns the share artifact JSON (look context + Open Graph metadata) and `src/app/(consumer)/share/[lookId]/page.tsx` renders the public share landing.

**And** the Vitest test asserts that with privacy=color-only, the generated artifact contains no photo bytes (only the rendered color swatch + look context).

### Story 1.12: Implement session-only photo retention with opt-in saved-looks IndexedDB persistence

As Maya the consumer,
I want my uploaded photo retained only for the active session by default, with the option to save it to my account for later use,
So that my biometric data isn't sitting around without my permission, and I can come back later to compare colors I've already tried (FR7, FR48, NFR16, cross-cutting concern #2).

**Acceptance Criteria:**

**Given** AR6's "in-memory only" tier for the active photo (cross-cutting concern #2),
**When** the user uploads a photo,
**Then** the photo is held only as a `Blob` URL in `useTryOnStore` (`src/lib/stores/try-on.ts`); it is **not** persisted to IndexedDB unless the user explicitly chooses "Process + save to my account" in `<ConsentPrompt>`.

**And** when the user closes the tab or navigates away, the `Blob` URL is revoked and the photo is unrecoverable.

**Given** the user chooses "Save this look" or "Process + save to my account",
**When** the saved-looks persistence runs,
**Then** `src/lib/persistence/saved-looks.ts` writes a saved-look entry to IndexedDB via `src/lib/persistence/idb.ts` containing `{lookId, color, lighting, week, washesPerWeek, photoBlob (only if "save to account" was chosen), thumbnailBlob, createdAt}`.

**And** `src/app/(consumer)/saved/page.tsx` lists saved looks with thumbnails, "Resume" CTA (re-opens `/try-on?color=…&lighting=…&week=…`), and "Delete this saved look" (Tertiary-weight + AlertDialog confirmation per UX-DR9).

**And** the Vitest test asserts that uploading without choosing "save" produces no IndexedDB entry, and uploading with "save" persists exactly one entry retrievable by `lookId`.

### Story 1.13: Build DemoFallbackPath / HonestFallback for Type-4 confidence-below-threshold renders

As Janelle the Type-4 consumer,
I want an honest fallback when the system can't confidently render this color on my hair texture, showing curated reference photos of a model with similar texture in the requested color,
So that I'm respected with truth instead of being shown a degraded render that misrepresents my hair (FR2 Type-4 honesty path, UX-DR4 honesty pattern, journey principle "last honest mirror").

**Acceptance Criteria:**

**Given** UX-DR4's DemoFallbackPath spec,
**When** the developer creates `src/components/render/DemoFallbackPath.tsx` (also exported as `HonestFallback`) with colocated tests + stories,
**Then** the component loads 3-5 curated reference photos from `src/lib/fixtures/photos/` tagged by texture (Type 4A/4B/4C) and color, displays explicit copy "We can't confidently render this color on your hair texture, but here's how it looks on a Type-4B model with similar undertones," and the explanation is the first focusable element.

**And** photos have descriptive alt text including texture type and color name (UX-DR13 a11y).

**And** `<RenderConfidenceBanner>` (`src/components/render/RenderConfidenceBanner.tsx`) renders above the fallback with the explanation and a "Try a different color" CTA (Tertiary-weight).

**And** when `<ColorRender>` triggers the fallback, the review surface for that (color × brand × Type-4 texture) combination continues to display reviews and outcome metrics (the fallback is render-only, not a full degradation).

**And** `e2e/janelle.spec.ts` asserts that selecting a known-low-confidence color on a Type-4 fixture photo triggers the fallback path with the correct curated photo set displayed.

---

## Epic 2: Color & Brand Discovery

Consumer can browse the color taxonomy organized by canonical color name (not by brand), see brand options ranked by outcome metrics, view outcome data per (brand × color × texture), identify specialty-tier colors, and trust that any color in the standard taxonomy meets the ≥3-brand coverage rule.

### Story 2.1: Build MockEditorialProvider with color taxonomy + brand mapping fixtures

As a developer building the discovery surfaces,
I want `MockEditorialProvider` implemented with curated fixtures for the V1 color taxonomy (30 canonical colors), brand catalog, and brand-SKU-to-canonical-color mappings,
So that Stories 2.2-2.6 have realistic data to render against and Demo V1 is fully self-contained (NFR16, NFR30, AR2, FR12).

**Acceptance Criteria:**

**Given** the `EditorialProvider` contract from Story 1.2 and the fixture file paths from `architecture.md` §6,
**When** the developer creates `src/lib/providers/mock/MockEditorialProvider.ts`,
**Then** it implements `getColorTaxonomy()`, `getColorBySlug(slug)`, `getBrands()`, `getBrandColorMappings()`, and `getSpecialtyTierFlag(colorSlug)` reading from `src/lib/fixtures/{colors.json,brands.json,color-brand-mappings.json}`.

**And** `src/lib/fixtures/colors.json` contains exactly 30 V1 canonical colors with `{slug, canonicalName, family, warmth, referenceSwatch (OKLCH), tier: "standard" | "specialty"}` shapes validated by `src/lib/schemas/color.ts` (Zod).

**And** `src/lib/fixtures/brands.json` contains the 4 BSG-carried brands (Wella, Schwarzkopf, Pravana, Redken) with `{slug, name, displayName, vendorId}`.

**And** `src/lib/fixtures/color-brand-mappings.json` is the 5×30 normalization table per FR12 — each canonical color maps to ≥3 brand SKUs unless flagged `tier: "specialty"`, and `src/lib/color-science/intersection-rule.ts` validates this rule on fixture load.

**And** the Vitest test in `MockEditorialProvider.test.ts` asserts the intersection rule passes for all standard-tier colors, fails (correctly) for any synthetic 2-brand color, and that `getColorTaxonomy()` returns 30 entries.

### Story 2.2: Build ColorGrid + ColorCard for /colors browse surface

As Maya the consumer,
I want to browse a color-first grid where the same color name renders the same across brands (not 30 different "auburns"),
So that I can compare colors without being trapped in any single brand's marketing palette (FR8, UX-DR6, UX-DR14).

**Acceptance Criteria:**

**Given** UX-DR6's ColorGrid + ColorCard spec,
**When** the developer creates `src/components/discovery/{ColorGrid,ColorCard,SpecialtyTierLabel}.tsx` with colocated tests + stories and the route `src/app/(consumer)/colors/page.tsx`,
**Then** the page is a Server Component (Demo V1 — Client Component reading from `useEditorialProvider()`; Production V1 — Server Component reading directly from `providers.editorial.getColorTaxonomy()`) that renders `<ColorGrid>` with `role="list"` and one `<ColorCard role="listitem">` per canonical color.

**And** each `<ColorCard>` displays the canonical color name + reference swatch rendered against a calibrated reference scalp tone (NOT a single brand's photography) + tier label + brand count ("Available in 7 brands"), and the entire card is one tab stop with `aria-label` summarizing color + coverage (UX-DR6, UX-DR13).

**And** filters on the page (texture, family, warmth) update URL state and trigger a ≤200ms render swap (NFR4) — Vitest test asserts the synthetic budget.

**And** the empty state when filters return no matches uses `<HonestEmptyState copy="No colors match these filters yet — try removing a filter">` (UX-DR16).

**And** `e2e/maya.spec.ts` asserts navigating to `/colors`, applying a Type-4 texture filter, and selecting a color routes to `/colors/[colorSlug]` with the correct slug.

### Story 2.3: Build /colors/[colorSlug] route with brand list ranked by outcome metrics

As Maya the consumer,
I want to see, for the color I'm considering, the list of brands that offer it ranked by outcome-anchored review metrics (not by brand spend or alphabetical order),
So that I'm choosing on outcome quality, not on whoever paid for placement (FR9, UX-DR14).

**Acceptance Criteria:**

**Given** the route file `src/app/(consumer)/colors/[colorSlug]/page.tsx` and FR9,
**When** the developer authors the page,
**Then** it fetches the color via `providers.editorial.getColorBySlug(slug)`, fetches reviews for each `(color × brand)` cell via `providers.reviews.list({colorSlug, dimension: "color-outcome"})`, and ranks brands by aggregate color-outcome score descending (FR9, FR16 — color-outcome dimension only on public surfaces).

**And** brand ordering is deterministic — ties broken by alphabetical order on `brand.slug` so the same input always produces the same output (regression-test friendly).

**And** the page renders the color's reference swatch (large, hero), the tier label, the brand count, the brand list (each row: brand logo + display name + aggregate outcome score + sample size + CTA "See on me"), and the review surface (`<ReviewCard>` instances built in Epic 3).

**And** the page is SEO-indexable in Production V1 — Server Component, `<title>` + Open Graph metadata via `opengraph-image.tsx` per architecture's public-indexed-routes commitment.

**And** the Editorial Magazine direction is honored: type-led hierarchy, generous whitespace, no decorative animations.

### Story 2.4: Build OutcomeMetrics component for (brand × color × texture) tuples

As Maya the consumer,
I want to see structured outcome metrics — fade weeks, accuracy, damage, recommend percentage — for any (brand × color × texture) tuple,
So that I'm comparing on outcomes that matter, not vibes (FR10, UX-DR5).

**Acceptance Criteria:**

**Given** UX-DR5's OutcomeMetrics spec,
**When** the developer creates `src/components/reviews/OutcomeMetrics.tsx` with colocated tests + stories,
**Then** it renders a 4-badge row covering: fade weeks (e.g., "Lasted 6 weeks"), accuracy 1-5 (with star or numeric variant), damage 1-5 (inverted scale — lower is better, with a brief explanation in the Popover), would-recommend percentage.

**And** each badge is keyboard-focusable and opens a definitional Popover when activated (e.g., "Fade weeks: number of weeks before a wash dropped color saturation below the user's reported tolerance threshold").

**And** every badge has a descriptive `aria-label` for screen readers (e.g., "Lasted 6 weeks before fade, accuracy 4 of 5, damage low, recommend yes" — UX-DR5).

**And** the variants `display` (consumer-facing read-only) and `editable` (used in `<ReviewSubmissionForm>`) are both supported.

**And** the OutcomeMetrics is filtered by texture — when called with a texture filter active, only data for the matching texture aggregates is shown (FR10).

### Story 2.5: Build SpecialtyTierLabel + propagate "1 brand only — unique look" labeling

As Maya the consumer,
I want specialty-tier colors visibly labeled "1 brand only — unique look" (or "Specialty Tier — fewer than 3 brands carry this color"),
So that I know upfront whether picking this color limits my brand choice — no surprise at the salon (FR11, UX-DR6).

**Acceptance Criteria:**

**Given** UX-DR6's SpecialtyTierLabel spec,
**When** the developer creates `src/components/discovery/SpecialtyTierLabel.tsx` with colocated tests + stories,
**Then** the chip renders only when the color's `tier === "specialty"` (1 or 2 brands carry it), displays the text "Specialty Tier — fewer than 3 brands carry this color" (or, if exactly 1 brand carries it, "1 brand only — unique look" per FR11), and tapping/activating opens a Popover explaining the tier system.

**And** the chip is real text (not background image) with `aria-label`, satisfying NFR22 / UX-DR13.

**And** the chip appears on `<ColorCard>` (browse) and on `/colors/[colorSlug]` (detail) for any specialty-tier color.

**And** the Vitest test asserts that `<ColorCard>` with `tier: "standard"` does **not** render the chip and `tier: "specialty"` does.

### Story 2.6: Enforce ≥3-brand standard-tier rule at provider boundary + intersection-rule validator

As an Editorial Curator (and as the system),
I want the system to enforce that a color appears in the standard taxonomy only when offered by ≥3 brands within color tolerance,
So that browse-surface trust isn't undermined by a "color" that only one brand actually sells (FR12, NFR20).

**Acceptance Criteria:**

**Given** FR12's intersection rule and `src/lib/color-science/intersection-rule.ts` from Story 2.1,
**When** `MockEditorialProvider.getColorTaxonomy()` is called with `tier: "standard"`,
**Then** it returns only colors where the brand-mapping count ≥3 AND every contributing brand is within ΔE-2000 ≤ 2.0 tolerance of the canonical reference vector (per `src/lib/color-science/delta-e.ts`).

**And** colors with brand-mapping count of 1 or 2 are returned only when `tier: "specialty"` is explicitly requested, never blended into the standard-tier list (FR11, FR12).

**And** the Vitest test in `intersection-rule.test.ts` asserts: a synthetic color with 3 brands within ΔE ≤ 2.0 passes; a synthetic color with 3 brands but one outside ΔE > 2.0 fails (correctly drops to specialty tier); a synthetic color with 2 brands within tolerance passes specialty tier but fails standard tier.

**And** `src/app/api/colors/route.ts` Route Handler exposes the same enforcement at the API boundary (NFR10 — server-side enforcement, not just client-side).

---

## Epic 3: Outcome Reviews & Source Attribution

Consumer can view source-labeled reviews, filter by texture, submit native post-booking reviews, and trust the Public Review Integrity Policy is enforced at every level (rankings use color-outcome only; brand-published segregated; native reviews immutable; rankings unalterable by brand request; third-party reviews verbatim).

### Story 3.1: Build MockReviewProvider with 4-source-class review fixtures

As a developer building review surfaces,
I want `MockReviewProvider` implemented with curated review fixtures spanning all 4 source classes (Native / Aggregated / Editorial / Salon-attested),
So that the SourceAttributionLabel and ReviewCard stories have realistic data and the Public Review Integrity Policy is demonstrable end-to-end (FR13, AR2, NFR16).

**Acceptance Criteria:**

**Given** the `ReviewProvider` contract from Story 1.2,
**When** the developer creates `src/lib/providers/mock/MockReviewProvider.ts`,
**Then** it implements `list(filters)`, `get(reviewId)`, `submit(payload)`, `reply(reviewId, body)`, and `getRanking(colorSlug)` reading from `src/lib/fixtures/reviews/*.json` (one file per `(color, brand)` cell).

**And** each review fixture entry has shape `{reviewId, colorSlug, brandSlug, sourceClass: "native" | "aggregated" | "brand-published" | "salon-attested", textureType, outcomeMetrics, body, photoUrl?, reviewerAttribution, submittedAt, brandReply?}` validated by `src/lib/schemas/review.ts`.

**And** the fixture set includes ≥10 reviews per source class spanning Type 1-4 textures so filter tests have data.

**And** `MockReviewProvider.list()` supports filtering by `colorSlug`, `brandSlug`, `textureType`, `sourceClass`, and `dimension` (returning only the requested dimension's score for FR16 enforcement).

### Story 3.2: Build SourceAttributionLabel chip with 4 variants + provenance Popover

As Maya the consumer,
I want every review labeled with its source — Google Places / brand-published / SB user / stylist-assisted submission — and a provenance explanation on tap,
So that I can weight reviews appropriately, not get tricked into trusting a brand's own marketing as if it were a customer review (FR13, UX-DR5).

**Acceptance Criteria:**

**Given** UX-DR5's SourceAttributionLabel spec,
**When** the developer creates `src/components/reviews/SourceAttributionLabel.tsx` with colocated tests + stories,
**Then** the chip renders one of 4 variants (Native / Aggregated / Editorial / Salon-attested) with the corresponding `attribution-*` color token from UX-DR1, a single-letter glyph, and a label.

**And** each variant has a Popover with longer-form provenance text (Native: "Submitted by a verified user who booked through this app"; Aggregated: "Pulled verbatim from a third-party source like Google Places"; Editorial: "Brand-published — segregated from headline rankings"; Salon-attested: "Submitted on the user's behalf by a stylist with verbal consent captured").

**And** chip text is real text (not background image) with `aria-label` "Review source: Native (submitted by a verified user)" (UX-DR13).

**And** the Vitest test renders all 4 variants and asserts each one's Popover content matches the expected provenance copy.

### Story 3.3: Build ReviewCard composing OutcomeMetrics + SourceAttributionLabel + body + reply

As Maya the consumer,
I want each review displayed as a coherent card with outcome metrics, source attribution, body text, reviewer-attributed swatch image, and any brand reply visible,
So that I can read reviews efficiently with full context, not as scattered fragments (FR13, UX-DR5).

**Acceptance Criteria:**

**Given** UX-DR5's ReviewCard spec,
**When** the developer creates `src/components/reviews/ReviewCard.tsx` with colocated tests + stories,
**Then** the component is a semantic `<article>` composing `<OutcomeMetrics>` + `<SourceAttributionLabel>` + reviewer-attributed swatch image + free-text body + `<BrandReplyAffordance>` (rendered as `<aside>` if a brand reply exists).

**And** states `default`, `expanded` (full body + photos), `flagged` (admin view only) are supported.

**And** the Vitest test renders a sample review with all four optional fields populated and asserts the semantic structure (one `<article>`, one nested `<aside>` for the reply).

### Story 3.4: Build TextureFilter with URL-state persistence across navigation

As Janelle (or any texture-aware consumer),
I want a prominent texture filter (Type 1 / 2 / 3 / 4 with sub-types) on color browse and review surfaces, and my selection persists across navigation,
So that I see only data relevant to my hair texture without re-applying the filter on every page (FR14, UX-DR5, AR6).

**Acceptance Criteria:**

**Given** UX-DR5's TextureFilter spec,
**When** the developer creates `src/components/reviews/TextureFilter.tsx` with colocated tests + stories,
**Then** it renders a Radix ToggleGroup with `aria-label="Hair texture filter"` and 4 main options (Type 1 / 2 / 3 / 4) each expandable to sub-types (1A/1B/1C, 2A/2B/2C, etc.).

**And** the filter is visible at the top of any review surface (not buried under "More filters" — UX-DR5 explicit).

**And** selection is persisted to URL state `?texture=4b` via `src/lib/url-state/try-on-params.ts`, so navigating from `/colors` → `/colors/auburn` → back preserves the filter.

**And** keyboard arrow navigation works and selection count is announced via live region.

**And** when no reviews match the active texture filter, `<HonestEmptyState copy="No reviews from Type 4B users for this color yet — be the first">` is rendered (UX-DR16).

### Story 3.5: Build ReviewSubmissionForm with multi-step weight + 6 outcome dimensions

As Maya post-booking,
I want a deliberately weighty multi-step review submission form covering color outcome, stylist execution, salon environment, fade weeks, damage, and would-recommend (plus optional photo),
So that my review carries the rigor needed to be useful to others — and I'm signaled this is a contribution moment, not a quick survey (FR15, UX-DR5, UX-DR11).

**Acceptance Criteria:**

**Given** UX-DR5's ReviewSubmissionForm spec and FR15's required dimensions,
**When** the developer creates `src/components/reviews/ReviewSubmissionForm.tsx` with colocated tests + stories,
**Then** it uses Radix Form with multi-step navigation (max 3 steps: Outcome / Experience / Photo+Submit per UX-DR11), a visible step indicator, and "Back" preserves entered values.

**And** Step 1 collects: color outcome (1-5), fade weeks elapsed, damage (1-5), would-recommend (yes/no).

**And** Step 2 collects: stylist execution (1-5), salon environment (1-5), texture type (Type 1-4 with sub-types).

**And** Step 3 collects: optional photo upload + free-text body + identity attribution (defaults to "self"; stylist-assisted variant is enabled in Story 5.4 with consent flag).

**And** the inline Public Review Integrity Policy summary is visible on Step 3 ("Native reviews can't be deleted at brand request. Rankings can't be adjusted by brand request. Your review's color-outcome dimension feeds public rankings; stylist execution and salon environment dimensions are private to the salon partner.").

**And** validation is **on blur** for individual fields, **on submit** for cross-field rules (UX-DR11). Errors render inline below the field with `aria-describedby` (never red background fill, never "Invalid input").

**And** submit posts to `/api/reviews/route.ts` (POST handler) with the payload validated by `src/lib/schemas/review.ts` Zod schema.

**And** on success, `<Dialog>` (not Toast) confirms submission with the Public Review Integrity Policy summary visible (UX-DR10's blocking-confirmation pattern for high-weight forms).

### Story 3.6: Enforce color-outcome-only public ranking + private stylist/salon dimensions to partners

As the platform (and specifically Marcus the partner),
I want public-facing color rankings computed using only the color-outcome dimension, with stylist execution and salon environment dimensions surfaced only to the salon partner (private),
So that the brand-neutral marketplace claim is structurally enforceable, not just policy-stated (FR16, FR19).

**Acceptance Criteria:**

**Given** FR16, FR19, and the ranking logic in `src/lib/reviews/ranking.ts`,
**When** any consumer-facing surface calls `MockReviewProvider.getRanking(colorSlug)` or `list({dimension})`,
**Then** the ranking is computed using only `colorOutcomeScore`; stylist execution and salon environment scores are excluded from the aggregate (Vitest test in `ranking.test.ts` asserts this).

**And** when an operator-facing surface (Story 6.5's `/operator/dashboard/stylists`) calls `MockReviewProvider.getRanking(colorSlug, {visibility: "operator"})`, the response includes the private dimensions; without that flag, the response is identical to the consumer-facing call (NFR10 — enforced at provider boundary, not UI).

**And** any attempt to alter ranking position via direct API call (e.g., a synthetic admin-facing endpoint) returns a 403 Forbidden response (FR19, FR38). The Route Handler `/api/admin/taxonomy/route.ts` does **not** expose a "set ranking" mutation.

### Story 3.7: Implement brand-published review tab segregation

As Maya the consumer,
I want brand-published reviews segregated into a clearly labeled "brand-published" tab and never blended into headline rankings,
So that I can read brand marketing materials when I want them, but they don't masquerade as customer reviews (FR17, UX-DR5).

**Acceptance Criteria:**

**Given** FR17 and `src/lib/reviews/source-segregation.ts`,
**When** `/colors/[colorSlug]` renders the review surface,
**Then** brand-published reviews appear under a dedicated Radix Tab labeled "Brand-published," visually distinct from "Customer reviews" / "Aggregated" / "Salon-attested" tabs.

**And** the headline ranking calculation in `src/lib/reviews/ranking.ts` excludes `sourceClass === "brand-published"` (Vitest test asserts this).

**And** the brand-published tab uses `attribution-brand-published` color token (muted purple-gray per UX-DR1) — visually distinguished from native (no positive connotation).

### Story 3.8: Enforce native review immutability + ToS-only deletion path + retention after brand termination

As the platform,
I want native review deletion forbidden except for documented ToS violations, ranking-by-brand-request forbidden, and native reviews retained even after a brand contract terminates,
So that the public review integrity policy is enforceable at the data layer (FR18, FR19, FR20).

**Acceptance Criteria:**

**Given** FR18, FR19, FR20 and the Editorial Curator's moderation surface (Story 7.7),
**When** any actor attempts to delete a native review via `MockReviewProvider`,
**Then** the operation is allowed **only** when the actor is `EditorialCurator` AND a `tosViolationReason` field is populated (audit-logged with timestamp + actor + reason). All other delete attempts return `403 Forbidden` (NFR10).

**And** the `MockReviewProvider.list({brandSlug})` method returns native reviews even when the brand fixture has `contractStatus: "terminated"` (FR20). Vitest test asserts this with a synthetic terminated-brand fixture.

**And** the system has **no API surface** for "adjust ranking by brand request" — `src/app/api/admin/taxonomy/route.ts` does not expose a ranking-mutation endpoint, and `src/lib/reviews/ranking.ts` is purely deterministic on review data (FR19, FR38).

### Story 3.9: Display third-party ingested reviews verbatim + BrandReplyAffordance

As Maya the consumer,
I want third-party ingested reviews (e.g., Google Places) displayed verbatim with source attribution, and any brand replies displayed visually subordinate to the parent review,
So that I see the raw third-party voice — and brand replies as commentary, not as content moderation (FR21, FR37, UX-DR5).

**Acceptance Criteria:**

**Given** FR21 and UX-DR5's BrandReplyAffordance spec,
**When** the developer creates `src/components/reviews/BrandReplyAffordance.tsx` with colocated tests + stories,
**Then** brand replies render as a semantic `<aside>` linked to the parent review, visually subordinate (smaller type, indented), with "From [Brand]" attribution.

**And** the system **never** modifies ingested third-party review content — `MockReviewProvider.list({sourceClass: "aggregated"})` returns the body verbatim. Vitest test asserts a known fixture entry's `body` field is returned bit-for-bit unchanged.

**And** the Production V1 ingestion path documented in `src/lib/reviews/ingestion.ts` (a stub interface in Demo V1; full impl deferred to Production V1) preserves source attribution metadata across the ingestion → display chain.

**And** brand replies pending moderation appear with an `admin-only-pending` flag (consumed by Story 7.7's `<BrandReplyModeration>`); consumer-facing surfaces only show approved replies.

---

## Epic 4: Salon Discovery & Booking Handoff

Consumer can search salons by location and color offering, view detailed salon profiles with stylist scorecards and texture certifications, and initiate a booking handoff that preserves her color/lighting/brand context across the deep-link with an attribution token recoverable by the salon's confirmation webhook.

### Story 4.1: Build MockSalonProvider with 10 curated DFW salon fixtures + search index

As a developer building the discovery surfaces,
I want `MockSalonProvider` implemented with realistic curated DFW salon fixtures (10 salons, varied texture specialties, varied stylist rosters) plus a search index for ZIP/radius/color queries,
So that Stories 4.2-4.4 have data to render and Demo V1's salon discovery is fully self-contained (NFR16, NFR30, AR2).

**Acceptance Criteria:**

**Given** the `SalonProvider` contract,
**When** the developer creates `src/lib/providers/mock/MockSalonProvider.ts`,
**Then** it implements `search(filters)`, `getSalonBySlug(salonSlug)`, `getStylists(salonSlug)`, and `getCertifications(salonSlug)` reading from `src/lib/fixtures/{salons.dfw.json, stylists.json}`.

**And** `salons.dfw.json` has 10 entries with realistic DFW addresses (Dallas, Plano, Frisco, Arlington), color-specific certifications, and per-salon stylist rosters validated by `src/lib/schemas/salon.ts`.

**And** `stylists.json` has 3-6 stylists per salon with `{stylistId, salonId, name, textureCertifications: ["Type-2", "Type-4A", ...], colorAccuracyByTexture: {...}}` validated by `src/lib/schemas/stylist.ts`.

**And** `MockSalonProvider.search()` supports `{zip, radiusMiles, colorSlug, textureType}` filtering with realistic distance computation (Haversine formula or similar).

### Story 4.2: Build SalonSearch on /salons route with location/radius/color/texture filters

As Maya the consumer,
I want to search salons by location (within a configurable radius) that offer the color I'm considering, with optional texture-specialty filter,
So that I find salons that can actually do this color on my hair (FR22, UX-DR6).

**Acceptance Criteria:**

**Given** UX-DR6's SalonSearch spec,
**When** the developer creates `src/components/discovery/SalonSearch.tsx` with colocated tests + stories,
**Then** the component exposes ZIP/city input, distance radius (5/10/20/50 miles), optional texture-specialty filter, color filter (defaults to the color last selected on `/try-on` via URL state), and sort by relevance / distance / rating.

**And** results render as a list of `<SalonProfile>` summary cards (one per result) with results count announced via live region (NFR22, UX-DR13).

**And** the empty state when no salons match uses `<HonestEmptyState copy="No salons within {radius} miles offer {color}. Try a wider radius or remove the texture filter">` (UX-DR16).

**And** filters are persisted to URL state via `src/lib/url-state/salon-search-params.ts` so back-navigation and share work.

### Story 4.3: Build /salons/[city]/[salonSlug] profile with certifications + accuracy ratings

As Maya the consumer,
I want to view a salon profile showing color-specific certifications, color-specific accuracy ratings, and per-stylist accuracy scorecards,
So that I'm picking a salon based on outcome data, not just proximity (FR23, UX-DR6).

**Acceptance Criteria:**

**Given** the route file `src/app/(consumer)/salons/[city]/[salonSlug]/page.tsx`,
**When** the developer authors the page,
**Then** it fetches the salon via `providers.salon.getSalonBySlug(salonSlug)`, fetches stylists via `getStylists()`, and fetches salon-attested reviews via `providers.reviews.list({salonId, sourceClass: "salon-attested"})`.

**And** the page renders the salon name + address + map (static link in Demo V1; interactive in Production V1), color-specific certifications grid (e.g., "Wella certified," "Pravana certified"), color-specific accuracy ratings aggregated across the salon, the stylist roster with `<StylistScorecard>` instances, and the salon-attested review section.

**And** the page is SEO-indexable in Production V1 (Server Component + Open Graph metadata).

**And** Editorial Magazine direction is honored — generous whitespace, type-led hierarchy, restrained chrome.

### Story 4.4: Build StylistScorecard consumer variant with texture certifications

As Maya the consumer (especially Type-4 Janelle),
I want per-stylist scorecards showing texture certifications and color accuracy by texture,
So that I'm asking "does this stylist work with my texture?" not "does this salon have any texture-experienced stylists?" (FR24, UX-DR6).

**Acceptance Criteria:**

**Given** UX-DR6's StylistScorecard spec,
**When** the developer creates `src/components/discovery/StylistScorecard.tsx` with `variant: "consumer" | "operator"` prop,
**Then** the consumer variant displays the stylist name, photo, texture certifications (e.g., "Type 2A, Type 4B"), color accuracy aggregated by texture (with the active texture filter applied), and the count of attributed-booking outcomes the score is based on.

**And** when no stylist at this salon is texture-certified for the user's filtered texture, `<HonestEmptyState copy="No stylists at this salon are certified for Type 4B yet. Want to expand your radius?">` is rendered.

**And** texture-specialty labeling has descriptive `aria-label`s (UX-DR13) and outcome metrics use the same `<OutcomeMetrics>` component from Epic 2.

### Story 4.5: Build saved-look mechanism (lookId persistence) as precondition for FR25/FR27

As Maya the consumer (and a precondition for the booking handoff and the stylist's chair-side view),
I want my try-on state captured as a referenceable `lookId` payload,
So that the booking handoff (FR25) can preserve my context and the stylist (FR27) can access the same context from the calendar link.

**Acceptance Criteria:**

**Given** FR25 / FR27 / Story 1.12's saved-looks IndexedDB persistence,
**When** the developer creates `src/lib/persistence/saved-looks.ts` and the corresponding TypeScript types,
**Then** a saved look has shape `{lookId (UUID v7), photoBlob (only if "save to account"), thumbnailBlob, color, lighting, week, washesPerWeek, brand?, textureType?, createdAt, savedToAccount: boolean}` validated by `src/lib/schemas/index.ts`.

**And** `MockARProvider` writes a saved-look entry to IndexedDB whenever the user clicks "Save this look" or "Find a salon" (the handoff captures context implicitly to ensure the link works).

**And** `getLookById(lookId)` returns the look from IndexedDB; in Production V1, the same shape is fetched server-side from the DB. The Demo V1 share-link routes to `/share/[lookId]` (Story 1.11) read from IndexedDB.

**And** the Vitest test asserts that a look written then read produces an identical payload (round-trip integrity).

### Story 4.6: Build attribution token signer + /api/attribution/issue Route Handler

As the platform (and a precondition for FR26 and Epic 6's dashboard reads),
I want HMAC-SHA256-signed compact attribution tokens emitted at booking-handoff time and verifiable at the webhook receiver,
So that the demo→production attribution chain is unforgeable and the #1 success metric is auditable end-to-end (FR26, NFR11, AR9).

**Acceptance Criteria:**

**Given** AR9's attribution token spec and `src/lib/security/attribution-token.ts`,
**When** the developer authors the signer,
**Then** it accepts `{lookId, color, lighting, brand?, salonId, issuedAt, nonce}`, signs it via HMAC-SHA256 using `process.env.ATTRIBUTION_HMAC_SECRET`, and returns a compact base64url-encoded token.

**And** `verifyToken(token)` validates the HMAC, parses the payload, and returns `{valid: true, payload}` or `{valid: false, reason: "tampered" | "expired" | "malformed"}`.

**And** the Vitest test in `attribution-token.test.ts` (per architecture's NFR11 tamper test commitment) asserts: a valid token round-trips correctly; flipping any byte in the payload invalidates the token; flipping any byte in the signature invalidates the token; using a wrong secret invalidates the token.

**Given** the Route Handler `src/app/api/attribution/issue/route.ts`,
**When** it receives a POST with the token payload,
**Then** it generates a fresh nonce (UUID v7), signs the token, persists `{nonce, payload, issuedAt}` to the attribution store (Demo V1: in-memory map; Production V1: Postgres), emits `attribution.token_issued` telemetry, and returns `{token, nonce}`.

**And** `e2e/attribution-token.spec.ts` asserts the full token-issue flow against a synthetic look payload.

### Story 4.7: Build BookingHandoff deep-link with preserved context + attribution token

As Maya the consumer,
I want clicking "Find a salon" → "Book this stylist" to open the salon's booking flow with my color, lighting, and brand preference preserved as context,
So that the salon receives my exploration, not just an empty appointment slot (FR25, FR26, UX-DR6).

**Acceptance Criteria:**

**Given** FR25 + FR26 + Story 4.6's attribution token,
**When** the developer creates `src/components/discovery/BookingHandoffButton.tsx` and `src/components/layout/BookingHandoff.tsx` with colocated tests + stories,
**Then** clicking "Book this stylist" on `<SalonProfile>` calls `providers.attribution.issueToken({lookId, color, lighting, brand, salonId, ...})` to receive the signed token, calls `providers.bookingHandoff.handoff({salonId, lookId, token})` to receive the deep-link URL, and navigates the user to that URL in the same tab (Demo V1 mock — placeholder confirmation page; Production V1 — real Booksy/Vagaro/Square deep-link).

**And** the deep-link URL includes both `?look=lookId` and `?attribution=token` query parameters; the salon's webhook receiver (Story 4.8) reads `?attribution`.

**And** `MockBookingHandoffProvider` returns a placeholder URL (`/share/[lookId]?demo=booking-confirmation`) that renders a Demo V1 confirmation page reading the look context.

**And** the Vitest test asserts that handoff invocation includes the unforged token and the look context is recoverable from the deep-link URL.

### Story 4.8: Build idempotent /api/webhooks/booking receiver

As the platform (Production V1) and the demo→production contract gate (Demo V1 — receiver implemented and tested even if no real webhooks fire),
I want the booking webhook receiver to verify HMAC, persist `booking_event` records with UNIQUE attribution_nonce, tolerate duplicate deliveries idempotently, and tolerate 24-hour out-of-order delivery,
So that Epic 6's dashboard reads attributed bookings reliably and the Production V1 attribution coverage NFR is achievable (FR26 receive side, NFR11, NFR33, AR9).

**Acceptance Criteria:**

**Given** AR9's webhook spec and the Route Handler `src/app/api/webhooks/booking/route.ts`,
**When** the developer authors the receiver,
**Then** it validates the HMAC signature on the incoming webhook (per `src/lib/schemas/webhook.ts`), and on a valid signature performs `INSERT INTO booking_event (nonce, payload, receivedAt) VALUES (?, ?, ?)` — where `nonce` has a UNIQUE constraint so duplicate-delivery attempts are no-ops, not failures.

**And** the receiver is idempotent: repeated POSTs with the same `nonce` return `200 OK` with `{deduped: true}` rather than 409 (NFR33).

**And** the receiver tolerates `bookingDate` up to 24 hours older than `receivedAt` without rejecting (NFR33 out-of-order tolerance).

**And** in Demo V1, the booking-event store is an in-memory map persisted across the dev server lifetime; in Production V1, the receiver writes to the Drizzle `booking_events` table with the UNIQUE constraint at the schema level.

**And** `e2e/attribution-token.spec.ts` asserts: send a synthetic webhook with a valid signature → 200; resend the same webhook → 200 with deduped flag; send a webhook with a tampered signature → 401.

**And** the receiver schedules notifications via `providers.notification.schedule({type: "post-booking", bookingId, channels: ["sms-24h", "email-7d", "in-app-banner"]})` — wires to Epic 8's notification machinery.

---

## Epic 5: Stylist Workflow & In-Chair Tools

Stylist accesses a consumer's saved-look context via a calendar-delivered web link, views the pre-booking context on a chair-side device (iPad landscape), submits a review on the consumer's behalf with verbal consent captured, and views her own color-specific accuracy + monthly attributed-booking count.

### Story 5.1: Build MockCalendarProvider + mock calendar invite flow

As a developer building Aliyah's surface,
I want `MockCalendarProvider` implemented with a mock invite that delivers a `/stylist/look/[lookId]` link to the stylist,
So that the stylist saved-look access flow (FR27) is demonstrable in Demo V1 without a real calendar integration (AR2, NFR16).

**Acceptance Criteria:**

**Given** the `CalendarProvider` contract,
**When** the developer creates `src/lib/providers/mock/MockCalendarProvider.ts`,
**Then** it implements `getInvitesForStylist(stylistId, date)` returning a mocked array of `{appointmentId, customerName, lookId, scheduledAt, lookLink: "/stylist/look/[lookId]"}` from the saved-looks fixtures.

**And** the mock calendar surface in the dashboard area (or a one-off Storybook story) demonstrates the link-delivery flow without requiring a real iCal/Google integration.

**And** the Vitest test asserts that for a given mocked `stylistId`, the provider returns a deterministic list of upcoming look links.

### Story 5.2: Implement Stylist auth role + /stylist/* route gate via AuthProvider

As the platform,
I want the `(stylist)/*` route group gated by `AuthProvider.requireRole("Stylist")` so that only authenticated stylists access saved-look surfaces,
So that consumer biometric data (photos linked to lookIds) isn't exposed to unauthorized actors (NFR10, FR45).

**Acceptance Criteria:**

**Given** the architecture's `requireRole()` pattern (`src/lib/security/require-role.ts`) and the `(stylist)/layout.tsx` route file,
**When** the developer authors the layout,
**Then** the layout invokes `requireRole("Stylist")` server-side; on failure (no auth, wrong role) the user is redirected to `/login` with the original URL preserved as `?next=`.

**And** in Demo V1, `MockAuthProvider` exposes a scripted "Aliyah" stylist identity (per `MockAuthProvider`'s scripted-identity behavior in architecture step 4); for the demo walkthrough, "Sign in as Aliyah" sets the cookie that satisfies the role check.

**And** in Production V1, the same gate validates the Sally Rewards SSO session role claim.

**And** the Vitest test asserts that an unauthenticated request is redirected and that a Consumer-role request returns 403.

### Story 5.3: Build SavedLookView at /stylist/look/[lookId] (iPad landscape optimized)

As Aliyah the stylist,
I want to access the consumer's saved-look context (color, lighting, fade-stage selection, brand preference) on my chair-side iPad via the calendar-delivered web link,
So that I can see what my client explored and discuss the color before I touch her hair (FR27, FR28, UX-DR6).

**Acceptance Criteria:**

**Given** the route file `src/app/(stylist)/look/[lookId]/page.tsx`,
**When** the developer authors the page,
**Then** it fetches the look via `providers.salon.getLookById(lookId)` (Demo V1 — IndexedDB; Production V1 — DB), renders `<SavedLookView>` (`src/components/stylist/SavedLookView.tsx`) showing the customer's photo + chosen color + lighting preset + fade-week + washes-per-week + brand preference + texture (if captured).

**And** the layout is iPad-landscape optimized (1024×768 native breakpoint via `(stylist)/layout.tsx`) with `density-compact` and Pro Tool direction (UX-DR14).

**And** the view is **read-only** — no save / edit affordances. The stylist's own actions (review submission, chair-side notes) go through Story 5.4's flow.

**And** the page exposes a "Submit a review on her behalf" CTA navigating to `/stylist/look/[lookId]/submit`.

**And** the Vitest test asserts the look content renders with all fields populated and that there are no save / edit buttons.

### Story 5.4: Build InChairReviewSubmission with stylist-assisted on-behalf-of attribution + verbal-consent capture

As Aliyah the stylist,
I want to submit a review on the customer's behalf with verbal consent captured as a timestamped record,
So that the review carries the stylist-attested provenance the customer would otherwise miss because she's about to leave the salon (FR29, NFR13, UX-DR5).

**Acceptance Criteria:**

**Given** UX-DR5's ReviewSubmissionForm and FR29's stylist-assisted variant,
**When** the developer creates `src/components/stylist/InChairReviewSubmission.tsx` and `src/components/stylist/ConsentCaptureModal.tsx`,
**Then** the route `/stylist/look/[lookId]/submit/page.tsx` renders the same multi-step `<ReviewSubmissionForm>` from Story 3.5 with a `mode: "stylist-assisted"` prop active.

**And** before the form renders, `<ConsentCaptureModal>` opens (Dialog, ESC disabled per UX-DR4 pattern) requiring the stylist to confirm "I have the customer's verbal consent to submit this review on her behalf" via a checkbox + a button labeled "Confirm consent and continue" — and the consent record is timestamped, audit-logged, and immutable per NFR13.

**And** on submit, the review is posted to `/api/reviews/route.ts` with `sourceClass: "salon-attested"`, `submittedByStylistId`, `verbalConsentRecordId`, and the customer's identity attribution (e.g., last name + lookId — never full PII).

**And** the resulting review displays in consumer surfaces with `<SourceAttributionLabel variant="salon-attested">` (Story 3.2).

**And** the Vitest test asserts that without the consent confirmation, the submit button is disabled and the post does not fire; with the confirmation, the post includes the consent record ID.

### Story 5.5: Build StylistStats — color accuracy aggregated by texture

As Aliyah the stylist,
I want to view my own color-specific accuracy aggregated across appointments routed through the app, segmented by hair texture,
So that I can see where my craft is strongest and where I should push for more practice — and prove my texture chops to skeptical Type-4 clients (FR30, UX-DR6).

**Acceptance Criteria:**

**Given** FR30 and the `(stylist)/dashboard/page.tsx` route (or a sub-route like `/stylist/stats/page.tsx`),
**When** the developer creates `src/components/stylist/StylistStats.tsx`,
**Then** the page is gated by `requireRole("Stylist")` and fetches `providers.attribution.getStylistAccuracy(stylistId)` returning `{textureType, colorOutcomeAvg, attributedBookingCount, fadeWeeksAvg}` per (stylist × texture × color) tuple.

**And** the component renders a density-compact table or scorecard grid with each row showing texture + color + accuracy score + sample size + fade-weeks average; tabular numerals are used (UX-DR1) for readability.

**And** when sample size is too low for a confident average (<5 attributed bookings), the row is grayed and labeled "Sample size too small to display average yet" (no fake precision — the honesty tone, UX-DR16).

**And** texture-by-texture filters allow Aliyah to focus on Type-4 only.

### Story 5.6: Build Stylist's monthly attributed-booking count + dashboard surface

As Aliyah the stylist,
I want a count of my attributed bookings for the current month displayed prominently,
So that I can see in real-time whether my chair-side amplification work is paying off (FR31).

**Acceptance Criteria:**

**Given** FR31 and the stylist dashboard surface from Story 5.5,
**When** the developer extends `<StylistStats>` (or creates a sibling `<MonthlyAttributedBookings>` component),
**Then** the page exposes a hero-card-sized aggregate "{N} attributed bookings this month" with the underlying detail (date / customer initials / color / outcome — once outcomes exist) accessible on tap.

**And** the count is fetched via `providers.attribution.getAttributedBookingsForStylist(stylistId, {currentMonth: true})`.

**And** the empty state for a stylist with zero attributed bookings this month uses `<HonestEmptyState copy="No attributed bookings yet this month — share your saved-look link with clients to start the chain">` (UX-DR16).

**And** the page is iPad-friendly (Aliyah may check between clients) and laptop-friendly (Aliyah may review at end of week).

---

## Epic 6: Salon Partner Operations

Salon Partner views a partner dashboard showing monthly attributed bookings against target, per-stylist scorecards across all three review dimensions, brand pull-through analytics, and a one-tap BSG re-order CTA. Partner manages color-specific certifications, replies publicly to reviews (without delete/alter), and operates under the platform's ranking-immutability commitment.

### Story 6.1: Build MockAttributionProvider with sample attribution fixtures

As a developer building Marcus's dashboard,
I want `MockAttributionProvider` implemented with realistic sample attribution data wiring to Epic 4's attribution token chain,
So that `<AttributedBookings>`, `<BrandPullThrough>`, and `<StylistScorecard>` (operator variant) render against representative data in Demo V1 (AR2, NFR16).

**Acceptance Criteria:**

**Given** the `AttributionProvider` contract,
**When** the developer creates `src/lib/providers/mock/MockAttributionProvider.ts`,
**Then** it implements `issueToken(payload)`, `verifyToken(token)`, `getAttributionForPartner(partnerId, range)`, `getAttributedBookingsForStylist(stylistId, range)`, and `getColorChoiceAnalytics(partnerId, range)`.

**And** `src/lib/fixtures/attribution-samples.json` contains 60-100 attributed booking events spanning the past 3 months with realistic color/brand/stylist distribution validated by `src/lib/schemas/attribution.ts`.

**And** `getAttributionForPartner()` returns aggregates `{totalAttributedBookings, target, byColor, byStylist, byWeek, conversionRate, attributedRevenue}` with deterministic ordering for regression tests.

**And** the Vitest test asserts that the fixture set contains the expected count and that the aggregator function produces the expected aggregates on a known input subset.

### Story 6.2: Implement SalonPartner auth role + /operator/dashboard/* route gate

As the platform,
I want the `(operator)/dashboard/*` route group gated by `AuthProvider.requireRole("SalonPartner")` so that only authenticated partners access dashboard data,
So that cross-actor data access is rejected at the API boundary, not the UI layer (NFR10, FR38).

**Acceptance Criteria:**

**Given** the `(operator)/layout.tsx` route file,
**When** the developer authors the layout,
**Then** the layout invokes `requireRole("SalonPartner")` for the dashboard subtree and `requireRole("EditorialCurator")` for the admin subtree (Story 7.2 covers admin); on failure the user is redirected to `/login`.

**And** `MockAuthProvider` exposes a scripted "Marcus" SalonPartner identity for the demo walkthrough.

**And** the Route Handlers under `/api/partners/*` independently invoke `requireRole("SalonPartner")` (server-side enforcement; not just layout) — the Vitest test asserts that a Consumer-role request to `/api/partners/attribution/route.ts` returns 403.

**And** every partner-scoped query (e.g., `getAttributionForPartner(partnerId)`) cross-checks that the requesting user's `partnerId` matches the requested resource's `partnerId`, rejecting cross-partner data access (Vitest test asserts a synthetic Marcus tries to fetch another salon's attribution → 403).

### Story 6.3: Build operator dashboard shell with density-compact layout + sidebar navigation

As Marcus the salon partner,
I want a desktop-native dashboard shell with persistent sidebar navigation (Attribution / Stylists / Pull-through / Reorder / Certifications / Reviews) and density-compact layout,
So that the dashboard reads as a Pro Tool (Linear / Stripe Dashboard caliber), not a stretched mobile consumer view (UX-DR12, UX-DR14).

**Acceptance Criteria:**

**Given** UX-DR12's operator navigation pattern and UX-DR14's Pro Tool direction,
**When** the developer authors `src/app/(operator)/layout.tsx`,
**Then** the layout renders `<PageShell>` + `<AppHeader variant="operator">` (with the persistent left sidebar containing the section list) + `<DensityContainer density="compact">`.

**And** the sidebar respects the section list per `architecture.md` §6: `/operator/dashboard` (Attribution overview, the home), `/operator/dashboard/stylists`, `/operator/dashboard/pull-through`, `/operator/dashboard/reorder`, `/operator/dashboard/certifications`, `/operator/dashboard/reviews`.

**And** the active section is highlighted via Tailwind variant; Tab navigation moves focus through sidebar items in visual order.

**And** the layout uses tabular numerals globally (UX-DR1).

**And** the page Lighthouse scores green for performance (NFR6 — partner dashboard initial load ≤2s).

### Story 6.4: Build AttributedBookings component on /operator/dashboard

As Marcus the salon partner,
I want a primary surface showing total attributed bookings for the current month against my target, with time-range filter (7d / 30d / 90d / custom), aggregate metrics (count, conversion rate, attributed revenue), and CSV export,
So that I can see in real-time how the platform is paying back my partnership (FR32, NFR40, UX-DR7).

**Acceptance Criteria:**

**Given** UX-DR7's AttributedBookings spec and FR32,
**When** the developer creates `src/components/dashboard/AttributedBookings.tsx` with colocated tests + stories and the route `src/app/(operator)/dashboard/page.tsx`,
**Then** the page renders a hero-card aggregate "{N} attributed bookings this month / Target: {target}" with progress visualization, a time-range Tabs control, and a semantic `<table>` listing each attributed booking (date / customer initials / color / brand / stylist / try-on provenance link).

**And** sortable column headers update sort state with announcement via live region (UX-DR7, UX-DR13); rows are keyboard-navigable.

**And** a CSV export button generates a download via a Route Handler `/api/partners/attribution/route.ts` returning CSV-encoded data (no client-side CSV generation).

**And** the empty state for a partner with zero attributed bookings uses `<HonestEmptyState copy="No attributed bookings in this range. Bookings appear here when customers book through the try-on app and your salon's webhook confirms.">` (UX-DR16).

**And** Vitest test asserts that the time-range filter updates the table content and the CSV export endpoint returns the same data the table renders.

### Story 6.5: Build per-stylist scorecard view at /operator/dashboard/stylists with private 3-dimension display

As Marcus the salon partner,
I want per-stylist scorecards showing all three review dimensions (color outcome + stylist execution + salon environment) — private to me as the operator,
So that I can do effective coaching without that private data leaking to the public-facing surfaces that should rank only on color outcome (FR33, FR16 enforcement).

**Acceptance Criteria:**

**Given** FR33 and Story 3.6's enforcement,
**When** the developer authors `src/app/(operator)/dashboard/stylists/page.tsx`,
**Then** the page fetches stylists for Marcus's salon via `providers.salon.getStylists(salonId)` and per-stylist scorecards via `providers.reviews.list({stylistId, visibility: "operator"})` (the `visibility: "operator"` flag triggers Story 3.6's enforcement to include private dimensions).

**And** each row uses `<StylistScorecard variant="operator">` showing color outcome / stylist execution / salon environment scorecards in a density-compact grid with tabular numerals.

**And** a banner above the table reads "Stylist execution and salon environment dimensions are private to your salon. They feed your coaching, not the public ranking." (UX-DR16 explicit honesty).

**And** the public-facing `/salons/[city]/[salonSlug]` page (Story 4.4) does **not** display these private dimensions — Vitest test asserts that calling `providers.reviews.list({stylistId})` without `visibility: "operator"` strips them.

### Story 6.6: Build BrandPullThrough analytics view

As Marcus the salon partner,
I want to view brand pull-through analytics — which colors my clients are choosing and the implied brand-reorder demand,
So that I can plan inventory off real demand signal, not gut feel (FR34, UX-DR7).

**Acceptance Criteria:**

**Given** FR34 and the route `src/app/(operator)/dashboard/pull-through/page.tsx`,
**When** the developer creates `src/components/dashboard/BrandPullThrough.tsx`,
**Then** the page fetches color-choice analytics via `providers.attribution.getColorChoiceAnalytics(salonId, range)` returning aggregates by color × brand × time-range.

**And** the component renders a chart (bar or line — Recharts or pure SVG; bias to ship the lighter option) showing brand reorder demand projection plus a table listing colors / brands / chosen-count / projected reorder quantity.

**And** time-range Tabs control allows 7d / 30d / 90d views.

**And** the empty state uses `<HonestEmptyState copy="No color-choice signal in this range yet">` (UX-DR16).

### Story 6.7: Build MockBSGProvider + BSGReorderCard one-tap reorder

As Marcus the salon partner,
I want to initiate a one-tap reorder of brand inventory pre-filled from actual usage data via my BSG account,
So that the platform's "moat-made-legible" moment is concrete — try-on data → real BSG resupply (FR35, UX-DR7).

**Acceptance Criteria:**

**Given** the `BSGProvider` contract and FR35,
**When** the developer creates `src/lib/providers/mock/MockBSGProvider.ts` and `src/components/dashboard/BSGReorderCard.tsx`,
**Then** `MockBSGProvider.suggestReorder(salonId)` returns a deterministic list of suggested-quantity products derived from `getColorChoiceAnalytics()` × usage rate.

**And** `<BSGReorderCard>` renders product / quantity-suggestion / "Re-order through BSG" Primary CTA / link to BSG order history.

**And** clicking "Re-order" calls `MockBSGProvider.placeReorder({salonId, items})` which returns a mocked confirmation `{orderId: "BSG-DEMO-4471", placedAt}`; the UI confirms via `<ToastWithProvenance copy="Order placed · BSG order #4471 · mocked confirmation in Demo V1">`.

**And** `src/app/(operator)/dashboard/reorder/page.tsx` renders one `<BSGReorderCard>` per high-pull-through brand × color combination.

**And** the Vitest test asserts that a synthetic suggestion → place flow produces the expected mocked order ID and that the Toast carries the explicit "mocked confirmation in Demo V1" provenance hint per UX-DR16.

### Story 6.8: Build CertificationManager for color-specific salon + stylist certifications

As Marcus the salon partner,
I want to manage color-specific certifications for my salon and stylists,
So that customers searching for texture-specialty stylists see the right matches and trust the certification claims (FR36, UX-DR7).

**Acceptance Criteria:**

**Given** FR36 and the route `src/app/(operator)/dashboard/certifications/page.tsx`,
**When** the developer creates `src/components/dashboard/CertificationManager.tsx`,
**Then** the page renders a table of stylists with editable cells for color certifications (multi-select per the brand list) and texture certifications (multi-select Type 1-4 with sub-types).

**And** changes are saved via `providers.salon.updateCertifications({salonId, stylistId, certifications})` posted to `/api/partners/certifications/route.ts` with full audit logging (NFR13 — timestamped, immutable).

**And** salon-level certifications (e.g., "Wella certified") are managed at the salon-card level above the stylist table.

**And** invalid certifications (e.g., a brand not in the BSG catalog) are caught by `src/lib/schemas/salon.ts` Zod validation and surfaced as inline errors (UX-DR10).

### Story 6.9: Build ReviewReplyQueue with public reply composer + delete/alter prevention

As Marcus the salon partner,
I want to reply publicly to any review on my salon's surface, but with delete/alter prevented at the platform level,
So that the brand-neutral marketplace claim and ranking-immutability commitment are upheld even when I'm tempted to delete a critical review (FR37, FR38, UX-DR7).

**Acceptance Criteria:**

**Given** FR37, FR38 and the route `src/app/(operator)/dashboard/reviews/page.tsx`,
**When** the developer creates `src/components/dashboard/ReviewReplyQueue.tsx`,
**Then** the page fetches reviews for Marcus's salon via `providers.reviews.list({salonId})` and renders each review with a "Reply publicly" composer and **no delete or alter affordance** (FR37 explicit — "the salon partner cannot delete or alter reviews").

**And** Reply submissions post to `/api/partners/reviews/[reviewId]/reply/route.ts`; brand replies enter the moderation queue (Story 7.7) before becoming public.

**And** any attempt to construct a delete/alter API call returns 403 Forbidden (NFR10, FR38). Vitest test asserts that a synthetic DELETE on `/api/reviews/[reviewId]` from the SalonPartner role returns 403.

**And** the page surfaces a banner "You can reply publicly. You cannot delete or alter customer reviews. This is structural to the platform." (UX-DR16 explicit honesty).

---

## Epic 7: Editorial Administration

Editorial Curator manages the canonical color taxonomy, brand-SKU-to-canonical mappings (with full audit logging), specialty-tier flagging, the LLM-classification audit queue (40+/90min keyboard-driven), and brand-reply ToS-only moderation. The epic also surfaces classification false-positive rate as a quality metric.

### Story 7.1: Build EditorialProvider write-side contract + audit log schema

As a developer building Elena's surface,
I want the `EditorialProvider` write-side methods implemented (taxonomy CRUD, mapping CRUD, audit logging, classification queue management) plus the audit log schema,
So that Stories 7.3-7.8 have a working contract to render against and every change is timestamp + actor + reason auditable in Demo V1 and Production V1 (FR40, NFR13, AR2).

**Acceptance Criteria:**

**Given** the `EditorialProvider` contract from Story 1.2,
**When** the developer extends `src/lib/providers/mock/MockEditorialProvider.ts` with write-side methods,
**Then** it implements `createColor(payload)`, `updateColor(slug, patch)`, `deactivateColor(slug, reason)`, `setSpecialtyTier(slug, isSpecialty)`, `createBrandColorMapping(payload)`, `updateBrandColorMapping(id, patch)`, `getAuditLog(entityType, entityId)`, `getClassificationQueue(filters)`, `classifyReview(reviewId, decision)`, and `getClassificationQuality()`.

**And** every mutation appends an audit log entry with shape `{entryId, entityType, entityId, actorId, action, beforePatch, afterPatch, reason?, timestamp}` (NFR13 immutable timestamped audit log) — the Vitest test asserts a synthetic update produces the corresponding audit entry.

**And** `src/lib/fixtures/audit-queue.json` contains pre-classified mock items for Elena's queue (~50 entries with varied confidence scores).

**And** in Production V1, the same writes go to a Drizzle `editorial_audit_log` table (schema declared in `src/lib/db/schema.ts`) with `INSERT`-only semantics — no UPDATE / DELETE on audit rows.

### Story 7.2: Implement EditorialCurator auth role + /operator/admin/* route gate

As the platform,
I want the `(operator)/admin/*` route group gated by `AuthProvider.requireRole("EditorialCurator")`,
So that taxonomy and audit-queue surfaces are accessible only to Sally-employed editorial admins (NFR10).

**Acceptance Criteria:**

**Given** the `(operator)/layout.tsx` from Story 6.2 (gated by SalonPartner OR EditorialCurator depending on subtree),
**When** the developer adds the admin-subtree role check,
**Then** any request to `/operator/admin/*` requires `EditorialCurator` (not SalonPartner); SalonPartner-role requests return 403.

**And** `MockAuthProvider` exposes a scripted "Elena" EditorialCurator identity for the demo walkthrough.

**And** Route Handlers under `/api/admin/*` independently invoke `requireRole("EditorialCurator")`; Vitest test asserts that a SalonPartner-role request to `/api/admin/taxonomy/route.ts` returns 403.

### Story 7.3: Build TaxonomyAdmin — color taxonomy editor

As Elena the editorial curator,
I want to manage the canonical color taxonomy — create / update / deactivate colors with searchable inline edit + bulk operations (re-tier, merge, split),
So that the brand-neutral marketplace claim is operationally maintainable, not frozen at launch (FR39, UX-DR7).

**Acceptance Criteria:**

**Given** UX-DR7's TaxonomyAdmin spec and FR39,
**When** the developer creates `src/components/dashboard/TaxonomyAdmin.tsx` with colocated tests + stories and the route `src/app/(operator)/admin/taxonomy/page.tsx`,
**Then** the page renders a searchable list of all canonical colors with inline-edit cells (canonical name / family / warmth / reference swatch / tier).

**And** bulk operations are exposed (re-tier multiple colors, merge two colors, split a color into two) via a multi-select toolbar — bulk operations open a confirmation Dialog (`<AlertDialog>`) with the diff preview before commit.

**And** every change posts to `/api/admin/taxonomy/route.ts` and writes both the entity update + the audit log entry atomically (Vitest test: a synthetic update produces both rows; rolling back the update rolls back the audit).

**And** conflicts (e.g., merging two colors that have different brand mappings) open a `<Dialog>` for explicit resolution (UX-DR7 conflict-detected state).

### Story 7.4: Build brand-SKU-to-canonical mapping editor with full audit logging

As Elena the editorial curator,
I want to manage brand-SKU-to-canonical-color mappings with full audit logging on every change,
So that the ≥3-brand intersection rule (FR12) is curatable as new brand SKUs come online and every mapping decision is forensically reconstructable (FR40, NFR13).

**Acceptance Criteria:**

**Given** FR40 and the audit-log schema from Story 7.1,
**When** the developer extends `<TaxonomyAdmin>` with a mapping editor sub-surface (or creates a sibling component),
**Then** the editor displays the current brand-SKU mapping table, allows inline edit of `(brandSlug, skuId, canonicalColorSlug, vendorColorName, deltaE)`, and validates each change via `src/lib/color-science/canonicalization.ts` (e.g., a mapping with ΔE > 2.0 raises a warning per `src/lib/color-science/delta-e.ts`).

**And** every mapping mutation appends an audit log entry with `{actorId, beforePatch, afterPatch, reason}`; the audit log is viewable via "View history" affordance per row.

**And** the audit log surface is read-only — there is no API to mutate audit entries (NFR13 immutability).

**And** the Vitest test asserts that a synthetic mapping update with `reason: ""` is rejected (reason required for non-trivial changes) and an update with `reason: "Wella reformulated SKU 4N to be 0.8 ΔE warmer"` produces the expected audit entry.

### Story 7.5: Build specialty-tier flagging surface

As Elena the editorial curator,
I want to flag colors as specialty-tier (1-2 brand offerings) and have the "1 brand only — unique look" or specialty-tier label propagate to consumer surfaces,
So that UX-DR16's honesty principle ("specialty-tier explicit") is operationally maintainable as brand catalog evolves (FR41).

**Acceptance Criteria:**

**Given** FR41 and Story 2.5's `<SpecialtyTierLabel>`,
**When** Elena toggles `tier: "specialty"` on a color in `<TaxonomyAdmin>`,
**Then** `MockEditorialProvider.setSpecialtyTier(slug, true)` updates the fixture (Demo V1) or the DB (Production V1) and writes an audit entry.

**And** consumer surfaces (`<ColorCard>`, `/colors/[colorSlug]`) reflect the new tier on next fetch — Vitest integration test asserts the propagation.

**And** when exactly 1 brand carries the specialty color, `<SpecialtyTierLabel>` renders the "1 brand only — unique look" label per FR11; when 2 brands carry it, the label reads "Specialty Tier — fewer than 3 brands carry this color" per UX-DR6.

### Story 7.6: Build AuditQueue with virtualized list + J/K/A/R/E keyboard shortcuts

As Elena the editorial curator,
I want a keyboard-driven audit list where I can clear 40+ items in 90 minutes via J/K (prev/next), A/R/E (accept/reject/edit), and ?/H (help),
So that the editorial throughput target is achievable and the surface is built for the way I actually work, not for a UI-toolkit-default mouse flow (FR42, NFR7, UX-DR7).

**Acceptance Criteria:**

**Given** UX-DR7's AuditQueue spec and FR42,
**When** the developer creates `src/components/dashboard/AuditQueue.tsx` with colocated tests + stories and the route `src/app/(operator)/admin/audit-queue/page.tsx`,
**Then** the page renders a virtualized list (react-window or @tanstack/react-virtual) of pending classifications: review text + suggested color label + ML confidence score + "Accept / Reject / Edit" affordances.

**And** keyboard shortcuts: `J` advances to next; `K` returns to previous; `A` accepts the focused classification (calls `providers.editorial.classifyReview(id, "accept")`); `R` rejects; `E` opens an inline edit composer; `?` or `H` opens a Dialog listing all shortcuts.

**And** the next item is pre-loaded so latency on `J` press is zero perceived (NFR7 — render 50 items ≤1s).

**And** current focus position is announced via live region (UX-DR13).

**And** every action has both keyboard shortcut and visible button (UX-DR7 explicit — accessibility for non-keyboard users too).

**And** queue empty state uses `<HonestEmptyState copy="Queue clear. Next batch arrives at the next ingestion run">` (UX-DR16).

**And** the Playwright `e2e/elena.spec.ts` test asserts a 5-item queue can be cleared via keyboard shortcuts within a synthetic timing budget.

### Story 7.7: Build BrandReplyModeration with ToS-only rejection + reason logging

As Elena the editorial curator,
I want a moderation queue for brand replies that enforces ToS-only rejection (not content disagreement) with required reason logging,
So that brand replies maintain the platform's "brands cannot delete reviews" guarantee while still removing literal ToS violations (FR43, UX-DR7).

**Acceptance Criteria:**

**Given** UX-DR7's BrandReplyModeration spec and FR43,
**When** the developer creates `src/components/dashboard/BrandReplyModeration.tsx` and the route `src/app/(operator)/admin/brand-replies/page.tsx`,
**Then** the page lists pending brand replies with the parent review for context, "Approve" CTA (Toast confirms), "Reject (ToS violation)" CTA (opens `<AlertDialog>` requiring a reason text + ToS-violation category dropdown).

**And** the page banner reads "Reject only for ToS violation. Brands cannot delete reviews; you cannot reject for content disagreement." (UX-DR16 explicit guidance).

**And** rejection writes an audit entry with the full reason + ToS-category; rejection without reason is impossible (the AlertDialog Confirm button is disabled until reason is non-empty).

**And** approved replies become visible on consumer surfaces via `<BrandReplyAffordance>` (Story 3.9).

**And** the Vitest test asserts that rejecting without a reason fails and rejecting with a reason writes the audit entry + flips the reply status to `rejected`.

### Story 7.8: Build ClassificationQualityMeter — false-positive rate metric

As Elena the editorial curator,
I want to see the classification false-positive rate as a quality metric on my admin home,
So that I can track the LLM classifier's drift over time and intervene if it spikes (FR44).

**Acceptance Criteria:**

**Given** FR44 and the audit log entries from Stories 7.6 + 7.7,
**When** the developer creates `src/components/dashboard/ClassificationQualityMeter.tsx` and surfaces it on `src/app/(operator)/admin/page.tsx`,
**Then** the component renders a single-metric card showing the rolling 30-day false-positive rate (count of rejected classifications ÷ total classified).

**And** trend (week-over-week or month-over-month) is shown as a sparkline.

**And** the underlying calculation in `MockEditorialProvider.getClassificationQuality()` is a pure aggregator over the audit log; Vitest test asserts that 10 accepted + 2 rejected synthetic entries produce a 16.7% false-positive rate.

**And** when the false-positive rate exceeds a threshold (e.g., 15%), the card displays a warning chip "Classifier drift detected — surface this in next ML team standup" (UX-DR10 warning pattern).

---

## Epic 8: User Identity, Consent & Notifications

Consumer can sign in with Sally Rewards (Production V1) or use the app in guest mode (both phases), receives explicit re-prompted consent before any photo is processed, requests deletion of all photos and personal data (with 30-day vendor propagation), benefits from default 30-day retention with opt-in indefinite save, receives post-booking review prompts, and earns Sally Rewards points for verified post-booking reviews.

### Story 8.1: Implement guest mode + MockAuthProvider scripted Maya identity

As Maya the consumer (and as the demo-walkthrough script),
I want to use the app in guest mode without signing in (both phases) and have the Demo V1 walkthrough switch to a scripted "logged-in Maya" identity for relevant moments,
So that Demo V1 demonstrates the auth-required surfaces without a real Sally Rewards integration (FR45 Demo V1, AR8, NFR16).

**Acceptance Criteria:**

**Given** the `AuthProvider` contract and AR8,
**When** the developer extends `src/lib/providers/mock/MockAuthProvider.ts`,
**Then** it implements `getCurrentUser()` returning either `{role: "Guest"}` (default) or a scripted `{userId, role: "Consumer", displayName: "Maya", sallyRewardsId: "demo-001"}` identity activated by a hidden dev-mode hot-key (Demo V1 only — never accessible in Production V1).

**And** `login()` and `logout()` in Demo V1 simply toggle the cookie that flips between Guest and the scripted identity.

**And** consumer-facing surfaces (`/colors`, `/try-on`, `/salons/*`) work without authentication; the only auth-gated consumer surface is `/account/*` (FR47-48 territory).

**And** the Production V1 OAuth flow is deferred to Story 8.7; Demo V1 ships with the guest + scripted-identity flow demonstrable.

### Story 8.2: Build consent state machine + immutable timestamped audit log

As the platform (and the BIPA / TX CUBI / GDPR compliance bar),
I want the consent state machine + immutable timestamped audit log behind every photo-processing event,
So that consent records are reconstructable for legal review and the photo-upload re-prompt rule (FR46) is enforceable at the data layer (FR46, NFR13, NFR15, cross-cutting concern #2).

**Acceptance Criteria:**

**Given** Story 1.6's consent-prompt UI and `src/lib/security/consent-state.ts` skeleton,
**When** the developer fully implements the state machine,
**Then** allowed transitions are: `not-consented` → `consented-local` | `consented-saved` | `declined`; from any consented state → `not-consented` requires a fresh prompt (no implicit re-consent — FR46).

**And** `src/lib/stores/consent.ts` (Zustand) consumes the state machine and exposes `consentStatus`, `lastPromptedAt`, `consentVersion`.

**And** `src/app/api/consent/grant/route.ts` POSTs append an immutable record `{userId, lookId, status, consentVersion, timestamp, ipAddress (Production V1), userAgent}` to the consent audit log (Demo V1: in-memory; Production V1: Postgres `consent_grants` table with INSERT-only semantics).

**And** `src/app/api/consent/history/route.ts` returns the user's consent history for the consent-history surface at `/account/consent`.

**And** the Vitest test in `consent-state.test.ts` asserts: a fresh user starts `not-consented`; after grant → `consented-local`; revocation requires a separate explicit action; the state machine refuses to accept implicit transitions.

**And** `e2e/consent-flow.spec.ts` (per architecture's existing spec list) asserts the re-prompt-on-every-upload rule end-to-end.

### Story 8.3: Build photo + data deletion API + /account/delete UI with 30-day propagation

As Maya the consumer,
I want to request deletion of all photos and associated personal data from my account settings, with deletion propagating to upstream vendors within 30 days,
So that the BIPA / TX CUBI / GDPR right-to-delete obligation is structurally satisfied (FR47, NFR15).

**Acceptance Criteria:**

**Given** FR47 and the route `src/app/(consumer)/account/page.tsx`,
**When** the developer creates the deletion UI + Route Handler `src/app/api/consent/revoke/route.ts`,
**Then** the account page exposes a "Delete all my photos and personal data" Tertiary-weight button + `<AlertDialog>` confirmation requiring the user to type "delete" (UX-DR9 destructive pattern).

**And** the Route Handler immediately purges in-memory + IndexedDB-stored photos for the user, marks the `account` row as `deletionRequestedAt`, and (Production V1) schedules a background job to propagate deletion to the AR SDK vendor + any retained photo storage within 30 days per NFR15.

**And** the deletion is audit-logged (NFR13).

**And** the user sees a confirmation Toast with `<ToastWithProvenance copy="Deletion requested. Local photos cleared. Vendor propagation completes within 30 days.">`.

**And** in Demo V1, the propagation step is mocked with a logged "would propagate to {vendor} now" event; the contract is complete so Production V1 swap is config-only.

### Story 8.4: Implement 30-day retention policy + opt-in indefinite save toggle

As the platform,
I want default photo retention capped at 30 days, with the consumer able to opt-in to indefinite save per saved-look,
So that the BIPA / TX CUBI / GDPR retention bar is enforced and the user always controls indefinite retention explicitly (FR48, NFR9, AR15).

**Acceptance Criteria:**

**Given** FR48 and Story 1.12's saved-looks persistence,
**When** the developer extends saved-looks with retention metadata,
**Then** every saved-look has `{retentionMode: "session" | "30-days" | "indefinite", expiresAt?: timestamp}` validated by Zod.

**And** a daily cleanup job (Demo V1: invoked on app boot; Production V1: cron) deletes saved-looks where `expiresAt < now`.

**And** the saved-looks UI on `/account` exposes a per-look retention toggle (30 days / Indefinite) — defaults to 30 days; opting to "Save indefinitely" requires an `<AlertDialog>` re-confirmation reminding the user the photo will be retained until explicitly deleted.

**And** Vitest test asserts the cleanup job deletes a saved-look with `expiresAt: now - 1day` and preserves one with `expiresAt: now + 1day`.

### Story 8.5: Build MockNotificationProvider + post-booking trigger sequence

As Maya the consumer post-booking,
I want to receive a review prompt via SMS at +24 hours, email at +7 days, and an in-app banner on my next visit,
So that my review submission rate is high enough to feed the platform's outcome data (FR49, NFR34, AR2).

**Acceptance Criteria:**

**Given** the `NotificationProvider` contract and FR49,
**When** the developer creates `src/lib/providers/mock/MockNotificationProvider.ts` and `src/lib/notifications/post-booking-trigger.ts`,
**Then** the trigger is invoked from Story 4.8's webhook receiver; the orchestrator schedules `{sms-24h, email-7d, in-app-banner-on-next-visit}` for the user.

**And** in Demo V1, the SMS / email channels are mocked — `MockNotificationProvider.send()` logs to the dev console + emits a `notification.scheduled` telemetry event, and the in-app banner channel renders a real banner via `<ToastWithProvenance>` when the user re-opens the app.

**And** in Production V1, `TwilioSendgridNotificationProvider` swap-in calls Twilio + SendGrid with retry logic (NFR34 — at-most-once per channel per booking).

**And** `src/lib/notifications/retry.ts` implements exponential backoff with a per-channel idempotency token so duplicate webhook deliveries don't produce duplicate sends.

**And** Vitest test asserts the trigger schedules exactly 3 notifications per booking and that the retry layer does not re-send on duplicate token.

### Story 8.6: Build Sally Rewards points award for verified post-booking photo reviews

As Maya the consumer,
I want to earn Sally Rewards points for verified post-booking reviews submitted with photos,
So that the loyalty integration creates a closed-loop incentive for high-quality outcome contributions (FR50).

**Acceptance Criteria:**

**Given** FR50 and Story 3.5's review submission,
**When** a review is submitted with `sourceClass: "native"`, `bookingAttributionTokenVerified: true`, and `photoUrl !== undefined`,
**Then** the system invokes `providers.auth.awardSallyRewardsPoints({userId, reason: "post-booking-photo-review", points: 100})` (point value declared as a server-side constant).

**And** in Demo V1, `MockAuthProvider.awardSallyRewardsPoints()` logs the award + emits `rewards.points_awarded` telemetry; in Production V1, `SallyRewardsAuthProvider` calls the real Sally Rewards API.

**And** the user sees a Toast confirmation `<ToastWithProvenance copy="Review submitted · 100 Sally Rewards points awarded">`.

**And** un-verified reviews (no booking attribution token) and reviews without photos do **not** trigger the points award — Vitest test asserts both negative cases.

### Story 8.7: Implement Sally Rewards OAuth 2.0 PKCE auth flow (Production V1 contract complete; impl deferred)

As the platform (Production V1),
I want the Sally Rewards OAuth 2.0 PKCE auth flow implemented as a `SallyRewardsAuthProvider` against the locked `AuthProvider` contract,
So that Production V1's auth swap is a config change, not a code change — and Demo V1 ships with the contract complete + a `// TODO: wire to real Sally Rewards endpoint` placeholder (FR45 Production V1, NFR12, AR8).

**Acceptance Criteria:**

**Given** AR8's OAuth 2.0 PKCE spec and architecture step 4,
**When** the developer creates `src/lib/auth/oauth-pkce.ts`, `src/lib/auth/cookies.ts`, `src/lib/auth/session.ts`, and the Route Handlers `/api/auth/{login,callback,logout}/route.ts`,
**Then** the PKCE flow is implemented per RFC 7636: code verifier generation, code challenge derivation, authorization-endpoint redirect, callback exchange for tokens, signed-cookie session establishment with HMAC-SHA256.

**And** session cookies are HTTP-only + Secure + SameSite=Lax with the HMAC secret rotated quarterly.

**And** `src/lib/providers/production/SallyRewardsAuthProvider.ts` implements the `AuthProvider` contract calling these Route Handlers; the implementation is **functional** in Demo V1 against a mock OAuth endpoint (a tiny in-app stub) so the contract is testable.

**And** Production V1 deployment swaps the mock OAuth endpoint URL via env var (`SALLY_REWARDS_OAUTH_ENDPOINT`) — no code change.

**And** the Vitest test asserts the PKCE flow round-trips correctly with a synthetic OAuth endpoint, the signed-cookie verification works, and tampering with the cookie invalidates the session.

**And** the e2e Playwright test asserts the login → consumer-surface → logout flow against the in-app mock OAuth endpoint.

