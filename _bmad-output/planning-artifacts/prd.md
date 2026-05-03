---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete']
status: 'complete'
completedDate: '2026-05-02'
releaseMode: phased
demoTimeline: '8 weeks (confirmed) — full Demo V1 feature set built against mocked providers. 1-2 weeks of dry-run hardening before exec meeting included in the 8.'
classification:
  projectType: web_app
  projectTypeNotes: 'web + responsive mobile single codebase in V1; native iOS/Android deferred to V2+'
  domain: consumer_marketplace_with_biometric_privacy
  domainNotes: 'No CSV vertical fits cleanly. Two-sided marketplace (salons + brands paid; consumer free) with biometric-privacy exposure (BIPA/TX CUBI/GDPR). Consumer-commerce overlay with class-action-precedent privacy regime.'
  complexity: high
  complexityDrivers:
    - 'BIPA/CUBI/GDPR exposure on selfie data; signed DPA with SDK vendor required'
    - 'Two-sided cold-start: 5 brand LOIs + 10 salon LOIs + 5K WAU target concurrent'
    - 'Verified attribution chain (deep-link → webhook → POS reconciliation), not self-report'
    - 'Two custom render features (90-day fade simulator, 3-preset multi-lighting) on top of licensed SDK; wks-0-2 feasibility spike required'
    - 'Cross-side incentive risks: paid placement neutrality, brand suppression pressure, Sally private-label brand handling'
  projectContext: greenfield
visionResolved:
  framing: 'single-spine (per Victor) — V1 is a CAC funnel that is also a data-acquisition vehicle; funnel economics fund the flywheel. Conservative/Ambitious dual framing struck as hedging.'
  spineSentence: 'She is about to do something she cannot undo for six months. We are the last honest mirror before she does.'
  protagonist: 'The Considered Color-Changer — woman, 25-45, late-night research mode, terrified of an irreversible 6-month outcome on her hair, mistrustful of brand filters and TikTok colorists. App is mentor figure, not hero. Elixir returned: she walked in knowing, she walked out matching what she knew.'
  pitchLine: 'The only color try-on app that''s brand-neutral, outcome-tracked, and salon-routed.'
  differentiatorStackRefined:
    - layer: 1
      name: 'Sally cross-side ownership'
      role: 'spine — neutrality flows from this'
      detail: 'BSG + Sally Beauty Supply + ~17M Sally Rewards + 5,000 stores. CAC-to-replicate: 2yrs + tens of millions for any startup.'
    - layer: 2
      name: 'Outcome-data flywheel'
      role: 'platform bet, not present-tense moat'
      detail: '~100 reviewed outcomes/month vs 150-cell matrix at launch = 12-18mo ramp. Instrument from day 1; payload arrives later. Exec Summary must say "future flywheel, present-tense thin."'
    - layer: 3
      name: 'Texture-first build'
      role: 'price of admission to actual customer base'
      detail: 'Type 4 hair as hard SDK selection criterion. Not decoration. Promote framing.'
    - layer: 4
      name: 'Public Review Integrity Policy (narrowed)'
      role: 'reason Layer 2 data has resale value'
      detail: 'Applies to native on-platform reviews only. Ingested third-party (Google Places, brand feeds) displayed as-attributed and immutable by us. Honest about what we control.'
  consequencesNotStandaloneLayers:
    - 'Structural neutrality (was Layer 3) — consequence of Layer 1; L''Oréal/Madison Reed cannot replicate without invalidating their own thesis'
    - 'Closed-loop attribution (was Layer 5) — reframed as "eventually-consistent closed-loop": deep-link + webhook = best-effort booking attribution (~70% honest); BSG-side product-pull join = T+7 high-fidelity purchase attribution. Do not promise real-time in PRD.'
    - 'Same-color-same-render (was Layer 7) — V1 architectural property enabled by catalog scope; design tenet, not moat. Strike from differentiator stack.'
  weekZeroGateAdditions:
    - 'Sally-side activation SLA (#7): named owner at Sally for BSG-routes-stylist-demand + Sally Rewards mailing commitment + DFW-10-salons staff training to ask "did you try it in the app?". Without this, Layer 1 is balance-sheet asset, not product advantage; Layer 5 collapses with it.'
  scopeAdjustmentsBdMotion:
    - 'Beauty school defensive LOI (Week 0 BD): 1 LOI with 1 beauty school (Aveda / Paul Mitchell / Empire) before launch. Costs zero eng capacity; closes the front-running window where a no-Sally-assets competitor could neutralize Layer 1 by signing schools exclusively. Beauty schools remain V1.5 build scope.'
  rejectedFromExecSummary:
    - 'Conservative/Ambitious dual framing — strike as hedging'
    - 'Layer 7 (same-color-same-render) as differentiator — relabel design tenet'
    - 'Real-time closed-loop attribution claims — replace with eventually-consistent'
    - 'Present-tense flywheel claims — relabel future-state bet'
inputDocuments:
  - _bmad-output/planning-artifacts/product-brief-SB_Project-distillate.md
  - _bmad-output/planning-artifacts/product-brief-SB_Project.md
  - _bmad-output/brainstorming/brainstorming-session-2026-05-02-0829.md
documentCounts:
  briefs: 2
  research: 0
  brainstorming: 1
  projectDocs: 0
projectType: greenfield
workflowType: 'prd'
audience: 'Internal Product & Engineering team'
toneGuidance: 'bias-to-ship, decisive, technical-fluent — match the brief'
demoDecisions:
  phase: 'Demo V1 (pre-funding) is the primary near-term build; Production V1 plan documented for post-funding deployment'
  buildAsProduction: 'Same codebase as production. Provider-pattern abstractions: mock providers (demo) swap to real providers (production) via DI. Localhost swaps to cloud via deployment config. No fork.'
  team: '1 PM + 6 eng + 1 designer + 1 BD + 1 editorial — same as brief. Eng resources funded; vendor contracts + cloud infra payments are NOT.'
  arStack: 'MediaPipe Hair Segmentation (Google, free, MIT) + HSL/Lab color-shift recoloring + TensorFlow.js OR ONNX Runtime Web for in-browser inference. On-device, no API calls. Type-4 fidelity is a demo-time spike risk; fallback is a curated demo photo set the model handles well.'
  demoData: 'Real brand names (Wella, Schwarzkopf, Pravana, Redken — BSG-distributed). Mock review data attributed to fictional users. NO watermark in UI — demo framing established via verbal disclosure at start of each session + one-pager handed to executives at session start. Product surface looks indistinguishable from Production V1.'
  demoFlow: 'All 5 journeys live (Maya, Janelle, Aliyah, Marcus, Elena) — ~2hr meeting block including discussion. Persona breadth is critical for exec excitement about thought process.'
  demoRuntime: 'Local on laptop browser + mobile browser (responsive). Not deployed; not internet-accessible. Network not required for AR rendering, browse, fade simulator, lighting toggle, mock reviews, mock booking handoff, partner dashboard, editorial admin.'
  demoSuccessMetric: 'Sally Beauty exec buy-in to fund operational deployment (cloud infra + signed vendor partnerships + BD-LOI execution). Binary outcome.'
  pathToProduction: '6 sequenced operational steps: (1) cloud infra choice + provisioning, (2) signed vendor contracts (AR SDK with DPA, paid SMS/email, paid Google Places), (3) Sally Rewards SSO + BSG product-pull join wired to real endpoints (provider swap), (4) BD-LOI execution (5 brands + 10 salons in 2-3 DFW sub-zones, webhook qualifiers enforced), (5) BIPA/CUBI/GDPR compliance gate executed (legal sign-off + DPA + consent flow + 30-day deletion automation + geographic gating), (6) Public launch in DFW.'
---

# Product Requirements Document - SB_Project (Sally Beauty Hair Color Try-On)

**Author:** Yashdixit
**Date:** 2026-05-02

## About This Document

This PRD covers two phases of one product, sharing one codebase. **Demo V1 (now, 8 weeks)** is a production-quality build that runs locally on a laptop and mobile device for a meeting-room walkthrough with Sally Beauty executives; the funding ask is binary. **Production V1 (post-funding, 16 weeks)** is the same codebase made operational — cloud-deployed, vendor contracts signed, Sally Rewards SSO and BSG product-pull join wired, BD-LOI execution complete, full BIPA / TX CUBI / GDPR compliance executed, public launch in DFW. The demo→production transition is environment configuration and procurement, not a rebuild.

Sections are phase-tagged where the bar differs. Where untagged, the content applies to both phases. The capability contract in *Functional Requirements* is binding for both phases; implementation differs at the provider boundary, not at the capability surface.

**Read order for time-constrained reviewers:** *Executive Summary* → *Phasing & Operational State* → *Success Criteria → Demo V1 Success* covers the strategic posture in under 10 minutes. *Functional Requirements* and *Non-Functional Requirements* are the binding contracts for downstream work.

## Executive Summary

> **She is about to do something she cannot undo for six months. We are the last honest mirror before she does.**

Hair color is a $2.1B US market — the highest-margin, highest-repeat service in the $69B salon industry — and the single most-regretted irreversible purchase a Sally Beauty customer makes. The digital tools she uses to plan that purchase are uniformly bad: TikTok filters that frame the decision as toy, single-brand AR try-ons engineered as ads ("of course Garnier says Garnier looks good on me"), salon-platform reviews that rate the front desk and the espresso but never the color result. Type 3-4 hair customers — disproportionately Sally's customer base — fail consistently across all of them. The result is a $1.6B at-home box-dye category losing share, a category-wide pre-decision drop-off, and a trust gap nobody has filled.

Sally Beauty is the only company structurally positioned to fill it. $3.7B FY2024 revenue across Sally Beauty Supply (consumer) and Beauty Systems Group / BSG (pro/salon), ~17M Sally Rewards members, 5,000 retail stores, and BSG sales reps inside thousands of salons every week with order pads. Where competitors have to *build* either a brand or a salon network, we already have both.

**The product ships in two phases.** **Demo V1 (now)** is a production-quality build of the full feature set — color-first browse, on-device AR rendering, 90-day fade simulator, multi-lighting toggle, salon discovery, outcome-anchored reviews, partner dashboard, editorial admin — running locally on a laptop browser and mobile browser with mocked vendor outputs and realistic-but-uncontracted brand data. The team is funded (1 PM + 6 eng + 1 designer + 1 BD + 1 editorial); vendor contracts and cloud infrastructure payments are not. The audience is Sally Beauty executives in a meeting room, walked through all five user journeys live in a ~2-hour session. The demo success bar is binary: do they fund the operational deployment? **Production V1 (post-funding)** is the same codebase made operational — cloud infrastructure provisioned, AR SDK contract signed with DPA, Sally Rewards SSO wired, BSG product-pull join live, signed BD partnerships (5 brands + 10 salons in DFW), full BIPA / TX CUBI / GDPR compliance executed, public launch in 1 geography. The demo→production transition is environment configuration and procurement — not a rebuild.

**The strategic claim that anchors both phases:** brand-neutral, outcome-tracked, salon-routed. Browse by color (not brand) — same color name renders the same across brands. Tap a color, see yourself, see every brand that offers it ranked by structured outcome reviews (fade weeks, accuracy, damage, would-recommend %), then deep-link into a partner salon's booking system. Photo upload only (no live camera in V1, deliberately — keeps the user in considered-decision mode, not TikTok-filter mode). Two custom render features sit on top of an open-source AR stack in the demo (MediaPipe Hair Segmentation + HSL/Lab color shift, in-browser via TensorFlow.js / ONNX Runtime Web) and on top of a licensed AR SDK in production: a 90-day fade simulator (parameterized by washes-per-week) and a 3-preset multi-lighting toggle (salon / daylight / warm interior).

**The 5-year endgame is the data layer for hair color outcomes industry-wide** — *Yelp-for-color-outcomes* in consumer framing, *Carfax-for-color* in trust-infrastructure framing. Demo V1 demonstrates the value prop and proves the architecture that supports that endgame; the data flywheel itself does not start compounding until Production V1 is in market generating real reviews. This Executive Summary names that honestly so executives are funding the right thing: a production-grade build with a clear operational path to the data-layer claim, not a hopeful prototype.

### What Makes This Special

The job hired is not "show me a color" — render-as-entertainment is the red ocean ModiFace and Snap dominate. The job hired is *the pre-commitment decision under uncertainty about a 12-week outcome on my hair texture, at my porosity, fading in my bathroom lighting, applied by a stylist I haven't met yet.* Nobody serves it today, not because it's hard to render but because nobody owns both the try-on surface and the post-application truth. We do.

**Four load-bearing differentiators, in order of durability:**

1. **Sally's structural cross-side ownership.** BSG distributes pro brands to thousands of salons. Sally Beauty Supply serves the consumer. Sally Rewards is ~17M beauty-engaged consumers (PM + BD to confirm DFW addressable subset). 5,000 retail stores are physical distribution we can't lose. Replicating this from zero costs a startup two years and tens of millions in CAC. Structural neutrality flows from this asset position — L'Oréal-owned ModiFace can't go neutral without cannibalizing Garnier/Redken margin; Madison Reed and eSalon can't go multi-brand without invalidating their DTC thesis. The neutrality story is a *consequence* of the position, not an independent moat. **Pre-condition: a named Sally-side activation SLA — owner for BSG-routes-stylist-demand, Sally Rewards mailing commitment, DFW-10-salons staff training. Without it, this layer is a balance-sheet asset, not a product advantage.**

2. **Outcome-data flywheel — present-tense thin, future-tense decisive.** A queryable dataset of structured outcomes (fade weeks, accuracy, damage, recommend %, after-photos) that compounds with volume. At launch we generate ~100 reviewed outcomes/month against a 150-cell brand-color matrix; statistical power per cell arrives at the 12-18 month mark. Until then we are seeding the dataset (Google Places color-tagged subset + 5 brand feeds, segregated into a labeled "brand-published" tab and never blended into headline rankings), not querying it. The PRD ships engineering against the future-volume schema, not a present-volume illusion.

3. **Texture-first build.** Type 3-4 hair render fidelity is a hard SDK selection criterion, not a "V2 inclusivity story." Sally's customer base skews more textured than the mainstream beauty AR market; a renderer that fails on Type 4 tanks trust on day one. This is the price of admission to our actual customer base, and it is a moat by inversion: competitors with L'Oréal contracts cannot rebuild on a Type-4-first SDK without breaking those contracts.

4. **Public Review Integrity Policy — narrowed to native reviews.** No takedowns except for ToS violations, no ranking adjustments by brand request, brands can reply but not delete, native reviews persist post-contract-termination. Ingested third-party reviews (Google Places, brand feeds) are displayed as-attributed and immutable by us — we are honest about what we control. This is the reason our outcome dataset has resale value rather than being first-party marketing telemetry.

The pitch line: **"The only color try-on app that's brand-neutral, outcome-tracked, and salon-routed."**

**The closed-loop attribution chain is real but eventually-consistent, not real-time.** Deep-link + webhook = best-effort booking attribution (~70% honest coverage given UTM-stripping by salon booking widgets across Booksy / Vagaro / Square Appointments). BSG-side product-pull join = T+7 high-fidelity purchase attribution (this is the Layer-1 unlock — only Sally can do it). The PRD does not promise real-time closed-loop and does not promise per-salon POS integration in V1.

**Same-color-same-render is a V1 architectural property enabled by 5×30 catalog scope, not a durable moat.** A normalization table (brand SKU → canonical color vector → SDK render parameters) hand-tuned by an editorial human in week 4. It is a design tenet, not a differentiator; the moment we scale to 50 brands × 200 colors it becomes a perceptual-color ML problem that needs a hire we don't have. Treated accordingly.

