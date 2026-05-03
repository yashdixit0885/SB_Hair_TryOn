# Sally Beauty Hair Color Try-On

A brand-neutral hair color try-on app. Upload a selfie, browse colors (not brands), see yourself in any color with a realistic 90-day fade simulator and multi-lighting preview, see which brands offer that color alongside outcome-anchored reviews from real customers, then deep-link into a partner salon to book the appointment.

## Why this, and why Sally

Every other digital hair-color try-on is a single-brand toy (ModiFace, Madison Reed, Style My Hair) or a TikTok filter — the first is structurally biased, the second is entertainment, neither routes the consumer toward a real salon outcome. Sally Beauty is the only company that already owns **both sides** of this market — Sally Beauty Supply (consumer) and Beauty Systems Group (pro/salon distribution to thousands of salons) — at $3.7B FY2024 combined revenue. That dual ownership, plus Sally Rewards (~17M members) and 5,000 retail stores, is a moat a startup would spend two years and tens of millions trying to replicate.

The bet: build the only color try-on app that's **brand-neutral, outcome-tracked, and salon-routed** — and turn the precursor digital moment into the highest-converting funnel into our salon partner network.

## Status

Planning chain complete; ready for implementation.

- ✅ Brainstorming session (2026-05-02) — 20 ideas across 6 dimensions, V1 locked at 13 features
- ✅ Product Brief — audience: internal Product & Engineering team
- ✅ LLM-friendly distillate — token-efficient overflow context for downstream stages
- ✅ Product Requirements Document (2026-05-02) — 50 FRs, 43 NFRs, 8 capability areas, 5 actor types, dual-phase (Demo V1 + Production V1)
- ✅ UX Design Specification (2026-05-03) — Radix + Tailwind + shadcn component inventory, 5 journey flows (Maya, Janelle, Aliyah, Marcus, Elena), Editorial Magazine + Pro Tool design directions, WCAG 2.2 AA throughout
- ✅ Implementation Readiness Report (2026-05-03) — PRD validated; 0 critical issues; forward-looking guidance for downstream artifacts
- ✅ Architecture Decision Document (2026-05-03) — stack decisions (Next.js 16.2 + TypeScript strict + Drizzle + TanStack Query + Zustand + MediaPipe Tasks Vision), 9 provider interfaces (mock/production swap underwrites the demo→production single-codebase claim), full project structure with FR→file mapping, Mermaid visual architecture, 50/50 FR coverage + 43/43 NFR coverage validation
- ⏭ Next stage: **Epics & Stories** (`bmad-create-epics-and-stories`), then implementation

**Phasing model (binding):** Demo V1 (now, 8 weeks, runs locally on laptop + mobile, mocked vendors via provider abstractions, walked through to Sally Beauty execs) → Production V1 (post-funding, 16 weeks, same codebase, real vendors, cloud-deployed in DFW with full BIPA / TX CUBI / GDPR compliance).

## Key documents

| Document | Path | Purpose |
|---|---|---|
| Architecture Decision Document | [_bmad-output/planning-artifacts/architecture.md](_bmad-output/planning-artifacts/architecture.md) | Binding technical contract: stack, providers, project structure, patterns, validation. Read first if implementing. |
| Implementation Readiness Report | [_bmad-output/planning-artifacts/implementation-readiness-report-2026-05-03.md](_bmad-output/planning-artifacts/implementation-readiness-report-2026-05-03.md) | PRD validation + forward-looking guidance for epics/stories generation |
| UX Design Specification | [_bmad-output/planning-artifacts/ux-design-specification.md](_bmad-output/planning-artifacts/ux-design-specification.md) | Component inventory, journey flows, design system foundation, responsive + a11y strategy |
| Product Requirements Document | [_bmad-output/planning-artifacts/prd.md](_bmad-output/planning-artifacts/prd.md) | Capability contract: 50 FRs / 43 NFRs / phased success criteria |
| Executive Product Brief | [_bmad-output/planning-artifacts/product-brief-SB_Project.md](_bmad-output/planning-artifacts/product-brief-SB_Project.md) | Strategic framing and product vision |
| Brief Detail Pack (distillate) | [_bmad-output/planning-artifacts/product-brief-SB_Project-distillate.md](_bmad-output/planning-artifacts/product-brief-SB_Project-distillate.md) | Token-efficient context for downstream LLM/PRD work |
| Foundational Brainstorming Session | [_bmad-output/brainstorming/brainstorming-session-2026-05-02-0829.md](_bmad-output/brainstorming/brainstorming-session-2026-05-02-0829.md) | Ideation source |

**Reading order for newcomers:**
- Strategy / "why": Brief → Brainstorming
- Product surface / "what": PRD → UX Spec
- Engineering / "how": Architecture → Readiness Report

## Repository structure

```
.
├── README.md                                    # this file
├── LICENSE
├── .gitignore
├── _bmad-output/
│   ├── brainstorming/                           # ideation session outputs
│   ├── planning-artifacts/                      # product briefs, PRDs, distillates
│   ├── implementation-artifacts/                # (future) engineering plans, stories, sprint outputs
│   └── test-artifacts/                          # (future) test plans, NFR analysis, traceability
├── _bmad/
│   └── custom/                                  # BMad team-level customizations (committed)
├── design-artifacts/                            # WDS workflow outputs, by stage
│   ├── A-Product-Brief/
│   ├── B-Trigger-Map/
│   ├── C-UX-Scenarios/
│   ├── D-Design-System/
│   └── E-Development/
└── docs/                                        # additional project docs (added over time)
```

The BMad runtime (`_bmad/bmb/`, `_bmad/wds/`, `_bmad/scripts/`, etc.) is **not committed** — it's installed locally per developer like a dependency. Same for the local Claude Code skill caches (`.claude/`, `.agent/`, `.agents/`). The `.gitignore` enforces this.

## Setup (for new collaborators)

```bash
# 1. Clone
git clone https://github.com/yashdixit0885/SB_Hair_TryOn.git
cd SB_Hair_TryOn

# 2. Install the BMad runtime locally
#    (BMad is the structured planning toolkit this repo uses for
#    brainstorming → brief → PRD → architecture → stories → dev.
#    Follow your team's BMad install instructions; the runtime
#    will be regenerated under _bmad/ and is gitignored.)

# 3. (Optional) If using Claude Code, install your own copy of
#    relevant skills. The local skill caches are gitignored.
```

After install, `_bmad/custom/config.toml` (committed) carries any team-level customizations to BMad agent or workflow behavior. Personal overrides go in `_bmad/custom/config.user.toml`, which is gitignored.

## Working with this repo

The natural progression of artifacts in `_bmad-output/`:

1. **brainstorming/** — divergent ideation, fed in to drafting
2. **planning-artifacts/** — product briefs, PRDs, architecture decisions
3. **implementation-artifacts/** — sprint plans, stories, dev outputs
4. **test-artifacts/** — test design, NFR assessments, traceability matrices, CI config

Each stage's output is meant to be readable as both a human document AND a structured input to the next stage's tooling.

## Branching and commits

`main` is the integration branch. As the project moves into implementation, feature work should land via short-lived branches and PRs to `main`. Until then (planning stage), small docs commits direct to `main` are fine.

Commit messages: descriptive, focused on the *why* of the change, not just the *what*. The git log is documentation; treat it accordingly.

## License

See [LICENSE](LICENSE).
