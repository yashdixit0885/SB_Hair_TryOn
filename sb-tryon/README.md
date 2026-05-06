# sb-tryon

The Demo V1 codebase for the Sally Beauty hair color try-on app.

> See the [root README](../README.md) for the project's strategic framing, planning chain, and reading order. See [AGENTS.md](AGENTS.md) for the binding rules every coding agent and engineer must follow before changing this codebase.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack) | Locked by [architecture.md §3](../_bmad-output/planning-artifacts/architecture.md) |
| Language | TypeScript 5 (strict) | NFR35; no `any`, no `!` non-null assertions |
| UI | Tailwind v4 + shadcn/Radix + Lucide | UX-DR1, UX-DR2 — OKLCH design tokens + 21 primitives live in `src/components/ui/` (Story 1.3) |
| State | Zustand + TanStack Query v5 + URL state + IndexedDB | Four-tier ownership model; see architecture §4 |
| AR | MediaPipe Tasks Vision + WebGL2 fragment shader (Demo V1) | Behind `ARProvider`; real SDK swap is post-funding |
| Persistence | Drizzle ORM + Postgres (Production V1 only) | Demo V1 uses JSON fixtures via mock providers |
| Test | Vitest 4 + axe-core + Playwright 1.59 (Chromium/WebKit/Firefox) + Storybook 10 + Chromatic | NFR23, NFR39 |
| Build / CI | pnpm 10 + size-limit + Lighthouse CI | Budget gates block merge |

## Provider pattern (the architectural spine)

Every external dependency — MediaPipe, Twilio, SendGrid, Sally Rewards SSO, BSG, Booksy/Vagaro/Square, Google Places, etc. — sits behind one of 10 provider interfaces in [`src/lib/providers/contracts/`](src/lib/providers/contracts/). Feature code imports from `@/lib/providers`, never from a vendor SDK directly. ESLint enforces this — see the `no-restricted-imports` rule in [`eslint.config.mjs`](eslint.config.mjs).

**Server Components** call `createProviders()` directly from `@/lib/providers`. **Client Components** read providers via the strictly-typed `useProvider()` hook (10 function overloads, zero `any` casts) inside the `<ProvidersContext.Provider>` populated by [`<RootProviders>`](src/components/root-providers.tsx). Construction lives client-side because Next.js RSC serialization rejects class instances crossing the Server→Client boundary.

The Demo V1 → Production V1 transition is an env-var swap (`NEXT_PUBLIC_PROVIDER_MODE=mock` → `production`) plus procurement, not a code change in business logic. That's the single-codebase commitment (NFR35) — and it's mechanically defensible, not aspirational. Current status: 10 contracts live; 10 stub mocks throwing `ProviderError("NOT_IMPLEMENTED")` until later stories fill them in (Story 1.5 wires MediaPipe-backed `MockARProvider`, Story 2.1 the `MockEditorialProvider`, Story 3.1 `MockReviewProvider`, etc.).

## Prerequisites

- Node 20 LTS (see [`.nvmrc`](.nvmrc))
- pnpm 10.33.2 (`corepack enable && corepack prepare pnpm@10.33.2 --activate`)
- A Chromium-class browser for local dev. Playwright installs Chromium/WebKit/Firefox for E2E.

## Getting started

```bash
pnpm install --frozen-lockfile
pnpm dlx playwright install chromium webkit firefox
cp .env.example .env.local                # all defaults work for Demo V1 (mock providers)
pnpm dev
```

Open http://localhost:3000.

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Next.js dev server (Turbopack), http://localhost:3000 |
| `pnpm build` | Production build |
| `pnpm start` | Run the production build |
| `pnpm typecheck` | `tsc --noEmit`, strict |
| `pnpm lint` | ESLint — Next + Storybook configs + provider-import-restriction rule + TS strictness (no-explicit-any, no-non-null-assertion) |
| `pnpm test:unit` | Vitest with v8 coverage; threshold ≥70% on `src/lib/**` |
| `pnpm test:unit:watch` | Vitest in watch mode |
| `pnpm test:storybook` | Storybook component tests via Vitest |
| `pnpm test:e2e` | Playwright across Chromium + WebKit + Firefox; auto-starts dev server |
| `pnpm storybook` | Storybook dev at http://localhost:6006 |
| `pnpm build-storybook` | Static Storybook for Chromatic |
| `pnpm check:stories` | Asserts every `src/components/**/*.tsx` has a `.stories.tsx` |
| `pnpm size-limit` | Bundle-size budget assertion |
| `pnpm lhci` | Lighthouse CI against `lighthouserc.cjs` |

## CI gates (binding order)

CI runs every command above, in order, on every PR. Earlier failures short-circuit later gates. Configured in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) and [`.github/workflows/chromatic.yml`](.github/workflows/chromatic.yml).

1. `pnpm typecheck`
2. `pnpm lint`
3. `pnpm test:unit` — coverage ≥70% on `src/lib/**` (NFR39)
4. `pnpm test:e2e` — 5 personas + keyboard-only + consent + attribution suites (NFR23, NFR29)
5. `pnpm build` + `pnpm size-limit` — bundle ≤300KB gzipped excluding `@mediapipe/*` (NFR8)
6. `pnpm lhci` — Web Vitals budgets (NFR5, NFR8)
7. `pnpm check:stories` — every component has a story (UX-DR15)
8. Chromatic — visual regression; designer reviews any change

## Project layout