**Most-feared competitive move:** a no-Sally-assets competitor signs Aveda / Paul Mitchell / Empire beauty-school exclusives before we finish DFW — neutralizing the cross-side ownership moat (cold-start solved without 5,000 stores), accelerating the data flywheel (students do ~10× home-user volume with better instrumentation), and hardening texture-first (schools are texture-diverse by mandate). Pre-empted with a Week-0 BD motion: 1 LOI with 1 beauty school before launch. Zero engineering capacity cost, closes the front-running window. Beauty-school build remains V1.5 scope.

## Project Classification

**Project type:** web app — web + responsive mobile, single codebase, V1. Native iOS/Android explicitly deferred to V2+.

**Domain:** consumer marketplace with biometric-privacy regime overlay. No standard vertical bucket fits: this is consumer commerce + two-sided marketplace mechanics (salons + brands paid; consumer free, ever) + selfie-based biometric data exposure under BIPA / TX CUBI / GDPR with $30M+ class-action precedent (Estée Lauder, Louis Vuitton, 2023-24).

**Complexity:** high. Drivers: (1) BIPA / CUBI / GDPR exposure on selfie data, signed DPA from SDK vendor required before any user photo touches production; (2) two-sided cold-start (5 brand LOIs + 10 salon LOIs + 5K WAU concurrent, all in the same 16-week window); (3) verified attribution chain across deep-link → webhook → BSG-side product-pull join — three trust boundaries, none we own end-to-end; (4) two custom render features on top of licensed SDK, both novel and both contingent on a wks-0-2 feasibility spike; (5) cross-side incentive risks — paid placement neutrality, brand suppression pressure on negative reviews, Sally private-label brand handling under identical ranking rules.

**Project context:** greenfield. No existing codebase, no prior product documentation. Brief is the canonical source.

**Phase note (binding for the rest of this PRD):** Demo V1 — the near-term primary build — and Production V1 — the post-funding operational deployment — share one codebase. Differences are operational, not architectural. See *Phasing & Operational State* immediately below.

## Phasing & Operational State

The product is built in two phases. Demo V1 is what executives see in a meeting room; Production V1 is what gets shipped to real customers in DFW after funding is secured. Both phases run on the same codebase. The transition is operational, not architectural — the team does not fork.

### Demo V1 vs. Production V1 — what changes, what stays

| Dimension | Demo V1 (now) | Production V1 (post-funding) |
|---|---|---|
| Team | 1 PM + 6 eng + 1 designer + 1 BD + 1 editorial — funded | Same team |
| Features | Full MVP feature set built | Same |
| UX / polish bar | Production-quality (this is an exec demo) | Same |
| Codebase | Single codebase with provider-pattern abstractions | Same — mock providers swap to real providers via DI |
| Runtime | Local on laptop browser + mobile browser | Cloud-deployed web app |
| AR / hair segmentation | MediaPipe Hair Segmentation (Google, MIT) + HSL/Lab color-shift, in-browser via TensorFlow.js or ONNX Runtime Web | Licensed AR SDK (Perfect Corp / ModiFace / Banuba) with signed DPA + Type-4 fidelity acceptance |
| Brand catalog | Real brand names (Wella, Schwarzkopf, Pravana, Redken — BSG-distributed) curated by Elena. No UI watermark; demo framing established via verbal disclosure + executive one-pager at session start. | Signed brand-partner contracts (5 brands V1, expandable) with feed integrations |
| Salon list | Mocked DFW salons with realistic profiles, color certifications, stylist scorecards | Signed salon LOIs (10 in DFW V1, concentrated in 2-3 sub-zones) with operational webhook integration |
| Reviews | Hardcoded mock reviews (color-tagged, source-attributed labels intact, fictional reviewer names) | Google Places ingestion + brand feeds + native reviews + LLM color-classification with editorial audit |
| Auth | Local mock user state (no SSO) | Sally Rewards SSO integration |
| Booking handoff | Mock deep-link → placeholder confirmation screen | Real Booksy / Vagaro / Square Appointments / GlossGenius webhooks with attribution token |
| Attribution | Demonstrated narratively + sample data on partner dashboard; not wired | Deep-link + webhook (best-effort booking) + BSG product-pull join (T+7 purchase) |
| SMS / email triggers | Shown as in-flow toast / screen mockups in the demo flow | Twilio (SMS) + SendGrid (email) operational |
| Privacy / compliance | Zero exposure — demo runs on team's own data, no real users; on-device processing default | Full BIPA / TX CUBI / GDPR compliance + signed DPA + 30-day deletion + geographic gating |
| BD partnerships signed | None signed; BD team works pre-LOI motion in parallel during demo phase | 5 brand LOIs + 10 salon LOIs in 2-3 DFW sub-zones |
| Success metric | Sally Beauty exec buy-in to fund operational deployment (binary) | 5K WAU @ Wk 4, ≥10 attributed bookings/partner/month, 25% native review submission, 30% non-Type-1/2 textures, 5/5 brand retention |

### Architectural principle (binding for the team)

Demo and production share one codebase. Mock providers and real providers implement the same interfaces. Each external dependency is wrapped in a provider abstraction (`ARProvider`, `ReviewProvider`, `AuthProvider`, `AttributionProvider`, `NotificationProvider`, `BookingHandoffProvider`, etc.); the demo wires up mock implementations, production wires up real ones. Engineering does not fork the codebase for production. Adding a new mock vendor for the demo and replacing it with a real vendor for production are the same architectural change at different points in time.

### Demo runtime constraints

- **Hardware:** modern laptop (Mac or Windows) running a current Chrome / Edge / Safari browser; modern mobile device (iOS Safari 16.4+ or Chrome Android) running mobile browser. No native app install.
- **Network:** the demo does not require internet for AR rendering, color browse, fade simulator, multi-lighting toggle, mock review surfaces, mock booking handoff, partner dashboard, or editorial admin. Network is required only for the initial app load if hosted; running fully offline from a local server is supported.
- **Data:** all data is loaded from local fixtures (JSON / static files). No external API calls during demo. No telemetry sent.

### Path to production — six sequenced operational steps

1. **Cloud infrastructure choice and provisioning.** Vendor selection (AWS / GCP / Azure), region selection (TX-resident for CUBI compliance), CI/CD pipeline, monitoring, logging. Engineering does not change application code; the deployment configuration changes.
2. **Signed vendor contracts.** AR SDK with DPA (Perfect Corp likely starting point), paid SMS provider (Twilio), paid email provider (SendGrid), paid Google Places API at production volume with cost cap. Each contract unlocks the corresponding provider swap.
3. **Sally Rewards SSO + BSG product-pull join wired to real endpoints.** Provider swap from mock to real for `AuthProvider` and `AttributionProvider` (purchase side). Integration testing in staging.
4. **BD-LOI execution.** 5 brand LOIs + 10 salon LOIs in 2-3 DFW sub-zones. Webhook capability enforced as a V1-partner qualifier (no webhook = no V1). Partner onboarding playbook executed.
5. **BIPA / TX CUBI / GDPR compliance gate executed.** Legal sign-off on consent flow language, signed DPA with SDK vendor, 30-day photo deletion automation in production, geographic gating live (TX V1; IL requires BIPA-uplift before any IL user uploads), right-to-delete surface live in account settings.
6. **Public launch in DFW.** Marketing + Sally Rewards email/SMS in DFW + in-store retail signage + QR codes on color aisles + BSG salon-partner promotion. 50-user closed beta first, then public.

These six steps are sequential or parallelizable depending on vendor lead times; the brief's 16-week production timeline allocates them across weeks 1-16 post-funding. None of them require code changes the engineering team hasn't already made for the demo.

## Success Criteria

This product has two distinct success bars. Demo success unlocks production. Production success unlocks the data-layer endgame. The team must not confuse them.

### Demo V1 Success — Primary Bar (Now)

The demo succeeds if Sally Beauty executives fund the operational deployment after seeing the walkthrough. Concretely:

| Demo success metric | Target | Measurement |
|---|---|---|
| **Exec funding decision** | Yes — funded for operational deployment within 4 weeks of demo | Binary outcome from exec session |
| **All 5 journeys demonstrated live without failure** | 100% of journey steps that are claimed as live actually work in the meeting room (Maya, Janelle, Aliyah, Marcus, Elena) | Pre-meeting dry runs + meeting-room rehearsal on the actual demo hardware |
| **Type-4 hair fidelity demonstrable on Janelle's flow** | MediaPipe Hair Segmentation handles a curated Type 4 demo photo without obvious failure (no smoothing, no missed coils, color landing on visible texture) | Demo-time visual check; if MediaPipe fails on Type 4 generally, fall back to a curated photo set the model is known to handle |
| **Differentiator demonstrability** | Each of the 4 load-bearing differentiators (Sally cross-side ownership, outcome-data flywheel, texture-first, Public Review Integrity Policy) has at least one concrete demo moment an exec can point at | Story-board walkthrough of all 5 journeys against the 4-layer stack |
| **Same-codebase claim defensible** | Engineering can show, on demand, the provider interfaces where mocks swap to real vendors (`ARProvider`, `ReviewProvider`, `AuthProvider`, `AttributionProvider`, `NotificationProvider`, `BookingHandoffProvider`) | Code-walkthrough segment of demo, optional but available on exec request |
| **Pre-LOI motion progress visible** | BD shows execs a list of brands and salons engaged-but-not-signed with realistic timelines for LOI execution post-funding | BD pre-meeting prep; execs see this is real, not aspirational |
| **Path-to-production credibility** | Engineering shows the 6 sequenced operational steps (above in Phasing section) and which ones are blocked on funding vs. ready-to-go | Slide / one-pager handed out at end of demo |

**Demo failure modes (and what they mean):**

- *Execs fund the demo but not the operational deployment* → demo overdelivered on polish, underdelivered on operational economics / path-to-deployment story; tighten the operational pitch.
- *Execs reject because of texture-fidelity concerns* → MediaPipe limitation on Type 4 hair was visible; production AR SDK selection becomes the front-loaded post-funding decision (NOT a kill criterion for the demo, but a documented constraint).
- *Execs ask for "another demo with more brands / more salons / more colors"* → scope was right, breadth wasn't enough; expand mock catalog, re-demo. Cheap.
- *Execs reject because of brand-neutrality / paid-placement concerns* → Public Review Integrity Policy story didn't land; sharpen the pitch on Marcus's negative-review journey segment.
- *Execs greenlight conditionally on a specific scope cut* → expected; Demo V1 was deliberately broad to enable the conversation. Refine post-demo.

The demo is not graded on adoption metrics, conversion rates, or any of the production targets below. Confusing the two is the most common way to mis-build the demo.

### Post-Funding Production V1 Targets

The metrics below apply once operational deployment goes live in DFW. They are what the funding buys; they are not what the demo is graded on. They are preserved here in full because Engineering, BD, Editorial, and Legal all need to build Demo V1 against the future-state schemas these targets imply.

#### User Success (Production)

The protagonist's "aha" is a single-session experience: she uploads, browses by color (not brand), sees herself in any of ~30 shades, watches the color fade across 90 days under three lighting presets, reads outcome reviews from people with her hair texture, and books a salon — all without ever feeling sold to. Specific user-success markers:

- **"Matched what I saw" congruence:** post-booking sentiment ≥70% positive on the prompt *"the color in the salon matched what I saw in the app"* — the inverse of the #1 trust complaint across YouCam / ModiFace / Style My Hair.
- **Texture parity:** Type 3-4 users report render fidelity within 1.0 NPS points of Type 1-2 users by month 3. This is the binary trust check; failure here invalidates the differentiator.
- **Pre-decision confidence lift:** ≥60% of try-on users report (qualitative survey) that the app *"gave me confidence I didn't have before"* about an irreversible decision.
- **Stylist secondary user adoption:** in-chair app usage by stylists at ≥30% of partner-salon color appointments by month 3 (measured via stylist-initiated session marker, not self-report).

#### Business Success (Production)

| Metric | Target | Notes |
|---|---|---|
| **#1 — Salon-attributed bookings per partner per month** | ≥10 | Verified via eventually-consistent attribution (deep-link + webhook = best-effort booking, ~70% honest coverage; BSG-side product-pull join = T+7 high-fidelity purchase). Not self-report. |
| Weekly active users in launch geography | 5,000 by week 4 post-launch | Sized against Sally Rewards DFW addressable list (PM + BD owe number Week 2). Reset to ~10K if W-of-Oz triggers conversion-target reset. |
| Try-on → salon booking conversion | ≥8% aspirational | Sourced from generic AR-lift (Perfect Corp / Shopify, single-brand checkouts), not deep-link funnel. W-of-Oz validation Wks 12-14 with 50-100 Sally Rewards beta users. **Reset bar to 4-5% if W-of-Oz comes in there**, which implies ~10K WAU target. |
| Native review submission rate (post-booking) | ≥25% | SMS at +24h + email at +7d + in-app banner cadence. Sally Rewards points for verified post-booking reviews with photos. |
| Hair texture diversity in user base | ≥30% non-Type 1/2 | Detection method TBD, privacy-aware. |
| Brand partner retention into V2 | 5/5 | Pair with brand spend retention to detect gaming. |
| **Beauty school defensive LOI** | 1 signed before launch | Week-0 BD motion. Closes the front-running competitive window (no-Sally-assets competitor signing Aveda / Paul Mitchell / Empire exclusively). Build remains V1.5 scope. |
| **Sally-side activation SLA** | Executed by Week 4 | Named owners + signed commitments for: BSG-routes-stylist-demand into app, Sally Rewards DFW mailing motion, DFW-10-salons staff training to ask "did you try it in the app?". Without this, Layer 1 is a balance-sheet asset, not a product advantage; #1 metric collapses with it. |

The single most important number remains #1 — *salon-attributed bookings per partner per month*. Everything else is leading indicator.

#### Technical Success (Production)

Pre-conditions (Week-0 to Week-2 gates of the post-funding 16-week timeline — operational deployment does not advance past Week 2 without these):

- **BIPA / TX CUBI / GDPR stance signed (Week 2):** on-device OR server-side processing with explicit consent + 30-day deletion. Signed DPA with SDK vendor *before any user photo touches production*. $30M+ class-action precedent (Estée Lauder, Louis Vuitton 2023-24) — concrete, not theoretical.
- **SDK selection (Week 2):** Perfect Corp likely starting point given existing Sally integrations. Formal eval against ModiFace and Banuba on Type-4 hair across 30-color matrix under 3 lighting presets. Fade-simulator + multi-lighting feasibility spike completed. **If spike yellow-lights, ship fade-only and defer multi-lighting to V1.1 — called out in the open, not in a risks appendix.**
- **Color taxonomy curator named (Week 0 hire / Week 4 deliverable):** intersection-of-coverage rule ≥3 brands per color so the "compare brands" promise is never silently broken. 30 V1 colors locked Week 6. Specialty tier visibly labeled "1 brand only — unique look" for niche shades that fail the rule.
- **Pre-launch supply (Week 6):** 5 brand LOIs + 10 salon LOIs concentrated in 2-3 DFW sub-zones (Plano/Frisco + Dallas-core + Fort Worth-core), not scattered. BSG sales reps run point on salon outreach.
- **Public Review Integrity Policy published (Week 8):** 1-page, externally published. No takedowns except ToS. No ranking adjustments by brand request. Brands can reply but not delete. Native reviews persist post-contract-termination. **Narrowed to native reviews only**; ingested third-party reviews displayed as-attributed and immutable by us.
- **Sally-owned brand neutrality documented (Week 4):** Sally private-label / BSG-exclusive brands held to identical ranking rules; codified in brand-partner contract before any contract is signed.

Build-phase technical targets:

