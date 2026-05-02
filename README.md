# Sally Beauty Hair Color Try-On

A brand-neutral hair color try-on app. Upload a selfie, browse colors (not brands), see yourself in any color with a realistic 90-day fade simulator and multi-lighting preview, see which brands offer that color alongside outcome-anchored reviews from real customers, then deep-link into a partner salon to book the appointment.

## Why this, and why Sally

Every other digital hair-color try-on is a single-brand toy (ModiFace, Madison Reed, Style My Hair) or a TikTok filter — the first is structurally biased, the second is entertainment, neither routes the consumer toward a real salon outcome. Sally Beauty is the only company that already owns **both sides** of this market — Sally Beauty Supply (consumer) and Beauty Systems Group (pro/salon distribution to thousands of salons) — at $3.7B FY2024 combined revenue. That dual ownership, plus Sally Rewards (~17M members) and 5,000 retail stores, is a moat a startup would spend two years and tens of millions trying to replicate.

The bet: build the only color try-on app that's **brand-neutral, outcome-tracked, and salon-routed** — and turn the precursor digital moment into the highest-converting funnel into our salon partner network.

## Status

- Brainstorming session complete (2026-05-02) — 20 ideas across 6 dimensions, V1 locked at 13 features
- Product brief complete — audience: internal Product & Engineering team
- LLM-friendly distillate complete — input for the next stage
- Next stage: **PRD creation**, then architecture, then implementation

## Key documents

| Document | Path |
|---|---|
| Executive Product Brief | [_bmad-output/planning-artifacts/product-brief-SB_Project.md](_bmad-output/planning-artifacts/product-brief-SB_Project.md) |
| Detail Pack (token-efficient distillate for downstream LLM/PRD work) | [_bmad-output/planning-artifacts/product-brief-SB_Project-distillate.md](_bmad-output/planning-artifacts/product-brief-SB_Project-distillate.md) |
| Foundational Brainstorming Session | [_bmad-output/brainstorming/brainstorming-session-2026-05-02-0829.md](_bmad-output/brainstorming/brainstorming-session-2026-05-02-0829.md) |

Start with the Product Brief if you're new to the project. The Detail Pack is what to feed to a PRD-creation workflow or an LLM helping with sprint planning.

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
