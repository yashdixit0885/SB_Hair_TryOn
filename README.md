# Sally Beauty Hair Color Try-On

A brand-neutral hair color try-on app. Upload a selfie, browse colors (not brands), see yourself in any color with a realistic 90-day fade simulator and multi-lighting preview, see which brands offer that color alongside outcome-anchored reviews from real customers, then deep-link into a partner salon to book the appointment.

## Why this, and why Sally

Every other digital hair-color try-on is a single-brand toy (ModiFace, Madison Reed, Style My Hair) or a TikTok filter — the first is structurally biased, the second is entertainment, neither routes the consumer toward a real salon outcome. Sally Beauty is the only company that already owns **both sides** of this market — Sally Beauty Supply (consumer) and Beauty Systems Group (pro/salon distribution to thousands of salons) — at $3.7B FY2024 combined revenue. That dual ownership, plus Sally Rewards (~17M members) and 5,000 retail stores, is a moat a startup would spend two years and tens of millions trying to replicate.

The bet: build the only color try-on app that's **brand-neutral, outcome-tracked, and salon-routed** — and turn the precursor digital moment into the highest-converting funnel into our salon partner network.

## Status

Planning complete. Demo V1 implementation underway in [`sb-tryon/`](sb-tryon/).

**Planning chain (done):**
- ✅ Brainstorming session (2026-05-02) — 20 ideas across 6 dimensions, V1 locked at 13 features
- ✅ Product Brief + LLM distillate — audience: internal Product & Engineering team
- ✅ Product Requirements Document (2026-05-02) — 50 FRs, 43 NFRs, 8 capability areas, 5 actor types, dual-phase
- ✅ UX Design Specification (2026-05-03) — Radix + Tailwind + shadcn inventory, 5 journey flows (Maya, Janelle, Aliyah, Marcus, Elena), Editorial Magazine + Pro Tool design directions, WCAG 2.2 AA
- ✅ Implementation Readiness Report (2026-05-03) — PRD validated; 0 critical issues
- ✅ Architecture Decision Document (2026-05-03) — Next.js 16.2 + React 19 + TypeScript strict + Tailwind v4 + Drizzle + TanStack Query + Zustand + MediaPipe Tasks Vision; 10 provider interfaces (`ARProvider`, `ReviewProvider`, `AuthProvider`, `AttributionProvider`, `NotificationProvider`, `BookingHandoffProvider`, `SalonProvider`, `BSGProvider`, `CalendarProvider`, `EditorialProvider`); 50/50 FR coverage + 43/43 NFR coverage
- ✅ Epics & Stories (2026-05-03) — 8 epics, 66 stories with BDD acceptance criteria

**Implementation (in progress):**
- ✅ Story 1.1 — Next.js + shadcn scaffold + 7 CI gates (typecheck, lint, unit ≥70% coverage, E2E, bundle-size, Lighthouse, story coverage) + Chromatic visual regression
- ✅ Story 1.2 — 10 provider contracts + factory + `<ProvidersContext>` + 10-overload `useProvider` hook + ESLint vendor-isolation rule. Stub mocks throw `ProviderError("NOT_IMPLEMENTED")` until later stories fill them in. 64 unit tests / 100% coverage on `src/lib/**`.
- ✅ Story 1.3 — OKLCH design tokens in `globals.css @theme` + 21 shadcn/Radix primitives in `src/components/ui/` + Storybook 10 with `ProvidersContext` global decorator + in-house `toHaveNoViolations` axe matcher. 102 unit tests / 53 Storybook stories (all with `a11y.test = "error"`).
- ✅ Story 1.4 — 7 cross-cutting layout primitives in `src/components/layout/` (`PageShell`, `AppHeader`, `DensityContainer`, `HonestEmptyState`, `ToastWithProvenance`, `SkipToContent`, `ErrorBanner`) with colocated tests + stories. `app/page.tsx` refactored to compose `<PageShell>` (legacy create-next-app tokens removed). Keyboard-only Playwright spec wired (NFR23 tab order + skip-link focus, cross-browser). 133 unit tests / 77 Storybook stories / 27 E2E tests across 3 browsers. Bundle 210.78 KB gzipped (+6.63 KB vs 1.3, well under 300 KB NFR8 ceiling).
- ✅ Story 1.5 — `MockARProvider` powered by `@mediapipe/tasks-vision` (hair segmentation via the `selfie_multiclass_256x256` model, GPU delegate, IndexedDB-cached model bytes) + 6 pure-math AR modules in `src/lib/ar/` (`color-shift` sRGB↔Lab + GLSL ES 3.00 fragment shader, `fade-blend`, 3-preset `lighting-postprocess`, Canvas 2D fallback, WebGL2 capability probe) + telemetry seam in `src/lib/observability/` + IndexedDB model cache in `src/lib/persistence/` + `noopArProvider()` test util + Storybook decorator override + `/test/ar-smoke` Playwright harness. ESLint isolation holds — only `MockARProvider.ts` imports `@mediapipe/*`. 192 unit tests / 78 Storybook stories / 8 E2E + 1 fixme (Janelle Type-4 smoke awaits a copyright-clear fixture photo — tracked as D-1-5-F in [deferred-work.md](_bmad-output/implementation-artifacts/deferred-work.md)). Initial bundle 171.28 KB gzipped — `.size-limit.cjs` now measures `rootMainFiles + polyfillFiles` from `build-manifest.json`, excluding the lazy AR chunk where MediaPipe lives (faithful to NFR8 "≤300 KB excluding @mediapipe/*").
- 📋 Story 1.6 (next) — `PhotoUploader` + `ConsentPrompt` + consent state machine
- 📋 Stories 1.7–8.7 — backlog (see [sprint-status.yaml](_bmad-output/implementation-artifacts/sprint-status.yaml))