- **Same-color-same-render normalization table:** brand SKU → canonical color vector (L\*a\*b\* or similar) → SDK render parameters. 5×30 = 150 entries hand-tuned by editorial Week 4. Architectural property of V1 catalog scope; not a moat.
- **Eventually-consistent attribution chain:** deep-link + webhook live by Week 10 (best-effort booking attribution); BSG-side product-pull join live by Week 12 (T+7 high-fidelity purchase attribution). PRD does not promise real-time closed-loop or per-salon POS integration.
- **Cold-start review pipeline:** Google Places ingestion + LLM color-classification + brand feed segregation live by Week 8. Source-attribution labels on every review surface.
- **Post-booking trigger sequence:** SMS at +24h, email at +7d, in-app banner on next visit — operational by Week 10.
- **Web + responsive mobile single codebase** ships hardened by Week 14; closed beta with 50 users Week 15; public launch Week 16.

#### Measurable Outcomes — Kill Criteria (Production, decided in advance, applied clinically)

- **<6 salon LOIs by Week 6** → pause the build, regroup with BD.
- **SDK Type-4 eval fails** (no vendor clears bar) → re-scope; texture inclusivity non-negotiable.
- **<2,000 WAU by Week 4 post-launch** → retrench to Sally Rewards-funded acquisition tool only; revisit brand revenue at Month 6.
- **Per-partner booking variance kills bottom 4 salons** (sub-5/month at Week 6 post-launch) → routing-fairness intervention (round-robin within radius, capacity-weighted) or cut to fewer partners.
- **W-of-Oz conversion <2%** → product needs different shape; pause launch.
- **Sally-side activation SLA not signed by Week 4** → escalate to leadership; if not resolved by Week 6, treat as a #6-salon-LOI-equivalent kill condition.

## Product Scope

### Demo V1 — Build Scope (Now)

The full MVP feature set is built in Demo V1. The differences from the post-funding production deployment are operational (provider implementations, deployment runtime, partnerships), not feature-set. Each row below shows the demo-time implementation choice and the production-time delta.

| Capability | Demo V1 implementation | Production V1 swap |
|---|---|---|
| Photo upload flow | Browser file-picker + drag-drop; on-device only; no upload to any server | Same UX; on-device default with consent + 30-day server deletion as fallback path |
| Color-first browse (~30 curated colors, ≥3-brand intersection rule, specialty tier) | Static JSON catalog curated by Elena; intersection rule enforced in catalog data | Editorial admin surface backed by database; same data shape |
| AR render — hair segmentation + recoloring | **MediaPipe Hair Segmentation** (Google, MIT, free) + HSL/Lab color shift on segmented region; in-browser inference via TensorFlow.js or ONNX Runtime Web | Licensed AR SDK (Perfect Corp / ModiFace / Banuba) selected against Type-4 fidelity benchmark; same `ARProvider` interface |
| Per-color brand list with outcome ratings | Hardcoded mock reviews with realistic distributions (some colors well-rated, some not, some Type-4 specific); reviewer names fictional; no UI watermark — demo framing established outside the product (verbal disclosure + executive one-pager) | Real reviews via `ReviewProvider` swap (Google Places ingestion + brand feeds + native reviews) with editorial audit |
| 90-day fade simulator (washes-per-week parameterized) | Pure math: linear/exponential blend between week-0 color vector and a "faded" target vector by texture, parameterized by washes-per-week. No SDK dependency. | Same logic; runs on top of licensed SDK render output instead of MediaPipe output |
| Multi-lighting toggle (3 calibrated presets: salon / daylight / warm interior) | Post-processing on segmented + recolored output: color-temperature shift, white-balance offset, gamma curve per preset | Same logic; production SDK may expose richer lighting parameters; presets recalibrated against SDK output |
| Salon discovery + profile (color certifications, stylist scorecards, partner profile) | Mocked DFW salons (10 fictional but realistic — names, addresses, stylists, certifications, scorecards). Map view via free OpenStreetMap (Leaflet) + free tile provider; no Google Maps API. | Real signed salons via `SalonProvider` swap; map can swap to Google Maps if licensed |
| Deep-link booking handoff | Mock handoff to a placeholder page within the demo app showing booking confirmation with attribution token visible (transparent for the exec walkthrough) | Real Booksy / Vagaro / Square / GlossGenius webhooks via `BookingHandoffProvider` swap |
| Eventually-consistent attribution | Sample data on Marcus's partner dashboard demonstrating the chain narratively; not wired | Deep-link + webhook (best-effort booking) + BSG product-pull join (T+7 purchase) via `AttributionProvider` swap |
| Share-this-look button | Generates a shareable image (canvas-rendered) with a mock salon-routing link; can be saved locally | Same UX; link routes to real attributed handoff |
| Reviews — Google Places + brand feeds + native reviews | Hardcoded mock data with full source-attribution labels intact (Google / brand / SB user / stylist-assisted) so the labeling UX is fully demonstrable | `ReviewProvider` swap to real ingestion pipelines |
| Post-booking trigger sequence (SMS +24h, email +7d, in-app banner) | Shown as in-flow toast / screen mockups during the demo walkthrough; not actually fired | Twilio (SMS) + SendGrid (email) operational via `NotificationProvider` swap |
| Source-attribution labels on every review surface | Live in the demo (because labels are UI-driven, not data-source-driven) | Same |
| Web + responsive mobile single codebase | Same codebase, runs in laptop browser + mobile browser | Same codebase, deployed to cloud |
| Privacy compliance | Demo runs only on team's own data; no real users; on-device processing default; no real BIPA/CUBI/GDPR exposure | Full compliance gate executed (legal sign-off, signed DPA, 30-day deletion automation, geographic gating, right-to-delete surface) — see Pre-Production Compliance Gate in Domain Requirements section |
| Public Review Integrity Policy | Drafted document available as a clickable link/PDF in the demo's footer to demonstrate the moat narrative; not yet externally published | 1-page externally published Week 8 of post-funding timeline |
| Stylist saved-look access (calendar invite link) | Demonstrated via Aliyah's flow with a mock calendar invite + working web link to her saved-look view | Real calendar integration via `CalendarProvider`; same web link surface |
| Stylist-side in-chair review submission with consent capture | Live in the demo (UI-driven feature, no external dependency) | Same |
| Salon partner dashboard (web V1) | Live in the demo with mock data — Marcus's full flow including attributed bookings, per-stylist scorecards, BSG re-order surface, review-reply | Same surfaces, real data |
| BSG re-order surface | Mocked one-tap re-order with confirmation toast | Real BSG API integration via `BSGProvider` swap |
| Editorial admin surface (color taxonomy, intersection rule, specialty tier flagging, LLM classification audit, brand-reply moderation) | Live in the demo with mock data (Elena's flow); LLM audit queue uses pre-classified mock items, not live LLM | Same surfaces; real LLM (e.g., GPT-4-class) for classification, real ingested reviews |
| Sally Rewards points integration | Mock state — UI shows "+50 Sally Rewards points awarded" toast on review submission | `AuthProvider` + Sally Rewards points API swap |
| Texture-diversity metric instrumentation | Privacy-aware metadata captured in mock telemetry surface | Same instrumentation, real telemetry |
| 30-day photo deletion default | Demo doesn't store photos at all (on-device only, discarded on session end) | Real automation: server-side deletion job, audit log, user-visible setting |

**Out of Demo V1 (deferred to V1.5+ regardless of phase):** live camera mode · pre-event try-on (calendar) · bestie social vote · in-app booking · geofence triggers / Salon Waiting-Room Mode · seasonal palette reader · root-growth / regrowth preview · brand-site review scraping (legal gray; rejected) · stylist seed reviews (cold-start enhancement) · brand-side attribution analytics dashboards · in-store kiosks · native iOS/Android apps.

**Cross-reference:** the operational steps that flip Demo V1 to Production V1 are listed in *Phasing & Operational State → Path to Production*. The compliance gate that must be cleared before any real user touches the production deployment is in *Domain Requirements → Pre-Production Compliance Gate*.

The cut is aggressive on purpose. Bias-to-ship.

### Growth Features (V1.5 — Post-MVP)

- **Color correction wedge.** Triage panic-bookers ("I tried box-dye and it went green") to certified corrective colorists. Highest-stakes, highest-margin salon service. Competitors literally cannot serve at Sally's scale.
- **Men's color + gray-blending.** 5-8 men's shades + gray-blend % slider. Fastest-growing sub-segment, near-zero AR competition. Doubles addressable users with marginal scope cost.
- **BNPL at booking handoff** (Affirm / Afterpay / Klarna). Color services $150-400 = BNPL conversion sweet spot. Lifts the #1 metric without consumer-side cost.
- **Beauty school partnerships** (Aveda Institute / Paul Mitchell / Empire / Tricoci). Solves salon-side cold-start, fills texture-diversity metric, builds 5-10 year BSG B2B pipeline. *Build deferred to V1.5; defensive LOI is a Week-0 V1 motion.*
- **Brand-side attribution analytics dashboards.** Brand-facing visibility into try-on → in-chair purchase chain. V2 in original brief; promote to V1.5 if brand-retention pressure demands it.
- **Stylist seed reviews.** Cold-start enhancement. V2 in original brief; V1.5 if native review depth at Month 6 is below target.

### Vision (V2+)

- **Stylist-side product** — portfolio mode, in-chair consultation tool, dedicated stylist app. Flips cold-start: stylists become demand-acquisition channel; in-chair review submission can hit ~80% vs ~25% home-based.
- **Live camera mode** — only after the considered-decision mental model is established and AR fidelity matches the upload-photo experience.
- **Pre-event try-on (calendar integration)** — anchors color decision to deadline + outfit.
- **Geofence triggers / Salon Waiting-Room Mode** — needs native app.
- **Native iOS/Android apps** — web-first is deliberate; native unlocks features web cannot reach (camera quality, push, geofence).
- **Bestie social vote** — V3; full social mechanic.
- **In-store kiosks** — retail expansion.
- **The data layer for hair color outcomes industry-wide** — queryable outcome dataset, brand benchmarking surfaces, salon scorecards, manufacturer batch-level fade-testing data via brand contract. *This is the platform endgame; V1 instrumentation is built for it.*

## User Journeys

### 1. Maya — The Considered Color-Changer (Primary, Happy Path)

**Persona snapshot.** Maya is 34. Marketing director at a mid-size SaaS company in Plano. Two years post-divorce, six months post-promotion, three weeks past a Sunday morning when she looked in the mirror over coffee and didn't recognize herself. Hair color: ash brown grown out from a balayage that her last salon "modernized" into something she hated for nine months. Texture: Type 2B — wavy, not curly, but enough that "lifts to red and falls flat into orange" is a specific fear she has read about on Reddit. She has $300 set aside. She is not impulsive.

**Opening scene: 9:47 PM Tuesday.** Phone propped against the toothbrush cup. Sixth Reddit tab open: r/HairDye, "anyone gone from ash brown to copper without bleach?" Beneath it, three YouTube videos paused at "12 weeks later." She has tried two AR filters in the last hour — Garnier's says she'd look great in their copper; the L'Oréal one says the same about a different copper. She trusts neither. She finds the Sally app via a Sally Rewards email that day with the subject line *"Try a color before your next salon visit. Free. No catch."*

**Rising action.** She opens the app on her iPhone. Permission prompt: *"Upload a photo to see colors on your hair. Photos are processed on your device and never leave your phone unless you book."* She uploads a selfie taken three minutes ago in her bathroom. The browse screen shows colors, not brands — she taps "Copper." Sees herself. Toggles lighting: salon (warm, flattering — *of course*), daylight (orange, exactly what she feared), warm interior (in between). She frowns. She slides the fade simulator: week 0 (vibrant), week 4 (rust), week 8 (the muddy brown she dreads), week 12 (worse). She backs up.

She tries "Bronde" — same flow, more forgiving fade curve. She likes it. The brands offering Bronde appear ranked not by name but by *outcome reviews from people with her hair texture*: "Wella Bronde — 4.3/5 accuracy on Type 2 hair, 8-week average fade, 12% report damage. 340 native reviews + 1,200 Google reviews (color-tagged), source-attributed." She taps a review: *"I have 2B wavy hair, this held color for 9 weeks before I needed a gloss."* Photo attached. Bronde wins.

**Climax.** She scrolls to "Salons in DFW that do this color." Three results within 5 miles of Plano. Top: Studio Lumière, 4.8/5 color-specific accuracy across 47 Bronde appointments routed through this app, 11 native Bronde reviews, certified for Wella. She taps Book. A deep-link opens Studio Lumière's booking page in her browser with the color preference *and* the daylight lighting toggle pre-loaded into the appointment notes. She picks a Saturday slot. Confirmation: *"We'll send you a review request 24 hours after your appointment. Your photo will be deleted from our servers in 30 days unless you save it to your account."*

**Resolution.** Saturday: she walks into Studio Lumière. The stylist pulls up her saved look on a tablet. Three hours later, Maya sees herself in the salon mirror and matches what she saw. She walks out, takes a sunlight photo in the parking lot, compares it to the daylight preview. They match. T+24h SMS: *"How does the color look in real life?"* She submits a 5/5 native review with photos. T+7 days email: *"How's it holding up after a week of washing?"* T+30 days: she logs back in for a fade-progression update; she sees the BSG-side product-pull join already credited her booking and Studio Lumière's "Bronde accuracy" rating ticked from 4.8 to 4.81.

**Capabilities revealed:** photo upload + on-device processing · color-first browse with intersection-of-coverage rule · multi-lighting toggle · 90-day fade simulator · per-color brand list with outcome-anchored sort · texture-aware review filtering · source-attributed review surface · salon search with color-specific certifications · deep-link booking handoff with context preservation · post-booking review trigger sequence · BSG-side T+7 attribution join · Sally Rewards points for verified reviews with photos · 30-day photo deletion default.

**Demo realization (Maya).** Live in the demo: photo upload, MediaPipe segmentation + recoloring on the uploaded photo, color-first browse (Wella, Schwarzkopf, Pravana, Redken catalog), multi-lighting toggle, 90-day fade simulator, per-color brand list with hardcoded mock reviews, salon search with mocked DFW salons, share-this-look button. Narrated with screen mockups: deep-link to Studio Lumière's booking system (mock confirmation page in the demo app instead), T+24h SMS arrival, T+7 day email, T+30 day fade-progression update, BSG-side T+7 attribution join (shown later on Marcus's dashboard with sample data). Maya is the first journey demoed; sets the spine.

### 2. Janelle — The Type 4 User (Primary, Texture Edge Case)

**Persona snapshot.** Janelle is 29. Communications lead at a Dallas non-profit. Type 4A coily hair, currently natural with a 6-month-old protective style coming out next weekend. She has sat through three AR try-ons in the last year that "render" her hair as a smooth Eurocentric helmet with a brown filter slapped on top. She has stopped trying. A friend texted her the Sally app this morning with *"this one actually sees us."*

**Opening scene.** She opens the app expecting disappointment. Uploads a photo. The first thing she notices: the renderer didn't smooth her texture. Her coils are still her coils. She zooms in. The hair recognition map traced her individual curl clumps, not a hair-shaped silhouette. She is, for the first time in a try-on app, seeing herself.

**Rising action.** She browses to "Auburn." The render shows the color landing on her actual texture — different highlights, different depth on natural light vs. salon light, the porosity of Type 4 hair acknowledged in how the color sits. The fade simulator shows her something the previous apps never did: how Auburn fades on coily hair specifically (slightly faster at the ends due to porosity, faster on natural hair than relaxed). She filters reviews to "Type 4 hair." The list isn't empty — 23 native reviews, 89 source-attributed Google reviews. She reads three. They're written by people with her hair.

**Climax.** She scrolls to salons. Two of the 10 DFW partners have explicit "Type 4 color experience" certifications. One — Crown & Coil in Dallas-core — has 11 native Auburn reviews from Type 4 clients and a stylist named Aliyah whose color-specific accuracy on Type 4 is 4.9/5. Janelle taps Book. Saturday appointment with Aliyah.

