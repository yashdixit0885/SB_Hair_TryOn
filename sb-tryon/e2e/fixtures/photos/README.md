# e2e fixture photos

Reference photos used by [janelle.spec.ts](../../janelle.spec.ts) to feasibility-check the MediaPipe Tasks Vision hair segmentation pipeline against Type-4 hair (architecture handoff step 5).

## Compliance posture

Per PRD §"Demo V1 Compliance Posture", these photos are **team-provided or curated stock** — never real user photos. Each photo must be copyright-clear (CC-0, Unsplash, internally-shot with model release, or otherwise licensed for project use). Document the source and license in the table below.

## Photo inventory

| File | Source | License | Texture (Andre Walker) | Notes |
|---|---|---|---|---|
| `type-4-fixture-1.jpg` | _TODO: add a Type-4 reference photo_ | _TODO_ | 4a/4b/4c | Used as the canonical Janelle smoke fixture |

## Adding new fixtures

1. Drop the file into this directory (`e2e/fixtures/photos/`).
2. Update the inventory table above with the source + license.
3. Keep dimensions ≤ 1024×1024 to keep CI artifact size in check.
4. Prefer well-lit front-facing portraits so the segmentation reaches a clear conclusion either way.

## Why this directory ships without real photos in Story 1.5

The story creates the harness and the e2e test scaffolding but defers the actual fixture photo to a Sally-approved source. Until a real Type-4 photo lands, [janelle.spec.ts](../../janelle.spec.ts) marks the AC14 smoke assertion as `test.fixme` (Playwright's "expected to be filled in" marker — runs but does not fail the suite).