```
sb-tryon/
├── src/app/                     # Next.js App Router routes (≤150 lines per route file)
│   ├── (consumer)/              # density-comfortable + Editorial Magazine direction
│   ├── (operator)/              # density-compact + Pro Tool direction
│   ├── (stylist)/               # iPad chair-side
│   ├── api/                     # Route Handlers
│   ├── layout.tsx               # Root layout — Server Component; wraps children in <RootProviders>
├── src/components/
│   ├── root-providers.tsx       # "use client" wrapper: QueryClientProvider + ProvidersContext.Provider
│   └── page.tsx                 # Home / value-prop landing (composes <PageShell variant="consumer">)
├── src/components/              # UI components — colocated .test.tsx + .stories.tsx
│   ├── ui/                      # shadcn/Radix primitives (Story 1.3) — 21 primitives
│   ├── layout/                  # Cross-cutting shells (Story 1.4) — PageShell, AppHeader, DensityContainer,
│   │                            #   HonestEmptyState, ToastWithProvenance, SkipToContent, ErrorBanner
│   ├── render/                  # AR render surface (Epic 1, Story 1.5+)
│   ├── reviews/, discovery/, dashboard/, stylist/
├── src/lib/                     # Shared logic, no JSX
│   ├── providers/               # Provider abstractions: contracts/, mock/, production/, factory.ts, context.tsx
│   ├── ar/, security/, observability/, auth/, notifications/, reviews/, color-science/, …
│   └── stores/, queries/, schemas/, fixtures/, db/
├── e2e/                         # Playwright (5 persona journeys + keyboard-only + consent + attribution)
├── .storybook/                  # Storybook config
├── .github/workflows/           # CI + Chromatic
├── AGENTS.md                    # ← read this before changing anything
├── CLAUDE.md                    # @AGENTS.md (Claude Code import directive)
└── eslint.config.mjs            # Next + Storybook + provider-import rule + TS strictness
```

For the full target file tree (post-Story-1.2 onward), see [architecture.md §6](../_bmad-output/planning-artifacts/architecture.md).

## Status

- ✅ Story 1.1 — scaffold + 7 CI gates + Chromatic ([dev guide](../_bmad-output/implementation-artifacts/1-1-initialize-nextjs-shadcn-project-scaffold-with-ci-gates.md))
- ✅ Story 1.2 — 10 provider contracts + factory + `<ProvidersContext>` + `useProvider` hook + ESLint vendor-isolation ([dev guide](../_bmad-output/implementation-artifacts/1-2-define-9-provider-contracts-factory-providerscontext-eslint-enforcement.md)). 64 unit tests / 100% coverage on `src/lib/**`.
- ✅ Story 1.3 — OKLCH design tokens (`globals.css @theme` with `--color-*`, `--radius-*`, `--shadow-*` tokens) + 21 Radix-wrapped primitives in [`src/components/ui/`](src/components/ui/) + Storybook 10 with `ProvidersContext` global decorator + in-house `toHaveNoViolations` axe matcher in [`src/test-utils/`](src/test-utils/). `renderWithProviders()` wraps RTL with all 10 mock providers. 102 unit tests / 53 Storybook stories (all tagged `a11y.test = "error"`). ([dev guide](../_bmad-output/implementation-artifacts/1-3-implement-oklch-design-tokens-foundation-primitives-storybook-axe-core.md))
- ✅ Story 1.4 — 7 cross-cutting layout primitives in [`src/components/layout/`](src/components/layout/): `PageShell` (skip-link first, route-change focus-on-h1, density boundary), `AppHeader` (consumer/operator/stylist discriminated-union variants with `aria-current` page marking), `DensityContainer` (the only surface for `data-density` per AC5), `HonestEmptyState` (required `copy` prop, runtime invariant), `ToastWithProvenance` (UX honesty pattern #3), `SkipToContent` (WCAG 2.4.1 bypass block), `ErrorBanner` (`role="alert"`). `app/page.tsx` refactored to compose `<PageShell>` — all legacy `create-next-app` tokens removed. Keyboard-only Playwright spec wired for NFR23 (tab order + skip-link, cross-browser). 133 unit tests / 77 Storybook stories / 27 E2E tests across 3 browsers. Bundle 210.78 KB gzipped. ([dev guide](../_bmad-output/implementation-artifacts/1-4-build-cross-cutting-layout-shells.md))
- 📋 Story 1.5 (next) — `MockARProvider` + MediaPipe Tasks Vision segmentation pipeline
- 📋 Stories 1.6 → 8.7 — backlog (see [`sprint-status.yaml`](../_bmad-output/implementation-artifacts/sprint-status.yaml))

## Where things are documented

| Question | Source |
|---|---|
| What pattern should I use? | [`AGENTS.md`](AGENTS.md) — agent rulebook, binding |
| Why was X chosen? | [`architecture.md`](../_bmad-output/planning-artifacts/architecture.md) — decision document |
| What's in scope for V1? | [`prd.md`](../_bmad-output/planning-artifacts/prd.md) — 50 FRs / 43 NFRs |
| How should this look? | [`ux-design-specification.md`](../_bmad-output/planning-artifacts/ux-design-specification.md) — component inventory + journeys |
| What story am I on? | [`sprint-status.yaml`](../_bmad-output/implementation-artifacts/sprint-status.yaml) — authoritative state |
| What's deferred? | [`deferred-work.md`](../_bmad-output/implementation-artifacts/deferred-work.md) — items pushed to later stories |

If `AGENTS.md` and `architecture.md` disagree, the architecture wins; PR a fix to `AGENTS.md` in the same change set.