**Resolution.** Saturday: Aliyah pulls up Janelle's saved look. They calibrate against the daylight preset from the app together at the chair. Three hours later Janelle sees herself in the mirror. Match. T+24h: she submits a native review tagged with her texture type. Texture-diversity metric ticks. The app's promise — *texture inclusivity is the price of admission, not a V2 feature* — is kept on day one for the user it matters most to.

**Capabilities revealed:** SDK Type-4 fidelity (vendor selection forcing function) · texture-aware render parameters (porosity, curl-clump recognition) · texture-filtered fade simulation · texture-filtered review surface · per-stylist color-specific accuracy ratings on texture · per-stylist texture certifications surfaced in salon profile · texture-tagged native review submission · texture-diversity metric instrumentation.

**Demo realization (Janelle).** This is the binary trust-check journey. Live in the demo: Janelle's photo upload (curated Type 4 demo photo selected for MediaPipe handling), segmentation + recoloring with visible texture preserved, fade simulator with texture-aware curve, lighting toggle, texture-filtered review surface (mock reviews from fictional Type 4 reviewers), salon search filtered to "Type 4 color experience" certifications, Crown & Coil profile with stylist-level scorecard. **Demo-time risk:** if MediaPipe fails on Type 4 hair generally, fall back to a small set of curated demo photos the model is known to handle. The **production AR SDK swap** (post-funding) is the durable answer; the demo's job is to make the value prop legible enough that execs fund the real SDK selection. Narrated: T+24h review submission, texture-diversity metric tick. Janelle is the second journey demoed; if Maya didn't sell the spine, Janelle seals the texture-first claim.

### 3. Aliyah — The Stylist (Secondary, In-Chair Amplifier)

**Persona snapshot.** Aliyah is 41. Master colorist at Crown & Coil, 16 years in the chair. She has been on Booksy and Vagaro for years; they bring her clients but tell her nothing about color expectations until the consultation. She estimates 30% of her color appointments end with a *"well, we can fix that next time"* — usually because the client showed her an Instagram photo with completely different lighting than her chair.

**Opening scene.** Janelle's appointment confirmation hits Aliyah's calendar with a link: *"Client tried Auburn in our app, landed on the daylight preset, here's the saved look."* Aliyah taps. She sees what Janelle saw: the color, the lighting, the fade projection, the brand Janelle was leaning toward (Wella). She has the consultation done before Janelle arrives.

**Rising action.** Janelle sits in the chair. Aliyah pulls up the saved look on her iPad. They calibrate together — Janelle confirms the daylight preset is the lighting she cares about most (Saturday brunch outdoor patios). Aliyah tweaks the formula based on Janelle's porosity, which the app couldn't fully capture. The conversation she has with Janelle is *not* "show me a picture" — it's *"let's match what you already saw."* Different conversation. Better outcome.

**Climax.** Three hours later, mid-styling, Aliyah opens the app on her iPad and shows Janelle the side-by-side: app preview vs. chair mirror. Match. Aliyah taps "in-chair review submission" on Janelle's behalf with Janelle's verbal consent — the app marks the review as *"stylist-assisted submission"* for source-attribution honesty. Submission rate from in-chair is ~80%. From home, ~25%. Aliyah knows this; she does the math on every appointment.

**Resolution.** End of week: Aliyah reviews her stylist scorecard inside Crown & Coil's partner dashboard. Her color-specific accuracy on Type 4 just ticked up to 4.92. She has been routed 14 attributed bookings this month (target: ≥10). She is now in the top quartile of Crown & Coil's stylists for app-driven appointments. Next week she'll start sending the app link to her existing clients herself.

**Capabilities revealed:** stylist-facing saved-look access (no separate stylist app in V1; web link in calendar invite) · stylist-side in-chair review submission with consent capture · stylist-level scorecard inside salon partner dashboard · per-stylist color-specific accuracy aggregation · attribution credit visible to stylist (drives behavioral loop) · "stylist-assisted submission" source attribution label.

**Demo realization (Aliyah).** Live in the demo: switch the demo device to a tablet/laptop view representing Aliyah at the chair. Show Janelle's saved-look opened from a mock calendar invite link. Show the side-by-side calibration view. Show the "in-chair review submission with consent capture" modal — Aliyah taps it on Janelle's behalf, the review is marked "stylist-assisted submission" with the source-attribution label visible. Show Aliyah's stylist scorecard inside Crown & Coil's partner dashboard ticking up. Narrated: weekly behavioral loop where stylists with high attributed-booking counts start sending the app link to existing clients. Aliyah's journey is the third demoed; this is where execs see the stylist amplification effect that turns them from "consumer app" thinkers into "two-sided marketplace" thinkers.

### 4. Marcus — The Salon Owner / Partner (Supply-Side User)

**Persona snapshot.** Marcus owns Crown & Coil. He signed an LOI with Sally's BD team in Week 4 of pre-launch because his BSG rep brought it up during a regular order visit. He has 8 stylists. He pays Booksy $300/month for booking and review aggregation that doesn't surface color-specific signal. Sally's offer: a free first 6 months, then performance-based pricing tied to attributed bookings.

**Opening scene.** Marcus logs into the partner dashboard from his laptop on a Tuesday morning. The dashboard surfaces: total attributed bookings this month (47, against the 10-per-month target), color-specific accuracy ratings per stylist, Crown & Coil's standing in DFW for each color category they're certified in, and brand pull-through (which colors his clients are choosing → which brands he should be reordering through BSG).

**Rising action.** He clicks into "Bronde." 18 of his 47 attributed bookings this month were Bronde — and his clients are 73% likely to ask for it again at re-up. He clicks into the BSG re-order surface: the dashboard pre-fills a Wella Bronde re-order based on his actual usage. One tap, ordered through his BSG account. **The cross-side ownership unlock made visible.**

**Climax.** A negative review comes in from a client who didn't get the result she wanted. Marcus reads it. The client tagged it Bronde + Type 3B. The stylist was new (3 months at Crown & Coil). Marcus has two options: pay-to-suppress (not offered — the Public Review Integrity Policy makes this structurally impossible) or *reply publicly with a path forward*. He replies offering complimentary correction with Aliyah, his master colorist. Ten days later the client posts an updated 5-star review with photos. Both reviews remain visible, source-attributed. Crown & Coil's color-specific accuracy doesn't take a permanent hit; it takes a temporary one and recovers visibly.

**Resolution.** End of Q1: Marcus re-signs into V2 (brand partner retention metric). His Booksy spend has not changed but Sally is now driving 60% of his color-specific client acquisition. He is willing to be a reference for the BD team's Atlanta expansion.

**Capabilities revealed:** salon partner dashboard (web-only V1) · attributed-booking surface per partner · per-stylist scorecard · color-specific certification management · BSG re-order surface with cross-platform integration · review-reply functionality (no review delete) · public review-thread integrity · brand pull-through analytics for re-order decisions · pricing transition surface (free → performance-based at month 6).

**Demo realization (Marcus).** Live in the demo: open Crown & Coil's partner dashboard on the laptop. Show the attributed-bookings surface (mock — 47 this month against the 10/month target). Show per-stylist scorecards (Aliyah at 4.92 on Type 4, the new stylist whose negative review is below). Show the BSG re-order one-tap surface pre-filled from mock pull-through data — *this is where the cross-side ownership unlock becomes legible to execs in 5 seconds*. Show the negative-review-reply flow live: read the bad review, demonstrate that the "delete" option does not exist (Public Review Integrity Policy made structural), reply with the offer for complimentary correction, show the updated 5-star follow-up review with both reviews still visible. Narrated: end-of-Q1 re-sign decision, brand-partner-retention metric. Marcus's journey is the fourth; this is where execs see the *moat* — Sally's structural advantages translated into a single screen no startup competitor could build.

### 5. Elena — The Editorial Curator (Admin / Operations)

**Persona snapshot.** Elena is 36. Hired in Week 0 of the V1 build. 12 years editorial experience at beauty publications (Allure, Refinery29). Her job: own the color taxonomy, enforce the intersection-of-coverage rule, and govern the LLM-classified Google Places review pipeline.

**Opening scene.** Week 4 deliverable: 30 V1 colors locked. Elena sits with a spreadsheet of every brand-color SKU across the 5 launch brands. She runs the intersection rule: a candidate color appears only if ≥3 of 5 brands offer it within tolerance. She finds 24 colors that pass cleanly. For the remaining 6 slots, she opens the "Specialty tier" — colors offered by only 1-2 brands, visibly labeled in the app as *"1 brand only — unique look"* so the comparison promise is never silently broken.

**Rising action.** Week 8: native reviews start trickling in. Google Places reviews are flowing through the LLM color-classification pipeline. The LLM tagged a review as "Bronde" — Elena reviews the audit queue and sees the review actually mentioned Bronde *only in passing* (*"my friend got Bronde, but I got Auburn"*). She rejects the classification. The training data ticker advances. The audit queue surfaces the next 40 ambiguous classifications. She works through them in 90 minutes.

**Climax.** Month 3: a brand partner emails Elena directly asking that a specific negative Google review of one of their colors be removed from the per-color surface. Elena forwards the request to leadership and to the public Review Integrity Policy URL. Reply: *"Per published policy, ingested third-party reviews are displayed as-attributed and immutable by us. We can mark the brand's official reply as their response."* The brand sends a reply. The reply appears beneath the review, source-attributed. The review remains.

**Resolution.** Month 6: Elena's color taxonomy has expanded to 38 colors as native review depth grows in 8 of the original 30 cells. She authors the V1.5 men's-color shade list (8 colors, gray-blend % slider) for the design team. She begins quarterly editorial reviews of brand-feed segregation accuracy.

**Capabilities revealed:** editorial color taxonomy admin surface · intersection-of-coverage rule enforcement tooling · specialty tier flagging · LLM-classified review audit queue · classification training-data feedback loop · brand-reply submission flow · review-immutability enforcement · taxonomy expansion governance.

**Demo realization (Elena).** Live in the demo: open the editorial admin surface. Show the 30-color V1 catalog with the intersection-of-coverage rule visible (each color tagged with the brands that offer it; specialty-tier colors flagged "1 brand only — unique look"). Show the LLM-classification audit queue with a few pre-classified mock items (the "my friend got Bronde, but I got Auburn" example) — Elena rejects the classification, the queue advances. Show the brand-reply moderation flow with the policy enforced (reply visible, takedown disabled). Narrated: month-3 brand-pressure-to-suppress incident and how the policy held; month-6 taxonomy expansion to 38 colors and V1.5 men's-shade list authoring. Elena's journey is the fifth and final; this is where execs see the editorial integrity layer that makes the outcome dataset have *resale value*, not just first-party marketing telemetry. Closes the demo with the moat fully assembled.

### Journey Requirements Summary

| Capability area | Journeys that demand it |
|---|---|
| Photo upload + on-device or consent-with-30-day-deletion processing | Maya, Janelle |
| Color-first browse with intersection-of-coverage rule + specialty tier | Maya, Janelle, Elena |
| Multi-lighting toggle (3 presets) — V1.1 fallback if spike yellow-lights | Maya, Janelle, Aliyah (calibration handoff) |
| 90-day fade simulator (parameterized by washes-per-week, texture-aware) | Maya, Janelle |
| Same-color-same-render normalization (5×30 hand-tuned table) | Maya, Janelle, Elena |
| Per-color brand list with outcome-anchored sort | Maya, Janelle |
| SDK Type-4 fidelity + texture-aware render parameters + texture-filtered review surface | Janelle (binary trust check) |
| Per-stylist color-specific accuracy aggregation | Janelle, Aliyah, Marcus |
| Per-stylist texture certifications surfaced in salon profile | Janelle |
| Salon search + color-specific certification surface | Maya, Janelle |
| Deep-link booking handoff with context (color, lighting, brand preference) | Maya, Janelle, Aliyah |
| Stylist-facing saved-look access (calendar invite link, web only V1) | Aliyah |
| Stylist-side in-chair review submission with consent capture + source attribution | Aliyah |
| Post-booking trigger sequence (SMS +24h, email +7d, in-app banner) | Maya, Janelle |
| Eventually-consistent attribution: deep-link + webhook (booking) + BSG-side product-pull join (purchase, T+7) | Maya, Marcus |
| Source-attribution labels on every review surface (Google / brand / SB user / stylist-assisted) | Maya, Janelle, Marcus, Elena |
| Salon partner dashboard (web V1): attributed bookings, scorecards, color/brand pull-through, BSG re-order | Marcus |
| Review-reply functionality (no delete) + public review-thread integrity | Marcus, Elena |
| Editorial admin: taxonomy management, intersection-rule enforcement, specialty tier flagging, taxonomy expansion governance | Elena |
| LLM-classified review audit queue + training-data feedback loop | Elena |
| Brand-reply submission flow + review-immutability enforcement | Elena |
| Sally Rewards points integration for verified post-booking reviews with photos | Maya |
| Texture-diversity metric instrumentation (privacy-aware) | Janelle |
| 30-day photo deletion default | Maya, Janelle |

Five journeys cover every V1 capability without redundancy. Three additional journey types deliberately *not* mapped:

- **Box-Dye Defector** — V1.5 (color correction wedge) scope; mapping now would create requirements outside V1.
- **Brand-side analytics user** — V1.5+ (brand-side dashboards deferred); brand-feed integration in V1 is server-to-server, not UI-driven.
- **Customer support / triage** — V1 support is via existing Sally Beauty support channels; dedicated app-support journey would create out-of-scope ops requirements.

## Domain-Specific Requirements

The compliance and integration constraints below split cleanly along the demo / production phase boundary. **Demo V1 has near-zero regulatory exposure** because there are no real users, no real data flows, and no real partnerships in scope. **Production V1 has full regulatory exposure** and the gates below MUST be cleared before any real user touches the deployed system. The gates form a single load-bearing checklist: the post-funding "few more steps" mentioned elsewhere in this PRD is, operationally, this gate.

### Demo V1 Compliance Posture (Now)

The demo runs locally, on team-owned hardware, with team-owned data only. Concretely:

- **No real user photos.** Demo photos are team-provided or curated stock photos selected for MediaPipe handling. No biometric data of any third party is processed.
- **No real PII collection.** Mock user state is local-only; no signup flow; no email capture during the demo.
- **No real reviews ingested.** All review data is fictional; the source-attribution labels are UI placeholders demonstrating how the labels will work in production.
- **No real bookings.** Booking handoff is a mock confirmation page within the demo app; no third-party system is contacted.
- **No real partnership exposure.** Brand names appear in the demo (Wella, Schwarzkopf, Pravana, Redken — BSG-distributed). The demo framing — that no brand contracts are signed and review data is illustrative — is established via verbal disclosure at the start of each session and a one-pager handed to executives at session start. The product surface itself does not carry watermarks or in-UI disclaimers; demo and production are visually indistinguishable.
- **No telemetry sent externally.** Any analytics in the demo are local logging only.
- **No external API calls during demo.** AR rendering, color browse, fade simulator, lighting toggle, mock reviews, mock booking handoff, partner dashboard, editorial admin all run from local fixtures.

**Single demo-time housekeeping requirement:** when the team uses team-member photos as demo data, secure the photos like any other internal company artifact — don't ship them outside the team without consent. This is internal data hygiene, not regulatory compliance.

The post-funding compliance gate below is *what gets cleared before Production V1 goes live*. None of it blocks Demo V1.

### Pre-Production Compliance Gate (Post-Funding, Before Any Real User Touches Production)

This is the gate. Until every item below is signed-off, the production deployment does not accept its first real user. Items are sequenced where dependencies exist; otherwise parallelizable.

#### Compliance & Regulatory

**Biometric privacy (BIPA / TX CUBI / GDPR / state biometric laws):**