**Phasing model (binding):** Demo V1 (now, 8 weeks, runs locally on laptop + mobile, mocked vendors via provider abstractions, walked through to Sally Beauty execs) → Production V1 (post-funding, 16 weeks, same codebase, real vendors, cloud-deployed in DFW with full BIPA / TX CUBI / GDPR compliance). The mock→production swap is enforced as a config + procurement change by the provider abstraction; ESLint blocks any feature code from importing vendor SDKs directly.

## Key documents

**Planning artifacts** (`_bmad-output/planning-artifacts/`):

| Document | Path | Purpose |
|---|---|---|
| Architecture Decision Document | [architecture.md](_bmad-output/planning-artifacts/architecture.md) | Binding technical contract: stack, providers, project structure, patterns, validation. Read first if implementing. |
| Epics & Stories | [epics.md](_bmad-output/planning-artifacts/epics.md) | 8 epics, 66 stories with BDD-form acceptance criteria. The canonical scope contract for implementation. |
| UX Design Specification | [ux-design-specification.md](_bmad-output/planning-artifacts/ux-design-specification.md) | Component inventory, journey flows, design system foundation, responsive + a11y strategy |
| Product Requirements Document | [prd.md](_bmad-output/planning-artifacts/prd.md) | Capability contract: 50 FRs / 43 NFRs / phased success criteria |
| Implementation Readiness Report | [implementation-readiness-report-2026-05-03.md](_bmad-output/planning-artifacts/implementation-readiness-report-2026-05-03.md) | PRD validation + forward-looking guidance for epics/stories generation |
| Executive Product Brief | [product-brief-SB_Project.md](_bmad-output/planning-artifacts/product-brief-SB_Project.md) | Strategic framing and product vision |
| Brief Detail Pack (distillate) | [product-brief-SB_Project-distillate.md](_bmad-output/planning-artifacts/product-brief-SB_Project-distillate.md) | Token-efficient context for downstream LLM/PRD work |
| Foundational Brainstorming Session | [_bmad-output/brainstorming/brainstorming-session-2026-05-02-0829.md](_bmad-output/brainstorming/brainstorming-session-2026-05-02-0829.md) | Ideation source |

**Implementation artifacts** (`_bmad-output/implementation-artifacts/`):

| Document | Path | Purpose |
|---|---|---|
| Sprint Status | [sprint-status.yaml](_bmad-output/implementation-artifacts/sprint-status.yaml) | Authoritative state of every epic and story (`backlog` / `ready-for-dev` / `in-progress` / `review` / `done`) |
| Per-story dev guides | `{epic}-{story}-{slug}.md` in [implementation-artifacts/](_bmad-output/implementation-artifacts/) | Comprehensive context for the dev agent: ACs, tasks, interface signatures, file structure, downstream handoff contracts |
| Deferred Work Log | [deferred-work.md](_bmad-output/implementation-artifacts/deferred-work.md) | Items intentionally deferred from review/dev cycles, with the story that should pick them up |

**Reading order for newcomers:**
- Strategy / "why": Brief → Brainstorming
- Product surface / "what": PRD → UX Spec
- Engineering / "how": Architecture → Readiness Report → Epics → current story file in `implementation-artifacts/`
- Codebase / "where": [`sb-tryon/AGENTS.md`](sb-tryon/AGENTS.md) is the agent rulebook for the actual implementation

## Repository structure

```
.
├── README.md                                    # this file
├── LICENSE
├── .gitignore
├── sb-tryon/                                    # the Demo V1 codebase (Next.js 16 + shadcn + provider pattern)
│   ├── src/                                     # app routes, components, lib (providers, stores, queries, etc.)
│   ├── e2e/                                     # Playwright journey + smoke specs (Maya, Janelle, Aliyah, Marcus, Elena, …)
│   ├── .storybook/                              # Storybook config
│   ├── .github/workflows/                       # CI (ci.yml + chromatic.yml)
│   ├── AGENTS.md                                # coding-agent rulebook — mirrors architecture.md §5
│   ├── package.json                             # pnpm scripts: dev / build / typecheck / lint / test:unit / test:e2e / storybook
│   └── …                                        # see sb-tryon/README.md for the full layout
├── _bmad-output/
│   ├── brainstorming/                           # ideation session outputs
│   ├── planning-artifacts/                      # PRD, UX spec, architecture, epics, readiness report
│   ├── implementation-artifacts/                # per-story dev guides, sprint-status.yaml, deferred-work.md
│   └── test-artifacts/                          # (future) test plans, NFR analysis, traceability
└── _bmad/
    └── custom/                                  # BMad team-level customizations (committed)
```