- Selfie-based hair analysis is treated as biometric data under BIPA (IL), TX CUBI, NY SHIELD, WA, and analogous EU/UK GDPR Article 9 categories. Concrete precedent: Estée Lauder, Louis Vuitton, Shutterfly, Clearview class-action settlements 2023-24 with $30M+ judgments.
- **V1 stance: on-device processing OR server-side with explicit affirmative consent + 30-day deletion default.** Locked Week 2; bias is on-device unless SDK feasibility forces otherwise. Consent flow language reviewed by legal Week 2. Re-prompt on every photo upload (no implicit re-consent).
- **Signed DPA with SDK vendor (Perfect Corp / ModiFace / Banuba) before any user photo touches production.** No exceptions. Vendor must contractually agree to: (a) no third-party data sharing, (b) no model training on Sally user photos without separate opt-in, (c) deletion on user request within 30 days, (d) breach notification within 72 hours.
- **Right-to-delete surface in V1.** User can request photo deletion from account settings; deletion propagates to vendor within 30 days (audit log retained).
- **Geographic gating:** DFW launch ships with TX-CUBI-compliant consent flow; expansion into IL requires BIPA-specific consent uplift before any IL user can upload. Atlanta backup geography (GA) is comparable to TX in litigation exposure.

**Apple / Google + browser permission constraints (web app, install pathways):**

- Apple ATT framework applies if any in-app tracking analytics fire on iOS Safari / installed PWA. ATT prompt precedes any cross-domain tracking.
- iOS photo-library permission narrative written to maximize grant rate without overpromising; Apple tightened rejection criteria 2024-25.
- Web Push notifications on iOS Safari (16.4+) require explicit user opt-in. Cannot fire post-booking review nudges via web push without it; SMS + email + in-app banner remain the V1 channels.

**Marketplace neutrality & brand contract obligations:**

- **Public Review Integrity Policy** (1-page, externally published Week 8). Required clauses: no takedowns except ToS violations, no ranking adjustments by brand request, brands can reply but not delete, native reviews persist post-contract-termination, ingested third-party reviews displayed as-attributed and immutable by us.
- **Brand contract must include identical ranking-rule clause for Sally private-label / BSG-exclusive brands.** Documented before any brand contract is signed, not after. Press will surface this within 6 months post-launch either way.
- **Paid placement format pre-committed in brand contract:** single labeled "Sponsored" card OUTSIDE ranked list, OR category-sponsored educational content. Foreclose the "rank us higher" ask before any contract is signed.
- **Stylist execution / color outcome / salon environment review separation:** review form captures three independent dimensions; public-facing rankings use color-outcome dimension only. Required to defuse stylist-execution-vs-brand-chemistry mis-attribution. Salon partners see all three privately for stylist coaching.

#### Technical Constraints

**Cold-start review pipeline (Google Places API):**

- Google Places API ToS prohibits republishing reviews in modified form; we display reviews verbatim with source attribution and link back to Google Places listing. Caching policy: weekly refresh; cached ≤7 days per ToS.
- **Cost ceiling:** Eng + Finance owe a per-month Google Places API budget by Week 4. Hard cap with circuit-breaker that degrades to cached-only mode rather than incurring uncapped spend.
- LLM color-classification on ingested Google reviews: classifier tags color references; Elena's editorial audit queue verifies ambiguous cases. False-positive rate target ≤5% before classifications publish to per-color surfaces.
- **Brand-feed reviews segregated** into a clearly labeled "brand-published" tab; never blended into headline rankings. Brand-published reviews are inherently positive and would corrupt outcome rankings.

**Color science / canonicalization:**

- Same-color-same-render requires a canonical color taxonomy mapping each brand SKU to a canonical color vector. Recommended representation: CIE L\*a\*b\* with ΔE-2000 tolerance band ≤2.0 for "same color" classification.
- 5×30 = 150 brand-SKU-to-canonical-color entries hand-tuned by editorial Week 4. Stored as a versioned reference table with full audit log on every change.
- Specialty tier (1-2 brand colors) flagged with `unique_look=true`; UI surfaces "1 brand only — unique look" label.
- Render parameters per canonical color include Type-4 hair adjustments (porosity coefficient, curl-clump albedo); these are SDK-specific and locked at SDK selection.

**Salon booking platform integration matrix:**

- DFW V1 partner salons run on heterogeneous booking systems: Booksy, Vagaro, Square Appointments, GlossGenius, paper. **Webhook capability is a V1-partner qualifier.** A salon that cannot return a confirmed-booking webhook with attribution token intact does not qualify for V1 (downgrade to phase-2 partner).
- Each platform strips or rewrites UTM parameters differently (Booksy strips utm_content; Vagaro iframes hide referrer; Square preserves full UTM). Attribution token format must survive all three; deep-link includes both UTM and a short-code fallback in URL path.
- **Per-salon POS integration (purchase attribution) is explicitly out of V1 scope;** replaced by BSG-side product-pull join (T+7) for salons that order through their BSG account.

**Eventually-consistent attribution chain:**

- Deep-link + webhook = best-effort booking attribution, target ~70% honest coverage given platform fragmentation. Coverage rate published in monthly Sally-internal partner report.
- BSG-side product-pull join = T+7 high-fidelity purchase attribution (the Layer-1 unlock). Joins on (booking_date, salon_id, color_id) → BSG re-order line items within ±2 weeks.
- Real-time closed-loop is explicitly NOT promised. Monthly reconciliation against salon POS for bottom-tier partners (sub-5/month at Week 6) to detect attribution failure vs. genuine product failure.

**Routing-fairness mechanism:**

- Round-robin within search radius, capacity-weighted by salon-reported availability. Required to prevent per-partner booking variance from killing bottom-tier salons.
- Sub-5 attributed bookings/month at Week 6 post-launch triggers automatic routing-fairness intervention OR partner-cut decision. Pre-criteria documented in BD playbook.

**Editorial admin surface:**

- Color taxonomy admin (CRUD on canonical colors, brand-SKU mappings, specialty-tier flags), fully audit-logged.
- LLM-classification audit queue with accept/reject/edit actions; rejected classifications feed the training-data feedback loop.
- Brand-reply submission flow: brand-side users submit replies via secure email-token link; Elena moderates for ToS only, never for content.

#### Integration Requirements

**Sally-owned systems (V1, mandatory):**

- **Sally Rewards SSO** — consumer login + points credit for verified post-booking reviews with photos. Week 6 integration deadline; without it, post-booking review trigger sequence cannot credit reward points.
- **Sally Beauty Supply** — brand-color SKU reference data, BSG account-level salon verification for partner onboarding. Week 4 read-only data feed live.
- **BSG product-pull database** — purchase attribution join, T+7. Week 12 integration deadline; tied to attribution chain go-live.
- **Sally Beauty existing customer support channels** — V1 support routing (no dedicated app-support team in V1 scope).

**Third-party (V1, mandatory):**

- AR SDK vendor (Perfect Corp / ModiFace / Banuba — selected Week 2). DPA + Type-4 fidelity acceptance + custom render hooks for fade simulator + multi-lighting toggle.
- Google Places API (review ingestion). API key + cost cap + caching layer.
- SMS provider (Twilio recommended) for post-booking trigger + booking confirmations.
- Email provider (SendGrid recommended) for post-booking trigger.
- 5 partner brand feeds (server-to-server review ingestion with brand-side authentication). Brand-specific format negotiation Week 4-8.

**Third-party (V1, qualifier-only — partners that don't support are excluded):**

- Salon partner booking platforms (Booksy, Vagaro, Square Appointments, GlossGenius) — webhook capability required as V1-partner qualifier; paper-only salons disqualified or upgraded to a supported platform pre-launch.

#### Risk Mitigations

| Risk | Mitigation | Owner | Trigger |
|---|---|---|---|
| BIPA / CUBI / GDPR class action | On-device processing default; signed DPA; 30-day deletion; affirmative re-consent on every upload; geographic-gated launch (TX V1 only) | Legal + Eng | Week 2 gate |
| SDK Type-4 fidelity failure | Formal eval against ModiFace + Banuba; published fidelity benchmark; re-scope if no vendor clears bar | Eng | Week 2 gate |
| Custom render features fail feasibility spike | V1.1 fallback: ship fade-only; defer multi-lighting publicly | Eng | Week 2 spike result |
| Google Places API cost overrun | Hard monthly cap + caching + circuit-breaker degrade-mode | Eng + Finance | Continuous |
| Brand suppression pressure on negative reviews | Public Review Integrity Policy published Week 8; brand contract clauses; review-immutability enforcement | Product + Legal + Leadership | Continuous |
| Salon webhook integration failure | V1-partner qualifier (no webhook = no V1); fallback to phase-2 partner | BD + Eng | Pre-launch partner onboarding |
| Per-salon booking variance (bottom 4 sub-5/month at Week 6) | Routing-fairness intervention (round-robin + capacity-weighted) OR partner cut | BD + Eng | Week 6 post-launch |
| Sally private-label neutrality optics | Identical-ranking-rules clause in brand contract before any contract signed | Leadership | Week 4 |
| Sally-side activation SLA not signed | Escalate to leadership at Week 4; Week 6 = kill-equivalent | PM + Leadership | Week 4 |
| Beauty-school exclusive front-running by competitor | 1 LOI Week 0 with Aveda / Paul Mitchell / Empire | BD | Week 0 |
| Apple ATT / iOS photo permission rejection | Optimized permission narrative; legal review of consent copy; PWA-installability test pre-launch | Eng + Legal | Week 8 |
| Color taxonomy intersection rule violations (silently broken comparison) | Specialty tier visibly labeled; Elena enforces in admin tool | Editorial | Week 4 + continuous |
| LLM color classification false-positives corrupting per-color rankings | Editorial audit queue with ≤5% false-positive rate target before publishing | Editorial | Continuous |

## Innovation & Novel Patterns

This product is not a technical innovation — the AR rendering is licensed commodity (or open-source MediaPipe in demo); the web stack is boring; the integrations are well-trodden. The innovation is **categorical and architectural**, and naming it precisely matters because validation strategies differ for each kind. **Each innovation has both a demo-time validation (does an exec get it from the meeting-room walkthrough?) and a production-time validation (does it hold in market once funded?). Both are tracked.**

### Detected Innovation Areas

**1. New value-curve axis: outcome truth, not render fidelity.** The hair color try-on category to date competes on render fidelity and entertainment polish (ModiFace, YouCam, Snap). This product creates a new axis the incumbent set structurally cannot serve: *outcome truth* — fade behavior over time, accuracy on my texture, damage profile, would-recommend %. Render fidelity becomes table stakes; outcome truth becomes the category. *Christensen non-consumption being served:* the pre-commitment decision under uncertainty about a 12-week outcome on a customer's specific hair texture, porosity, bathroom lighting, applied by a stylist she hasn't met yet. Nobody serves it today, not because it's hard to render but because nobody owns both the try-on surface and the post-application truth.

**2. Coordination monopoly architecture.** Thin rendering client wrapped around a fat policy-and-pipes backend. The technical novelty is near-zero; the architectural novelty is owning *all* of: brand-side review-data rights (segregated brand-feed tab), salon-side booking-system attribution (deep-link + webhook), salon-side purchase attribution (BSG product-pull join — *Sally-unique, no competitor can replicate*), consumer-side identity (Sally Rewards SSO), and the editorial governance layer that gives the data resale value (Public Review Integrity Policy). Each piece is mundane individually; the *combination* has not shipped before in this category. *In Demo V1, this architecture is fully built — the providers are mocked, but the abstraction is real and demonstrable on demand.*

**3. Outcome-anchored review schema.** Industry-standard reviews are star-based and salon-generic ("great service, friendly staff"). This schema is structured per (brand × color × texture × stylist) with four orthogonal dimensions: fade weeks, accuracy 1-5, damage 1-5, would-recommend %. Plus a separate stylist-execution-vs-color-outcome-vs-salon-environment dimension breakdown. *Industry-novel*; closest analogue is Yelp-for-restaurants, which has no equivalent of multi-dimensional outcome decomposition.

**4. 90-day fade simulator parameterized by washes-per-week.** No commercial AR SDK ships this as of 2026. In Demo V1, this is pure math (linear/exponential blend between week-0 color vector and a faded target) on top of MediaPipe output — no SDK dependency, fully demonstrable. In Production V1, the same math runs on top of the licensed SDK render. The genuine question this asks the user — *not* "does this color suit me?" but "do I want my hair to look like this in eight weeks?" — has never been askable in-market. Also feeds the riskiest-assumption test directly.

**5. Multi-lighting toggle (3 calibrated presets).** Same status as fade simulator — not commercially available. In Demo V1, post-processing on the recolored output (color-temperature shift, white-balance offset, gamma curve per preset). In Production V1, same logic with richer SDK lighting parameters where available. Kills the #1 trust complaint ("looked different in the salon") in the category history. The industry shipped warm-flattering-salon-light as the default *and* the only option for years; offering daylight as a coequal preset is a UX inversion of a tacit industry rule.

**6. BSG product-pull join for purchase attribution.** Industry-standard closed-loop attribution requires per-merchant POS integration — slow, expensive, brittle. Using upstream distributor (BSG) product-pull data as the purchase-confirmation signal is a Sally-only architecture: no competitor can do it because no competitor owns the distributor side. Eventually-consistent (T+7) but high-fidelity. *This is the Layer-1 unlock made technical.* In Demo V1, demonstrated narratively + sample data on Marcus's partner dashboard.

**7. Texture-first SDK selection as a market-positioning move.** Industry default: Type 1/2 first, Type 4 retrofit (ModiFace shade libraries are demonstrably Eurocentric per public tear-downs). Reversing this — making Type 4 fidelity a *binary qualifier* on vendor selection — is anti-pattern reversal that competitors with L'Oréal contracts cannot execute without breaking those contracts. Innovation is the *selection criterion*, not the rendering technology itself. *In Demo V1, Janelle's curated Type 4 photo on MediaPipe stands in; the exec ask is for the production AR SDK selection to be the gate, not whether MediaPipe handles every Type 4 case.*

**8. Public Review Integrity Policy as governance innovation.** Not a technical innovation; a *governance* innovation in a category with documented fake-review history. The published commitment (no takedowns except ToS, no ranking adjustments by brand request, native reviews persist post-contract-termination, ingested third-party immutable) is itself the moat — replicating it would require competitors to break their own brand-revenue dependencies. *Not novel as a policy template* (Yelp has analogues); novel as *infrastructure underwriting an outcome-data asset class*. *In Demo V1, the policy is drafted and linkable from the demo's footer; demonstrated live on Marcus's negative-review-reply flow.*

### Market Context & Competitive Landscape

| Competitor | What they do | Why they can't replicate this product |
|---|---|---|
| **Perfect Corp / YouCam** | B2B2C AR SDK powering single-brand try-ons (Wella, Schwarzkopf, including existing Sally integrations); 2.5B+ try-on sessions across partners | Single-brand experience per integration; no cross-brand color comparison; no outcome data; no salon booking; entertainment/filter framing. Likely the Production V1 SDK starting point, *not* a competitor — they sell the commodity layer. |
| **ModiFace (L'Oréal-owned)** | AR try-on embedded in L'Oréal Paris, Garnier, Redken, Matrix sites; powers Amazon/Sephora try-ons | L'Oréal-owned = STRUCTURAL conflict-of-interest with brand-neutral positioning. Cannot go neutral without cannibalizing L'Oréal portfolio margin. Strengthens Sally's neutrality moat. |
| **Madison Reed** | DTC at-home color brand: quiz + virtual try-on funneling to own SKUs and Madison Reed Color Bars | Single-brand catalog by definition. Routes to own salons only. Cannot go multi-brand without invalidating DTC thesis. |
| **eSalon** | DTC custom-mixed at-home color; stylist-assigned formula via photo-based personalization | Mail-order box, not salon-routed; closed catalog. Competes for at-home segment, not considered-salon segment. |
| **Snap AR / TikTok / Banuba** | Free social-camera filters, viral-driven, live-camera, entertainment framing | Explicitly the "TikTok toy" being positioned against. No purchase path, no brand mapping, no outcome data. |
| **Booksy / Fresha / StyleSeat** | Salon-side appointment platforms; review aggregation (salon-generic) | No color-render layer, no outcome-anchored review schema, no brand-neutral marketplace, no closed-loop attribution. Pay them for booking infrastructure (potentially); they are not category competitors. |

**Market gap that exists today:** zero apps offer brand-neutral cross-brand color comparison + outcome-anchored reviews + salon routing + texture-first rendering + verified attribution. Each individual ingredient has analogues; the *combination* is the category-defining play.

**Validated demand signals:** US hair color $2.1B at 6-7% CAGR · US salon services $69B post-COVID · AR try-on conversion lift 2.5-3x (Perfect Corp / Shopify, single-brand checkouts) · Booksy / Fresha / StyleSeat all raised growth rounds 2023-24 (proves salon-side WTP for digital lead-gen) · Reddit / r/HairDye / r/Blackhair pain points map directly to feature set ("looked nothing like the result in the salon" is the #1 complaint).

### Validation Approach — Two-Stage Portfolio

Each innovation validates twice. First in the meeting room (demo-time); then in market (post-funding). The demo's job is *concept validation*; production's job is *metric validation*.

| Innovation | Demo-time validation (now) | Demo pass bar | Production-time validation (post-funding) | Production pass bar |
|---|---|---|---|---|
| **1. New value-curve axis (outcome truth)** | Execs in the meeting room react to the fade simulator + outcome reviews moments — qualitative read of "they get it" vs. "they're confused" | Verbal exec confirmation that outcome truth is a distinct category from render fidelity, and they want to fund it | Wizard-of-Oz Wks 12-14 with 50-100 Sally Rewards beta users in DFW | ≥40% hard-yes on "would book a salon based on this"; <20% = product needs different shape |
| **2. Coordination monopoly architecture** | Engineering walks through provider abstractions on request; Marcus's BSG re-order surface tells the story in 5 seconds | Execs ask the right question — "is the BSG join real?" → answer "the architecture is real, the integration is one provider swap away" — and accept the answer | Sally-side activation SLA execution + #1 metric (≥10 attributed bookings/partner/month) holding by Week 6 post-launch | SLA signed Week 4; metric holds for ≥6/10 partners by Week 6; <6 partners = routing-fairness or partner-cut intervention |
| **3. Outcome-anchored review schema** | Per-color brand list with mock structured outcomes (fade weeks, accuracy, damage, recommend %) reads clearly to execs; the schema's discriminating power is implicit in the mock data | Execs notice the brand-by-brand differentiation in the mock data and ask "where does the real data come from?" — the schema is doing its job | Post-launch: do brand ratings cluster at the mean (no signal) or differentiate? | Coefficient of variation across brand-color cells ≥0.3 by Month 3; clustering at mean = expand dimensions or revisit |
| **4. 90-day fade simulator** | Slider on demo photo produces credible fade visualization on MediaPipe output | Slider works smoothly, fade trajectory looks plausible to execs (especially for Maya's Bronde scenario where the fade is the deciding factor) | Wks 0-2 feasibility spike on top of selected Production AR SDK | Spike green-lights both fade + multi-lighting on production SDK; yellow-light = ship fade-only, defer multi-lighting to V1.1 publicly |
| **5. Multi-lighting toggle** | Three presets render distinguishably on MediaPipe output; Maya's "salon vs daylight" comparison is visually convincing | Lighting differences are visible enough that execs viscerally feel the "looked different in the salon" pain being solved | Same Wks 0-2 spike on production SDK | Same |
| **6. BSG product-pull join** | Sample data on Marcus's partner dashboard; clear narrative arc | Execs see the BSG re-order surface and recognize that no startup competitor could surface this; ask "is this real?" → "the data shape is right, the join is one integration away" | Compare BSG-side join coverage vs. webhook coverage on same booking set | BSG join captures ≥60% of webhook bookings; <40% = join logic broken OR salons not ordering through BSG |
| **7. Texture-first SDK selection** | Janelle's flow on a curated Type 4 demo photo; visible texture preservation in MediaPipe output | Execs see the texture preservation on Janelle's coily hair and recognize this is the binary trust check; if MediaPipe limits show, the ask becomes "production SDK selection must clear this bar" — which is the right ask | Formal eval against ModiFace + Banuba on Type-4 hair, 30-color matrix, 3 lighting presets | At least 1 SDK clears acceptance bar; no SDK clears = re-scope; texture inclusivity non-negotiable, kill criterion |
| **8. Public Review Integrity Policy** | Marcus's negative-review-reply demo moment — execs see that "delete" doesn't exist, see the reply flow, see the recovery via updated review | Execs nod at the moat narrative; understand why the policy is *infrastructure* not decoration | First brand-pressure-to-suppress test in production (real, not contrived) | Policy holds; brand reply submitted, review remains; bending = strategic moat collapses, leadership-level remediation required |

**Composite kill criteria (cross-referenced from Success Criteria → Production Targets):** any combination of (W-of-Oz <20%) + (SDK Type-4 fail) + (<6 salon LOIs by Week 6) is a re-scope event for the production deployment, *not a fix-and-continue event*. None of these block Demo V1.

### Risk Mitigation

| Innovation risk | Mitigation | Owner | Phase | Note |
|---|---|---|---|---|
| MediaPipe fails on Type 4 hair generally in demo | Curated demo photo set the model is known to handle; explicit narrative to execs that production AR SDK selection is the durable answer | Eng | Demo | |
| Demo runs into a live failure during exec walkthrough | Pre-meeting dry runs on the actual demo hardware; offline-first runtime; no external API dependencies | Eng + PM | Demo | |
| Execs interpret mock review data as real brand commitment | Verbal disclosure at start of each demo session + one-pager handed to executives establishing demo scope (no signed brand contracts, illustrative review data, real product surface) | PM | Demo | Demo framing lives outside the product surface, not in the UI |
| Fade simulator / multi-lighting fail spike on production SDK | V1.1 fallback documented in Exec Summary, not buried | Eng | Production | Already in scope |
| Outcome schema fails to discriminate brands at scale | Expand review dimensions; add qualitative tag layer; revisit schema in V1.5 | Product + Editorial | Production | Month 3 post-launch trigger |
| BSG product-pull join too lossy | Fall back to deep-link+webhook only; downgrade attribution honesty in monthly partner report | Eng | Production | Continuous monitoring |
| Public Review Integrity Policy collapses under first brand pressure | Leadership escalation criteria pre-defined; CEO-level posture; this is a leadership test, not a product test | Leadership | Production | Pre-launch leadership alignment required |
| Texture-first SDK eval fails | Re-scope; texture inclusivity non-negotiable; defer launch | Eng | Production | Week 2 kill gate |
| W-of-Oz <20% hard-yes | Product needs different shape; pause launch and re-discover | Product + Leadership | Production | Wks 12-14 |
| Coordination monopoly fails because Sally-side activation SLA doesn't get signed | Escalate to leadership Week 4; Wk 6 = kill-equivalent | PM + Leadership | Production | Cross-referenced in success criteria |
| New-value-curve framing fails to register with consumers (they hire the app for entertainment, not outcome truth) | Marketing/positioning recalibration; surface "outcome truth" features more prominently in onboarding | Product + Marketing | Production | Month 1 post-launch sentiment monitoring |
| Beauty-school exclusive front-running by competitor during demo phase | BD pre-LOI motion runs in parallel during demo build; 1 LOI Week 0 of post-funding timeline | BD | Both | Defensive |

**A note on innovation theater avoidance:** items 1-2 (new value-curve axis, coordination monopoly) are the *real* innovations and the only ones that need leadership-level conviction to defend. Items 3-8 are tactical novelties that ride on the back of those two. If 1-2 don't hold *in the demo room*, items 3-8 won't save the funding ask. If 1-2 do hold but 3-8 don't fully demo, scope refinement is fine. **The demo is graded on whether 1-2 register, not whether 3-8 are pixel-perfect.**

## Web App-Specific Requirements

### Project-Type Overview

Single web codebase, responsive across desktop laptop browsers and mobile browsers. Runs locally on demo hardware (no deployment, no server beyond a static-file local dev server) for Demo V1; deployed to cloud as a hybrid SPA + SSR/SSG application for Production V1. PWA-installable in production (not in demo). No native iOS/Android apps in either phase.

### SPA vs MPA — architecture decision

**Decision: hybrid — SPA for interactive surfaces, SSR/SSG for SEO-critical routes (Production V1 only).**

- **Interactive surfaces (SPA):** photo upload + AR rendering + color browse + fade simulator + lighting toggle, partner dashboard, editorial admin, in-chair stylist saved-look view. These are app-like, state-heavy, and SEO-irrelevant. Single-page React (or equivalent) with client-side routing.
- **SEO-critical routes (Production V1, SSR or SSG):** per-color landing pages (`/colors/auburn`, `/colors/bronde`), salon profile pages (`/salons/dallas/crown-and-coil`), brand pages (`/brands/wella`). These surfaces are how organic traffic finds the product via Google search ("auburn hair color near me," "Wella Bronde reviews"). SSR/SSG for these routes only.
- **Demo V1:** SPA-only is sufficient. SEO routes can be unrendered or stubbed since the demo doesn't go through search engines.
- **Architecture must accommodate SSR/SSG without rewrite.** Next.js App Router (or Astro / Remix) pattern recommended. Production swap = enable SSR for the `/colors/*`, `/salons/*`, `/brands/*` route trees.

### Browser support matrix

| Browser | Demo V1 | Production V1 |
|---|---|---|
| Chrome (desktop, last 2 stable) | Required | Required |
| Edge (desktop, last 2 stable) | Required | Required |
| Safari (macOS, last 2 stable, ≥16.4) | Required | Required |
| Firefox (desktop, last 2 stable) | Optional (test only) | Required if analytics show ≥5% share |
| iOS Safari (mobile, ≥16.4) | Required | Required |
| Chrome Android (last 2 stable) | Required | Required |
| Samsung Internet | Not tested | Test if analytics warrant |
| Legacy / IE | Not supported | Not supported |

**Hard browser-feature requirements (both phases):**

- WebGL 2 (for TensorFlow.js GPU backend; falls back to WASM if unavailable but slower)
- WebGPU (preferred for ONNX Runtime Web acceleration where available; not strictly required)
- Canvas 2D (for HSL/Lab color shift compositing, share-this-look image generation)
- Web Crypto (for any client-side hashing of attribution tokens)
- IndexedDB (for client-side caching of color taxonomy and mock fixtures in demo; cached editorial data in production)
- File API (photo upload via file picker)
- `getUserMedia` (NOT used in V1 — live camera is V2+)

### Responsive design

- **Single codebase, breakpoint-driven layout.** No separate mobile view, no separate mobile codebase, no React Native. CSS Grid + Flexbox; design tokens (Tailwind CSS or CSS variables) for spacing/color/typography.
- **Touch + pointer events both supported.** Fade simulator slider, multi-lighting toggle, share-this-look button — all interactions work on touchscreen and mouse without separate code paths.
- **Breakpoints:** mobile-first defaults (≤640px), tablet (641-1024px), desktop (≥1025px). Partner dashboard and editorial admin are desktop-optimized but functional on tablet; primary consumer flow (Maya, Janelle journeys) is fully mobile-optimized.
- **Demo target devices (verified pre-meeting):** MacBook Pro 14"/16", Windows 14" laptop (1920×1080 or higher), iPhone 14 Pro or newer, Pixel 7 or newer, iPad Pro (responsive-mobile mode). Test on all five before exec demo.

### Performance targets

| Metric | Demo V1 target | Production V1 target | Notes |
|---|---|---|---|
| Initial load (cold cache) | <3s on demo hardware | <2.5s on median 4G mobile (Web Vitals LCP green) | Demo can preload heavier model assets since hardware is known |
| Hair segmentation + recoloring | <500ms per render on demo laptop; <800ms on demo mobile | <400ms (production SDK is faster than MediaPipe) | Latency on Janelle's flow specifically is exec-visible — slower than 1s feels broken |
| Fade simulator slider scrub | <16ms per frame (60fps) on demo hardware | Same | Interactive scrub feel is a make-or-break demo moment |
| Multi-lighting toggle response | <100ms (perceived instant) | Same | Post-processing chain pre-computed and cached per color |
| Color browse navigation (between colors) | <200ms render swap | Same | Color taxonomy cached client-side |
| Partner dashboard initial load | <2s with mock data | <2s with real data via API | Marcus's flow opens dashboard live |
| Editorial admin audit queue | <1s for 50-item queue | Same | Elena's flow shows live queue interaction |
| Time-to-first-meaningful-paint | <1.5s on demo hardware | <1.5s on median 4G | LCP / FCP both Web Vitals green |
| Bundle size (initial JS) | <300KB gzipped (excluding ML models) | <250KB gzipped | ML model loaded async after first paint |
| ML model size (in-browser) | MediaPipe Hair Segmentation: ~3MB. Loaded async, cached in IndexedDB after first session | N/A (production swaps to SDK with separate loading strategy) | Pre-warm on app open in demo |

**Demo-time performance discipline:** the demo is judged on smoothness in front of execs. Any visible lag during the AR render or fade scrub is a credibility hit. Engineering should profile on the actual demo hardware and verify all targets in the meeting room, not on dev machines.

### SEO strategy

**Demo V1:** N/A. The demo runs locally, no public URLs, no search-engine indexing, no Open Graph tags need to be production-grade. Implement basic meta tags so the architecture is correct; do not invest in keyword research, sitemap generation, or schema.org markup until production.

**Production V1:**

- **SSR/SSG for these route trees:**
  - `/colors/[colorSlug]` — primary organic acquisition surface ("copper hair color," "bronde balayage"). Each color page renders the canonical color, brand options, outcome reviews summary, related salons. Indexed.
  - `/salons/[city]/[salonSlug]` — local-search surface ("hair salon Plano TX," "balayage Dallas"). Each salon page renders the profile, color certifications, color-specific reviews, deep-link to booking. Indexed.
  - `/brands/[brandSlug]` — brand-search surface ("Wella reviews," "Schwarzkopf vs Pravana"). Brand page lists the brand's colors and aggregate outcome metrics. Indexed.
  - `/` — homepage / value-prop landing. Indexed.
- **Not indexed (SPA, `noindex`):** try-on flow, partner dashboard, editorial admin, stylist saved-look, post-booking review surfaces.
- **Schema.org markup:** `Product` for colors, `LocalBusiness` for salons, `Brand` for brands, `Review` for outcome-anchored reviews on color pages.
- **Open Graph tags:** every public-indexed page generates OG tags so share-this-look links render with the user's rendered image as preview (this is share-this-look working its way into organic acquisition).
- **Sitemap:** auto-generated from color taxonomy + signed salon list + brand list; weekly refresh.
- **Canonical URLs:** strict; same color across multiple paths must canonicalize to `/colors/[colorSlug]`.
- **Performance is SEO:** Web Vitals LCP / CLS / INP all green is part of the SEO strategy, not separate from it.

### Real-time requirements

**No real-time / WebSocket / SSE infrastructure in V1 (either phase).**

- Attribution chain is eventually-consistent (T+7 for BSG product-pull join). Polling on partner dashboard is fine.
- Booking handoff is asynchronous via deep-link + webhook in production; mocked in demo.
- Editorial admin audit queue can poll for new items every 60s (no urgency).
- Partner dashboard refreshes on page load + manual refresh button.
- Post-booking trigger sequence (SMS / email) fires from server-side cron-like jobs in production; mocked as toast in demo.

If a future feature demands real-time (live in-chair video consultation V2, live stylist-client co-browsing), revisit then.

### Accessibility — WCAG 2.2 AA target (both phases)

The texture-first / "she actually sees herself" positioning makes accessibility a values commitment, not a checkbox. Built into the demo, not retrofitted post-launch.

| Requirement | Demo V1 implementation | Production V1 same? |
|---|---|---|
| Keyboard navigation through entire consumer flow (upload → browse → render → fade → lighting → reviews → salon search → booking handoff) | Required, tested in dry runs | Same |
| Screen reader announcements for AR render outputs | Alt text describing current state — *"your hair shown in copper, daylight preset, week 0 fade"* — updates as user interacts | Same |
| Screen reader announcements for fade simulator slider | Live region announcing current week and fade state on scrub | Same |
| Focus management on modal opens / closes (review submission, brand-reply flow, share-this-look) | Required | Same |
| High-contrast mode support (UI chrome only — hair color rendering is the product, not a chrome element) | Tested in macOS Increase Contrast and Windows High Contrast modes | Same |
| Reduced-motion preference respected (fade animations, lighting transitions) | `prefers-reduced-motion` media query honored; static views available | Same |
| Color-blind safe UI chrome (buttons, labels, status indicators — NOT the hair color rendering) | Tested with Deuteranopia / Protanopia / Tritanopia simulators | Same |
| Touch target sizes ≥44×44 CSS pixels | Required throughout | Same |
| Form labels and error messages programmatically associated | Required (review submission form, brand-reply, partner dashboard inputs) | Same |
| Language attribute set on `<html>` | `lang="en"` | Same; future i18n: localized lang attributes per route |
| Text contrast ratios 4.5:1 normal / 3:1 large | Verified via automated tooling (axe-core) + manual spot-checks | Same |
| Skip-to-content link | Required | Same |
| Page titles unique and descriptive | Required across all routes | Same |
| `prefers-color-scheme` (dark mode) | Optional V1; consider for V1.5 | Same |

**Accessibility testing in CI (production) and pre-demo (demo):** axe-core or Pa11y on every PR; manual screen-reader walkthrough (VoiceOver on macOS / iOS, NVDA on Windows) of all 5 user journeys before exec demo.

### Tone & Voice (Consumer-Facing Surfaces)

The protagonist is a Considered Color-Changer, not a TikTok filter user. Every consumer-facing copy and design choice is calibrated to this distinction.

- **Voice:** considered, plainspoken, honest. Speaks to a customer who is making a $300, six-month-irreversible decision — not browsing for entertainment.
- **Tone references:** *salon-grade, not toy.* *Last honest mirror, not flattering filter.* *Mentor figure, not hero.*
- **What we do:** acknowledge fade, surface damage rates, label brand-published reviews honestly, label every review by source. Tell the user what could go wrong before they book.
- **What we do NOT do:** cute illustrations, emoji-heavy microcopy, gamified rewards UI for the consumer surface (Sally Rewards points are awarded but not over-celebrated), excitement-bait copy ("OMG you'll LOVE this!"), unspecific superlatives ("amazing color!"), social-network-style streaks or addictive engagement loops.
- **Visual design tenets:** generous whitespace; high-contrast typography; the consumer's rendered photo dominates the frame on the try-on surface; brand and review surfaces use restraint (no rainbow gradients, no animated star-burst on review submission).
- **Copy patterns:**
  - Color names use real industry terminology ("Bronde," "Auburn") not invented marketing names.
  - Buttons use verbs that match user intent ("See this color on me," "Find a salon," "Save this look") not abstract action language ("Continue," "Submit").
  - Empty states tell the truth: *"No color-specific reviews yet — be the first."* Not: *"Reviews coming soon!"*
  - Error states are direct: *"Photo upload failed. Try a different photo."* Not: *"Oops! Something went wrong."*
- **Where the considered/salon-grade tone gets *inverted*:** never. The feeling extends across the consumer surface (Maya, Janelle), the stylist saved-look surface (Aliyah), the partner dashboard (Marcus), and the editorial admin (Elena) — though the latter three lean more functional and less narrative since they are professional tools.

This tone commitment is binding for design reviews and copy editing across both phases.

### Implementation considerations (web app stack)

- **Framework:** Next.js App Router recommended (handles SPA + SSR/SSG hybrid cleanly, accommodates the production swap without rewrite). Alternatives: Astro, Remix. Vite + React Router is acceptable for demo-only but creates a production-time migration cost.
- **Language:** TypeScript throughout. Strict mode.
- **State management:** Zustand or Jotai (lightweight, no Redux ceremony). Provider pattern for dependency injection (mock vs real `ARProvider`, `ReviewProvider`, `AuthProvider`, `AttributionProvider`, `NotificationProvider`, `BookingHandoffProvider`, `SalonProvider`, `BSGProvider`, `CalendarProvider`).
- **Styling:** Tailwind CSS or CSS Modules with design tokens. Single design system, no separate component libraries between consumer and partner-dashboard surfaces.
- **AR / ML:** TensorFlow.js with WebGL2 / WebGPU backend (preferred) or ONNX Runtime Web. MediaPipe Hair Segmentation as the segmentation model. Color-shift logic in pure TypeScript / WebGL shaders for performance.
- **Image / canvas:** Canvas 2D for compositing (segmentation mask + recoloring + lighting post-process); WebGL where shader-based color math is faster.
- **Routing:** Client-side via Next.js router (or chosen framework's). SSR routes server-side, SPA routes client-side, both behind the same router.
- **Persistence (demo):** local fixtures (JSON files in `/public/data/`) loaded at app start. Mock state in IndexedDB for things that should "persist" across demo refreshes (user's saved look, completed try-ons).
- **Persistence (production):** PostgreSQL (or equivalent) backend; same fixture shape exposed via API. Provider swap.
- **Build tooling:** Vite (or Next.js's built-in bundler). Tree-shaking aggressive; ML models lazy-loaded.
- **Testing:** Vitest for unit, Playwright for E2E (covers all 5 journey paths as smoke tests). Pre-demo dry runs run the full Playwright suite.
- **PWA (Production V1 only):** manifest + service worker for offline color browse and "Add to Home Screen" prompt on mobile. Installability is a Lighthouse audit pass requirement.
- **Skip:** native iOS/Android features (Push notifications limited to web push V1.5+), CLI tooling for end users (this is not a developer tool).

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**Approach: Demo V1 is simultaneously an *experience MVP* and a *platform MVP*.**

- **Experience MVP** — the demo's job is to give Sally Beauty executives the *felt* experience of every load-bearing differentiator, not to describe it. They need to *use* the fade simulator, *see* the multi-lighting toggle, *click through* Marcus's negative-review-reply moment, *open* Elena's editorial admin queue. Anything narrated rather than experienced loses funding-conviction power. 5 journeys live, 2-hour walkthrough.
- **Platform MVP** — the codebase is architected as the production codebase from day one. Provider-pattern abstractions (mock providers swap to real providers via DI). Single codebase, no fork. The demo→production transition is environment configuration and procurement, not a rebuild. This *architectural* commitment is what makes the funding ask credible: execs are funding *the deployment of a built product*, not *the building of a designed product*.

This is explicitly *not* a "problem-solving MVP" (we're past problem validation; the brief settled it) and explicitly *not* a "revenue MVP" (V1 has no consumer revenue model — consumer is always free, salon + brand revenue starts post-funding).

### Resource Requirements

| Phase | Team | Funding status |
|---|---|---|
| **Demo V1** | 1 PM + 6 eng + 1 designer + 1 BD + 1 editorial — same team as brief | Eng resources funded. Vendor contracts and cloud infra payments NOT funded. |
| **Production V1** | Same team | Funded by exec buy-in from demo |
| **V1.5** | Same team + targeted hires (color science / ML for canonicalization scale; stylist-side product designer) | Funded post-Production-V1 evidence of #1 metric holding |
| **V2+** | Team scaling decisions made on V1.5 evidence | Funded on Production V1 + V1.5 momentum |

**BD operates in parallel through the demo phase** running pre-LOI motion (engaging brands and salons without contract signing) so the post-funding LOI execution is not starting cold.

**Editorial operates in parallel** building the demo's mock catalog using real BSG-distributed brands (Wella, Schwarzkopf, Pravana, Redken) — this work continues directly into Production V1 as the canonical color taxonomy.

### Demo V1 Timeline — 8 Weeks (Confirmed)

| Week | Focus |
|---|---|
| 1-2 | Architecture scaffold: Next.js App Router, TypeScript strict, provider-pattern interfaces (`ARProvider`, `ReviewProvider`, `AuthProvider`, `AttributionProvider`, `NotificationProvider`, `BookingHandoffProvider`, `SalonProvider`, `BSGProvider`, `CalendarProvider`), Zustand state management, Tailwind design system, MediaPipe Hair Segmentation integration spike with Type-4 photo eval. Editorial begins curating real-brand mock catalog. BD begins pre-LOI motion. |
| 3-4 | Maya's flow end-to-end (consumer happy path): photo upload, color browse, AR render with HSL/Lab color shift, fade simulator, multi-lighting toggle, per-color brand list with mock outcome reviews, salon search, mock deep-link booking handoff, share-this-look. |
| 4-5 | Janelle's flow (texture edge case): texture-aware fade simulation, texture-filtered review surface, Type-4 certification surfaces, curated Type-4 demo photos with verified MediaPipe handling. |
| 5-6 | Aliyah's flow (stylist amplifier): stylist-facing saved-look access via mock calendar invite, in-chair review submission with consent capture and source attribution. Marcus's flow (salon owner): partner dashboard with mock attributed bookings, per-stylist scorecards, mock BSG re-order surface, review-reply flow demonstrating Public Review Integrity Policy. |
| 6-7 | Elena's flow (editorial admin): color taxonomy admin, intersection-of-coverage rule enforcement, specialty tier flagging, LLM-classification audit queue with pre-classified mock items, brand-reply moderation. Accessibility hardening (axe-core CI, manual VoiceOver / NVDA walkthrough of all 5 journeys). |
| 7-8 | Dry-run hardening: full Playwright E2E suite green; 3 dry runs on actual demo hardware (MacBook + Windows laptop + iPhone + Pixel + iPad responsive-mobile); performance profile against targets; demo-day rehearsal. |

If the team has slack at the end of Week 8, candidate uses (in priority order): (1) additional curated Type-4 demo photos to widen Janelle's flow robustness; (2) one extra brand-color cell with deeper mock review density to strengthen the outcome-anchored review schema demo; (3) polish on share-this-look generated image quality. *Not* candidate uses: pulling V1.5 features forward (defeats demo focus), expanding the journey count (already at 5 live), starting Production V1 architecture decisions (premature).

### Phased Roadmap (Confirmed, Cross-Referenced)

The scope phasing is documented in detail in *Product Scope*, *Phasing & Operational State*, and *Domain Requirements*. Recap here for strategic completeness:

| Phase | What ships | Success bar | Dependencies |
|---|---|---|---|
| **Phase 1 — Demo V1 (Now, 8 weeks)** | Full MVP feature set built locally; all 5 journeys demoable; production-quality polish; mocked vendors and partnerships | Sally Beauty exec buy-in to fund operational deployment (binary outcome) | None (eng resources already funded) |
| **Phase 2 — Production V1 (Post-Funding, 16 weeks)** | Same codebase made operational. Cloud infra, signed vendor contracts (AR SDK + DPA, Twilio, SendGrid, paid Google Places), Sally Rewards SSO + BSG product-pull join wired, BD-LOI execution (5 brands + 10 salons in DFW), full BIPA / TX CUBI / GDPR compliance | 5K WAU @ Wk 4, ≥10 attributed bookings/partner/month, 25% native review submission, 30% non-Type-1/2 textures, 5/5 brand retention | Phase 1 success |
| **Phase 3 — V1.5** | Color correction wedge · men's color + gray-blending · BNPL at booking handoff · beauty school partnerships (build; defensive LOI happens Week 0 of Phase 2) · brand-side attribution analytics dashboards · stylist seed reviews | Color-correction conversion lift on panic-bookers; men's color sub-segment growth; BNPL lift on #1 metric; beauty-school cold-start contribution; brand-retention into V2 holding | Phase 2 evidence of #1 metric holding |
| **Phase 4 — V2+** | Stylist-side product (portfolio, in-chair tool, stylist app) · live camera mode · pre-event try-on (calendar) · geofence triggers · native iOS/Android apps · bestie social vote · in-store kiosks · *the data-layer endgame* | Platform momentum — stylists become demand-acquisition channel; outcome dataset queryable with statistical power per cell; brand benchmarking surfaces operational | Phase 3 evidence of platform-extensibility working |

**Dependencies between phases are operational, not architectural.** No phase requires a re-architecture of prior-phase code. New features in V1.5 and V2+ are additions, not rewrites. The codebase carries the team forward.

### Risk Mitigation Strategy — Consolidated Across Phases

Every individual risk is documented in *Domain Requirements → Risk Mitigations*, *Innovation → Risk Mitigation*, and *Success Criteria → Kill Criteria*. This consolidates them into the three strategic risk categories the team should review at each phase gate.

#### Technical Risks

| Risk | Phase | Mitigation summary |
|---|---|---|
| MediaPipe Type-4 hair fidelity insufficient for demo | Demo V1 | Curated demo photo set; explicit narrative that production AR SDK is the durable answer |
| Production AR SDK eval fails Type-4 acceptance bar | Production V1 | Re-scope; texture inclusivity is non-negotiable kill criterion |
| Custom render features (fade simulator, multi-lighting) fail feasibility spike on production SDK | Production V1 | V1.1 fallback: ship fade-only, defer multi-lighting publicly |
| BSG product-pull join coverage too low | Production V1 | Fall back to deep-link + webhook only; downgrade attribution honesty publicly |
| Salon webhook integration fragmentation | Production V1 | Webhook capability as V1-partner qualifier (no webhook = no V1) |
| Performance targets unmet on demo hardware (segmentation latency, fade scrub fps) | Demo V1 | Profile on actual demo hardware in pre-meeting dry runs; not on dev machines |
| Live demo failure during exec walkthrough | Demo V1 | Pre-meeting dry runs; offline-first runtime; no external API dependencies; graceful fallback paths for any failed live action |

#### Market Risks

| Risk | Phase | Mitigation summary |
|---|---|---|
| Execs don't grasp the new value-curve axis (outcome truth vs render fidelity) | Demo V1 | Lead with Maya's fade-simulator moment; the felt experience makes the axis legible |
| Execs don't see the coordination monopoly in Marcus's BSG re-order surface | Demo V1 | Marcus's journey explicitly engineered to make the cross-side ownership unlock visible in 5 seconds |
| Execs interpret mock review data as real brand commitments | Demo V1 | Verbal disclosure at start of each demo session + one-pager handed to executives at session start; demo framing established outside the product surface, not in the UI |
| Wizard-of-Oz <20% hard-yes (consumer rejects the value prop) | Production V1 | Pause launch; product needs different shape |
| Public Review Integrity Policy collapses under first brand pressure | Production V1 | Leadership-level posture pre-defined; CEO escalation criteria; this is a leadership test, not a product test |
| Brand-neutrality positioning fails because of Sally private-label optics | Production V1 | Identical-ranking-rules clause in every brand contract before signing |
| Competitor signs beauty-school exclusives during Demo V1 phase | Both | BD pre-LOI motion in parallel during demo build; defensive LOI Week 0 of Production V1 |

#### Resource Risks

| Risk | Phase | Mitigation summary |
|---|---|---|
| Demo timeline slips past exec availability window | Demo V1 | 8-week timeline locked; weekly check-ins; if Week 6 is behind plan, drop Editorial flow polish before dropping Maya/Janelle/Marcus polish |
| Eng team blocked on procurement for tooling that should be free | Demo V1 | Default-to-free-and-open-source policy; any paid tool requires PM approval |
| Sally-side activation SLA not signed in Production V1 | Production V1 | Escalate to leadership Week 4; Week 6 = kill-equivalent |
| Funding secured but Production V1 timeline slips on vendor lead times (AR SDK contract, DPA negotiation) | Production V1 | Begin AR SDK conversations during Demo V1 phase (no signed contract, but eval and DPA-template exchange started) so post-funding execution is not cold |
| V1.5 hires (color science, ML) not available when needed | V1.5 | Begin recruiting motion during Production V1 phase; cold-start is the long pole |

## Functional Requirements

**Capability contract for both Demo V1 and Production V1.** Every FR below is a capability the product offers in both phases. Implementation differs at the provider boundary (mock providers in demo, real providers in production); the capability surface does not. Any feature not listed here will not exist unless this list is amended.

Actor types:

- **Consumer** — the Considered Color-Changer (Maya, Janelle, Box-Dye Defector personas)
- **Stylist** — color-applying professional working chair-side (Aliyah persona)
- **Salon Partner** — salon owner or operator managing the salon's app presence (Marcus persona)
- **Editorial Curator** — Sally-employed editorial admin governing color taxonomy and review pipeline (Elena persona)
- **System** — automated behaviors enforced by the product (not a human actor; used for invariants)

### Photo Capture & Try-On Visualization

- **FR1:** Consumer can upload a photo from their device (file picker or drag-drop) for use in try-on rendering.
- **FR2:** Consumer can see their hair rendered in a selected color, with the rendered output preserving their hair texture (curl pattern, porosity, individual coil structure where present).
- **FR3:** Consumer can adjust a 90-day fade simulator timeline parameterized by washes-per-week to preview how the selected color will fade over time.
- **FR4:** Consumer can toggle between three calibrated lighting presets (salon, daylight, warm interior) to preview the selected color under different lighting conditions.
- **FR5:** Consumer can view their rendered hair color combined under the texture, lighting, and fade-stage they have selected.
- **FR6:** Consumer can generate a shareable image of their try-on result with an embedded salon-routing link.
- **FR7:** System retains the consumer's photo only for the active session by default; consumer can opt to save the photo to their account for later use.

### Color & Brand Discovery

- **FR8:** Consumer can browse the curated color taxonomy organized by color (not by brand).
- **FR9:** Consumer can see, for any selected color, the list of brands that offer that color, ranked by outcome-anchored review metrics.
- **FR10:** Consumer can view structured outcome metrics per (brand × color × texture) tuple: fade weeks, accuracy 1-5, damage 1-5, would-recommend percentage.
- **FR11:** Consumer can identify specialty-tier colors visibly labeled "1 brand only — unique look" when a color is offered by fewer than three brands.
- **FR12:** System enforces that a color appears in the standard taxonomy only when offered by ≥3 brands within color tolerance.

### Outcome Reviews & Source Attribution

- **FR13:** Consumer can view reviews for a (brand × color) cell with each review labeled by source: Google Places, brand-published, SB user who booked through the app, or stylist-assisted submission.
- **FR14:** Consumer can filter reviews by hair texture type (Type 1 through Type 4).
- **FR15:** Consumer can submit a native review post-booking covering: color outcome (1-5), stylist execution (1-5), salon environment (1-5), fade weeks elapsed, damage (1-5), would-recommend (yes/no), and optional photo.
- **FR16:** System ensures public-facing color rankings use only the color-outcome dimension; stylist execution and salon environment dimensions are surfaced privately to salon partners only.
- **FR17:** System segregates brand-published reviews into a clearly labeled "brand-published" tab and never blends them into headline rankings.
- **FR18:** System never permits deletion of native reviews except for documented ToS violations.
- **FR19:** System never permits ranking adjustments by brand request.
- **FR20:** System retains native reviews after a brand contract terminates.
- **FR21:** System displays ingested third-party reviews verbatim with source attribution; the system does not modify or remove ingested third-party review content.

### Salon Discovery & Booking Handoff

- **FR22:** Consumer can search for salons by location (within a configurable radius) that offer a selected color.
- **FR23:** Consumer can view a salon profile including color-specific certifications, color-specific accuracy ratings, and per-stylist accuracy scorecards.
- **FR24:** Consumer can view per-stylist texture certifications on the salon profile.
- **FR25:** Consumer can initiate a booking handoff from a salon profile that opens the salon's booking flow with the color preference, lighting preset, and brand preference preserved as context.
- **FR26:** System records the consumer's pre-booking context (color, lighting, brand) in the deep-link handoff and emits an attribution token recoverable by the salon's confirmation webhook.

### Stylist Workflow & In-Chair Tools

- **FR27:** Stylist can access a consumer's saved-look context via a web link delivered in the salon's appointment calendar.
- **FR28:** Stylist can view the consumer's pre-booking context (color, lighting, fade-stage selection, brand preference) on a chair-side device.
- **FR29:** Stylist can submit a review on a consumer's behalf with the consumer's verbal consent captured; the system labels the review as "stylist-assisted submission" for source attribution.
- **FR30:** Stylist can view their own color-specific accuracy aggregated across appointments routed through the app, segmented by hair texture.
- **FR31:** Stylist can view their attributed-booking count for the current month.

### Salon Partner Operations

- **FR32:** Salon Partner can view a partner dashboard showing total attributed bookings for the current month against the partner's target.
- **FR33:** Salon Partner can view per-stylist scorecards including color-specific accuracy ratings across all three review dimensions.
- **FR34:** Salon Partner can view brand pull-through analytics showing which colors clients are choosing and the implied brand-reorder demand.
- **FR35:** Salon Partner can initiate a one-tap reorder of brand inventory pre-filled from actual usage data via their BSG account.
- **FR36:** Salon Partner can manage color-specific certifications for their salon and stylists.
- **FR37:** Salon Partner can reply publicly to any review on their salon's surface; the salon partner cannot delete or alter reviews.
- **FR38:** System enforces that salon partner ranking position cannot be altered by request to platform operators.

### Editorial Administration

- **FR39:** Editorial Curator can manage the canonical color taxonomy (create, update, deactivate canonical colors).
- **FR40:** Editorial Curator can manage brand-SKU-to-canonical-color mappings, with full audit logging on every change.
- **FR41:** Editorial Curator can flag colors as specialty-tier (offered by 1-2 brands) with the "1 brand only — unique look" label exposed in consumer surfaces.
- **FR42:** Editorial Curator can review LLM-classified ingested reviews in an audit queue and accept, reject, or edit each classification.
- **FR43:** Editorial Curator can moderate brand replies for ToS compliance only (not for content).
- **FR44:** System surfaces classification false-positive rate as a quality metric available to the Editorial Curator.

### User Identity, Consent & Notifications

- **FR45:** Consumer can sign in with their Sally Rewards identity (Production V1) or use the app without an account in guest mode (both phases).
- **FR46:** Consumer is prompted for affirmative consent before any photo is processed; consent is re-prompted on every photo upload (no implicit re-consent).
- **FR47:** Consumer can request deletion of all photos and associated personal data from their account settings; deletion propagates to upstream vendors within 30 days.
- **FR48:** System retains consumer photos for at most 30 days unless the consumer explicitly opts to save them to their account.
- **FR49:** Consumer receives a post-booking review prompt via SMS at +24 hours, email at +7 days, and an in-app banner on their next visit.
- **FR50:** Consumer can earn Sally Rewards points for verified post-booking reviews submitted with photos.

## Non-Functional Requirements

NFRs below are phase-tagged where the bar differs between Demo V1 and Production V1. Where untagged, the NFR applies to both phases.

### Performance

Detailed targets in *Web App-Specific Requirements → Performance Targets*. NFRs here are the testable acceptance criteria.

- **NFR1:** Hair segmentation + recoloring completes within 500ms on demo laptop (MacBook Pro 14"+ class) and within 800ms on demo mobile (iPhone 14 Pro / Pixel 7+ class). Production V1 target: 400ms regardless of device class (faster SDK).
- **NFR2:** Fade simulator slider scrub maintains 60fps (≤16ms per frame) on target hardware in both phases.
- **NFR3:** Multi-lighting toggle response ≤100ms perceived (post-processing chain pre-computed and cached per color).
- **NFR4:** Color browse navigation between colors completes ≤200ms render swap.
- **NFR5:** Initial application load (cold cache) ≤3s on demo hardware; ≤2.5s on median 4G mobile in Production V1 (Web Vitals LCP green).
- **NFR6:** Partner dashboard initial load ≤2s with current month's data.
- **NFR7:** Editorial admin audit queue renders 50 items ≤1s.
- **NFR8:** Initial JavaScript bundle ≤300KB gzipped (excluding ML models) in Demo V1; ≤250KB gzipped in Production V1.

### Security

- **NFR9:** Consumer photos are processed on-device by default. If server-side processing is enabled in Production V1 as a fallback path, photos are encrypted in transit (TLS 1.3) and at rest (AES-256), and deleted within 30 days.
- **NFR10:** All actor-specific surfaces (Stylist, Salon Partner, Editorial Curator) require authentication and enforce role-based access controls. Cross-actor data access (e.g., Salon Partner viewing another salon's data) is rejected at the API boundary, not at the UI layer.
- **NFR11:** Attribution tokens are cryptographically signed and unforgeable. Tampering with attribution data invalidates the token at the webhook receiver.
- **NFR12:** All data in transit between consumer browser and Production V1 servers uses TLS 1.3 minimum.
- **NFR13:** Consent records (consumer consent for photo processing, stylist verbal-consent capture for in-chair review submission) are timestamped, immutable, and audit-logged.
- **NFR14 (Production V1):** Signed Data Processing Agreement (DPA) with the AR SDK vendor is in place before any real user photo touches production. Vendor contractually agrees to no third-party sharing, no model training without opt-in, deletion on request within 30 days, and 72-hour breach notification.
- **NFR15 (Production V1):** Legal counsel reviews and approves BIPA / TX CUBI / GDPR consent flow language before any real user uploads a photo. Pre-Production Compliance Gate (in *Domain Requirements*) is passed in full.
- **NFR16 (Demo V1):** Demo runtime processes only team-provided or curated stock photos. No real user data, no external telemetry, no external API calls during the meeting-room walkthrough.

### Scalability

Demo V1 has no scalability requirements (single-user local runtime). All NFRs in this category are Production V1.

- **NFR17:** Production V1 supports 5,000 weekly active users in DFW launch geography by Week 4 post-launch with no degradation against the performance NFRs.
- **NFR18:** Architecture supports horizontal scale-out for the consumer-facing AR rendering, salon search, and review surfaces. Partner dashboard and editorial admin are scoped to internal user volumes and do not require the same scale-out path.
- **NFR19:** Geographic expansion (DFW → Atlanta → additional metros) does not require codebase changes, only deployment configuration. Per-metro launches are an operational decision, not an engineering change.
- **NFR20:** Color taxonomy expansion from 30 V1 colors to ≥200 colors (V1.5+ trajectory) is supported without re-architecture; the canonicalization table is data, not code.
- **NFR21:** Native review submission throughput supports ≥25% of post-booking events (~10K reviews/month at the 5K-WAU × 8% conversion target) without queue backlogs.

### Accessibility

Detailed implementation requirements in *Web App-Specific Requirements → Accessibility*. NFRs here are the conformance commitments.

- **NFR22:** Both Demo V1 and Production V1 meet WCAG 2.2 AA conformance across all consumer, stylist, salon-partner, and editorial-admin surfaces.
- **NFR23:** Automated accessibility testing (axe-core or Pa11y) runs on every CI build in Production V1. Manual screen-reader walkthrough (VoiceOver / NVDA) of all 5 user journeys is required before each exec demo and before each Production V1 release.
- **NFR24:** Reduced-motion preference (`prefers-reduced-motion`) is honored across all animations including fade simulator transitions and lighting-toggle changes; static fallback views are available.

### Integration

Detailed integration matrix in *Domain Requirements → Integration Requirements*. NFRs here are architectural commitments.

- **NFR25:** Every external integration (AR SDK, Sally Rewards SSO, BSG product-pull, salon booking webhooks, Google Places, Twilio SMS, SendGrid email, calendar) is wrapped in a provider-pattern abstraction with both a mock implementation (used in Demo V1) and a real implementation (used in Production V1 post-funding).
- **NFR26:** The demo→production transition for any single integration is a provider-swap configuration change, not a code change in business logic.
- **NFR27 (Production V1):** Salon webhook integration is gated as a V1-partner qualifier: a salon that cannot return a confirmed-booking webhook with attribution token intact does not qualify for Production V1.
- **NFR28 (Production V1):** Google Places API usage operates under a hard monthly cost cap with circuit-breaker degradation to cached-only mode rather than uncapped spend.

### Reliability

Two phase-specific reliability bars.

- **NFR29 (Demo V1):** Live exec walkthrough completes 100% of claimed-live journey steps without failure on the demo hardware. Pre-meeting dry runs verify the full Playwright E2E suite passes on the actual demo laptop, mobile, and tablet hardware in the meeting room before the exec session.
- **NFR30 (Demo V1):** Demo runtime requires zero external API calls during the meeting. All data loads from local fixtures so meeting-room WiFi instability cannot cause demo failure.
- **NFR31 (Production V1):** Uptime ≥99.5% for consumer-facing surfaces (try-on, browse, salon search); ≥99.0% for partner dashboard and editorial admin.
- **NFR32 (Production V1):** Attribution chain coverage ≥70% on deep-link + webhook (best-effort booking) and ≥60% on BSG product-pull join (T+7 purchase), measured monthly. Coverage rate published in monthly Sally-internal partner report.
- **NFR33 (Production V1):** Booking-webhook receiver is idempotent on attribution token (tolerates duplicate webhook deliveries) and tolerates out-of-order delivery within a 24-hour window.
- **NFR34 (Production V1):** Post-booking trigger sequence (SMS +24h, email +7d, in-app banner) tolerates upstream provider (Twilio / SendGrid) outages with retry logic and at-most-once delivery semantics per channel per booking.

### Maintainability & Codebase Architecture

These NFRs underwrite the demo→production single-codebase claim. Without them, the path-to-production story collapses.

- **NFR35:** Single codebase serves both Demo V1 and Production V1; no fork. Engineering does not maintain separate demo and production source trees.
- **NFR36:** Provider-pattern abstractions (`ARProvider`, `ReviewProvider`, `AuthProvider`, `AttributionProvider`, `NotificationProvider`, `BookingHandoffProvider`, `SalonProvider`, `BSGProvider`, `CalendarProvider`) define stable interfaces that both mock and real implementations satisfy.
- **NFR37:** Adding a new external integration follows the same pattern: define provider interface, ship mock implementation, swap to real implementation post-procurement. No business-logic changes for the swap.
- **NFR38:** TypeScript strict mode enforced across the codebase; no implicit `any`, no unchecked casts at provider boundaries.
- **NFR39:** Unit test coverage ≥70% for business logic (fade-simulator math, color canonicalization, attribution-token signing, intersection-of-coverage rule). E2E test coverage covers all 5 user journey paths as smoke tests on every CI build.

### Observability

- **NFR40 (Production V1):** The #1 success metric (salon-attributed bookings per partner per month) is instrumented with end-to-end visibility from try-on session → deep-link click → webhook receipt → BSG product-pull join → POS reconciliation. Dashboard surfaces this metric per-partner in real-time (read side, not the eventually-consistent attribution side).
- **NFR41 (Production V1):** All Production V1 kill-criteria thresholds (<6 salon LOIs by Week 6, SDK Type-4 fail, <2K WAU by Week 4, sub-5/month bottom-4 partners, W-of-Oz <2%, Sally-side activation SLA gates) have alerting dashboards visible to PM and leadership.
- **NFR42 (Production V1):** Texture-diversity metric (≥30% non-Type-1/2 in user base) is instrumented in a privacy-aware manner (no per-user texture record retained beyond the active session unless the consumer opts to save).
- **NFR43 (Demo V1):** Local logging during demo runtime is sufficient for post-demo debugging. No telemetry is sent externally.