The BMad runtime (`_bmad/bmb/`, `_bmad/bmm/`, `_bmad/scripts/`, etc.) is **not committed** — it's installed locally per developer like a dependency. Same for the local Claude Code skill caches (`.claude/`, `.agent/`, `.agents/`). The `.gitignore` enforces this. `sb-tryon/node_modules/`, `.next/`, `coverage/`, `storybook-static/`, and `test-results/` are likewise excluded — see [`sb-tryon/.gitignore`](sb-tryon/.gitignore).

## Setup (for new collaborators)

**Prerequisites:** Node 20 LTS (see [`sb-tryon/.nvmrc`](sb-tryon/.nvmrc)) and pnpm 10 (`corepack enable && corepack prepare pnpm@10.33.2 --activate`).

```bash
# 1. Clone
git clone https://github.com/yashdixit0885/SB_Hair_TryOn.git
cd SB_Hair_TryOn

# 2. Install codebase dependencies
cd sb-tryon
pnpm install --frozen-lockfile
pnpm dlx playwright install chromium webkit firefox  # for E2E tests
cp .env.example .env.local                           # all defaults work for Demo V1 (mock providers)

# 3. (Optional) Install the BMad runtime if you'll author stories or run planning workflows.
#    BMad is the structured planning toolkit this repo uses for brief → PRD →
#    architecture → epics → stories → dev. The runtime regenerates under _bmad/
#    and is gitignored; only _bmad/custom/ (team customizations) is committed.

# 4. (Optional) If using Claude Code, install your own copy of relevant skills.
#    The local skill caches (.claude/, .agent/, .agents/) are gitignored.
```

**Daily commands** (run from `sb-tryon/`):

| Command | What it does |
|---|---|
| `pnpm dev` | Start Next.js dev server at http://localhost:3000 |
| `pnpm typecheck` | TypeScript strict, zero errors expected |
| `pnpm lint` | ESLint including the provider-import-restriction rule + TS strictness (`no-explicit-any`, `no-non-null-assertion`) |
| `pnpm test:unit` | Vitest with ≥70% coverage on `src/lib/**` |
| `pnpm test:e2e` | Playwright across Chromium + WebKit + Firefox |
| `pnpm storybook` | Storybook dev at http://localhost:6006 |
| `pnpm build` | Next.js production build |
| `pnpm size-limit` | Bundle-size assertion (≤300KB gzipped excluding `@mediapipe/*`) |
| `pnpm lhci` | Lighthouse CI against `lighthouserc.cjs` budgets |

CI runs all of these in order; any failure blocks merge. See [`sb-tryon/.github/workflows/ci.yml`](sb-tryon/.github/workflows/ci.yml).

## Working with this repo

**Implementation flow** (current phase):

1. Pick the first `backlog` story from [`_bmad-output/implementation-artifacts/sprint-status.yaml`](_bmad-output/implementation-artifacts/sprint-status.yaml) (top-down by epic, in order).
2. Run `/bmad-create-story` to generate the per-story dev guide. Sprint status flips to `ready-for-dev`.
3. Run `/bmad-dev-story` (or implement manually following the dev guide). Status flips to `in-progress`.
4. Run `/bmad-code-review` when complete. Status flips through `review` to `done`.
5. Repeat. Each story builds on the last; epic-1 lays the foundation, epics 2-8 are largely parallelizable once the provider contracts (Story 1.2) and primitives (Story 1.3) are in.

The architecture and AGENTS.md are the binding contracts — when a dev guide and architecture disagree, the architecture wins; surface the conflict via the `correct-course` workflow rather than diverging silently.

**Artifact progression in `_bmad-output/`:**

1. **brainstorming/** — divergent ideation (done)
2. **planning-artifacts/** — briefs, PRD, UX spec, architecture, epics (done)
3. **implementation-artifacts/** — per-story dev guides, sprint state, deferred work (active)
4. **test-artifacts/** — (future) test plans, NFR analysis, traceability matrices

## Branching and commits

`main` is the integration branch. Feature work for stories should land via short-lived branches and PRs to `main` once collaborators join; solo implementation can continue committing direct to `main` while the team is one developer.

Commit messages: descriptive, focused on the *why* of the change, not just the *what*. The git log is documentation; treat it accordingly.

## License

See [LICENSE](LICENSE).
