---
title: "Product Brief Distillate: Sally Beauty Hair Color Try-On"
type: llm-distillate
source: "product-brief-SB_Project.md"
created: "2026-05-02"
purpose: "Token-efficient context for downstream PRD creation"
---

# Sally Beauty Hair Color Try-On — Detail Pack

Token-efficient overflow context. Each section stands on its own — the reader does not need to have the executive brief loaded.

## 1. Confirmed Constraints (User-Locked, Treat as Non-Negotiable)

- **Two-sided marketplace**: salons + brands pay; consumer is 100% free, ever. No consumer revenue.
- **Same color name = same render across brands.** Do NOT attempt per-brand rendering fidelity. Brand differentiation lives in the review data layer, not pixel rendering.
- **App is a precursor funnel.** Every successful try-on should ideally route into a salon visit.
- **Photo upload only for V1.** No live camera. Reason: keeps user in "deliberate try-on" mental model, not TikTok-filter mental model.
- **Off-the-shelf SDK for rendering.** Engineering effort goes into marketplace + reviews + salon-routing, NOT the camera.
- **Texture inclusivity (Type 4 hair) is a HARD requirement on vendor selection.** Not a "V2 inclusivity story." If no SDK clears the bar, re-scope.
- **UX simplicity**: "browse colors → tap a color → see your look + brand options + ratings." Nothing more.

## 2. V1 Scope (Locked)

In: photo upload · color-first browse (~30 curated colors) · off-the-shelf SDK render · per-color brand list with ratings · 90-day fade simulator (custom build on top of SDK; needs feasibility spike weeks 0-2) · multi-lighting toggle (3 calibrated presets; same caveat) · salon discovery + profile · deep-link booking handoff (NOT in-app) · verified attribution via deep-link referral code → salon booking webhook → monthly POS reconciliation · share-this-look button (single tap, shareable render with salon-routing link) · reviews from Google Places (color-tagged subset only, LLM-classified) + 5 partner brand feeds (segregated tab, never blended into rankings) · post-booking review request via SMS at +24h, email at +7d, in-app banner · source-attribution labels on every review · web + responsive mobile (single codebase) · BIPA/CUBI/GDPR-compliant photo handling.

Team: 1 PM + 6 eng + 1 designer + 1 BD + 1 editorial. 16 weeks. 1 geography (DFW recommended). 10 salons, 5 brands.

## 3. Deferred to V2+ (with Rationale)

- **Live camera mode** — keeps user in deliberate try-on mental model
- **Pre-event try-on (calendar integration)** — V2; anchors color decision to deadline + outfit
- **Bestie social vote** — V3; full social mechanic complex; share button captures most value
- **In-app booking** — V1.5+; deep-link handoff is sufficient and reduces integration burden
- **Geofence triggers (Salon Waiting-Room Mode)** — V2; needs native app
- **Seasonal palette reader** — parking lot, not core
- **Root growth / regrowth preview** — parking lot ("you in 6 weeks if you don't touch up")
- **Brand-site review scraping** — REJECTED; legal gray. Use Google Places officially + brand-feed partnerships.
- **Stylist seed reviews** — V2 cold-start enhancement
- **Attribution analytics dashboards (brand-side)** — V2 brand feature
- **In-store kiosks** — V2+ retail expansion
- **Native iOS/Android apps** — V2+; web-first is deliberate

## 4. Rejected Ideas (Don't Re-Propose)

- **Per-brand rendering fidelity** — simplicity wins; brand diff lives in reviews
- **Custom AR/render engine** — commodity SDK is the call; no defensibility in pixels
- **Per-SKU brand library** — too many SKUs; same-color-same-render is the rule
- **Live camera in V1** — positions as toy/filter rather than salon-grade
- **In-app booking in V1** — integration burden too high; deep-link is enough

## 5. V1.5+ Expansion Lanes (Footnoted in Brief — Adjacent, Not V1)

- **Color correction wedge.** "I tried box-dye and it went green" — highest-stakes, highest-margin salon service. Triage panic-bookers to certified corrective colorists. Competitors literally cannot serve at scale.
- **Men's color & gray-blending.** 5-8 men's shades + gray-blend % slider. Fastest-growing sub-segment, near-zero AR competition. Doubles addressable users with marginal scope cost.
- **BNPL at booking handoff** (Affirm / Afterpay / Klarna). Color services $150-400 = BNPL conversion sweet spot. Lifts the most important success metric.
- **Beauty school partnerships** (Aveda Institute, Paul Mitchell, Empire Education, Tricoci). Solves salon-side cold-start, fills texture-diversity metric, builds 10-yr BSG B2B pipeline with stylists who pick their first distributor on the platform.
- **Stylist-side product (V2).** Portfolio mode, in-chair consultation tool, stylist app. Flips cold-start: stylists become demand-acquisition channel; in-chair review submission can hit 80% rates vs. 25% home-based.

## 6. Riskiest Assumption (Test Plan)

**Assumption**: Users will trust the color preview enough to walk into a salon and book a real appointment based on what they saw.

- **Cheap test**: Figma + 1 working renderer demo, 20 in-store interviews at 1 Sally location.
- **Pass bar**: ≥40% hard-yes.
- **Fail signal**: <20% means the product needs a different shape.
- **When**: Run as part of Wizard-of-Oz pre-launch validation in weeks 12-14, with 50-100 Sally Rewards beta users.

## 7. Eight De-Risk Items (with Owners and First Actions)

| # | Risk | Owner | First Action |
|---|---|---|---|
| 1 | Color taxonomy / canonicalization | Editorial | Hire/name a curator week 0 |
| 2 | Brand-site scraping legality | Brand partnerships + legal | Approach top 5 brands for direct feeds |
| 3 | Google Places API cost control | Eng | Caching + weekly refresh policy; budget the line |
| 4 | Pay-to-feature trust collapse | Product + leadership | Public disclosure policy pre-launch |
| 5 | Brand pressure to suppress reviews | Leadership | Codify Review Integrity Policy (publicly) |
| 6 | Pre-launch supply (no salons signed) | BD/sales | Sales motion week 0; BSG reps run point |
| 7 | Hair texture inclusivity | Eng + vendor selection | Explicit SDK eval criterion |
| 8 | Photo privacy / BIPA / GDPR | Legal + eng | On-device OR explicit consent + 30-day deletion |

## 8. Build Sequence (16 Weeks, Parallel Tracks)

- **Wks 0-2**: BD signs LOIs (5 brands + 10 salons); editorial drafts taxonomy; legal drafts privacy policies + DPA; eng evaluates 3 SDKs + runs feasibility spike on fade simulator + multi-lighting.
- **Wks 3-6**: Core build (upload, render, color browse, brand list).
- **Wks 7-10**: Marketplace + reviews (salon profiles, brand feeds, attribution webhook integrations).
- **Wks 11-13**: Differentiating features (fade simulator, lighting toggle, post-booking trigger sequence).
- **Wks 12-14**: Wizard-of-Oz pre-launch validation (50-100 Sally Rewards beta users, end-to-end conversion measurement).
- **Wks 14-15**: Hardening + 50-user closed beta + Review Integrity Policy publish.
- **Wk 16**: Public launch (DFW, 10 salons, 5 brands, 30 colors).

## 9. Success Metrics (V1, Post-Launch)

| Metric | Target | Notes |
|---|---|---|
| Weekly active users in launch geography | 5,000 by week 4 post-launch | Sized against Sally Rewards DFW addressable list (PM+BD to deliver number) |
| Try-on → salon booking conversion | ≥8% | **Aspirational**; W-of-Oz validates; reset to 4-5% if needed (would imply ~10K WAU target) |
| Salon-attributed bookings per partner per month | ≥10 | **#1 metric**; verified via webhook + POS reconciliation, not self-report |
| Native review submission rate (post-booking) | ≥25% | SMS+email+in-app banner cadence |
| Hair texture diversity in user base | ≥30% non-Type 1/2 | Detection method TBD; privacy-aware |
| Brand partner retention into V2 | 5/5 | Pair with brand spend retention to avoid gaming |

## 10. Kill Criteria (Decided in Advance, Applied Clinically)

- <6 salon LOIs by week 6 → pause the build, regroup with BD.
- SDK Type-4 hair eval fails (no vendor clears bar) → re-scope; texture inclusivity non-negotiable.
- <2,000 WAU by week 4 post-launch → retrench to a Sally Rewards-funded acquisition tool only; revisit brand revenue at month 6.
- Per-partner booking variance kills the bottom 4 salons (sub-5/month at week 6) → routing-fairness intervention or cut to fewer partners.

## 11. Pre-Conditions (Week-0 Gates — Build Does Not Advance Past Wk 2 Without These)

1. **BIPA / CUBI / GDPR stance** (Legal + eng, wk 2): on-device OR server-side w/ consent + 30-day deletion. Signed DPA with SDK vendor.
2. **SDK selection** (Eng, wk 2): Perfect Corp likely starting point (existing Sally integrations); eval ModiFace + Banuba on Type-4 specifically; fade simulator + lighting feasibility spike completed.
3. **Pre-launch supply** (BD, wk 6): 5 brand LOIs + 10 salon LOIs concentrated in 2-3 DFW sub-zones. BSG sales reps run point.
4. **Color taxonomy** (Editorial, wk 0 hire / wk 4 deliverable): editorial curator named; intersection-of-coverage rule ≥3 brands per color so "compare brands" promise is never silently broken.
5. **Public Review Integrity Policy** (Product + legal + leadership, wk 8 publish): 1-page externally published. No takedowns except ToS. No ranking adjustments by brand request. Brands can reply but not delete. Reviews persist post-contract-termination. **This IS the moat.**
6. **Sally-owned brand neutrality** (Leadership, wk 4): private-label/BSG-exclusive brands held to identical ranking rules; documented in brand-partner contract before any contract is signed.

## 12. Genuinely Open Questions (Decisions to Make, Not Yet Defaults)

- **Launch geography (final)**: DFW recommended (HQ proximity, dense Sally retail + BSG salon coverage, large textured-hair customer base, TX CUBI less litigated than IL BIPA). Atlanta strong alternative if textured-hair customer density indexes higher there. PM + BD to confirm by wk 2.
- **GTM channel mix (final)**: Sally Rewards email/SMS in DFW (size addressable list before commit) + in-store retail signage + QR codes on color aisles + BSG salon-partner promotion. No paid social/influencer until retention proven. Marketing + BD to confirm.
- **Pricing for paid sides**: out of brief scope; BD/finance owe pricing memo by wk 4. Eng needs lock by wk 8 to avoid retrofits on rankings, billing, attribution surfaces.

## 13. Personas (Detailed)

### Primary — The Considered Color-Changer
- Age 25-45
- Planning a deliberate color shift: event (wedding, anniversary, photoshoot), season change, post-something life moment, or "I'm done with my current color"
- High intent, researches before deciding
- Burned by "looked different in salon" or by a box-dye experiment
- Wants to pre-visualize, get social validation, book the right salon
- Doesn't want a TikTok filter — frames the decision as considered, not impulsive
- **Funnel target**

### Hard Requirement (not separate persona) — Texture Inclusivity
- Type 3-4 hair (curly, coily, locs, recently treated)
- Sally's customer base skews more textured than mainstream beauty AR market
- Renderer that fails on Type 4 will tank trust day 1
- SDK selection MUST clear this bar; not optional, not deferred

### Secondary — The Stylist
- Most influential repeat user we have
- Pulls up app at the chair to align expectations with client; pre-loads client looks; sends links
- In-chair review submission rate can hit 80% vs. 25% home-based
- V1: consumer flow designed so stylist usage is anticipated, not designed against
- V2: full stylist-side product (portfolio mode, stylist app)

### Secondary V2 Expansion — The Box-Dye Defector
- Has done at-home color, regrets it, ready to spend on salon
- Won by anchoring salon-routing path with proof of outcome

## 14. Differentiator Stack (Layered Moat — In Order of Durability)

1. **Sally's structural cross-side ownership** — BSG + Sally Beauty Supply + Sally Rewards (~17M) + 5,000 stores. Startup CAC to replicate: 2 yrs + tens of millions.
2. **Outcome-data flywheel** — queryable dataset of fade weeks, accuracy, damage, would-recommend %, after-photos. Compounds with volume.
3. **Structural neutrality** — only player without brand-side conflict-of-interest at scale. ModiFace = L'Oréal-owned. Madison Reed/eSalon = single-catalog by definition.
4. **Texture-first build** — vendor selection criterion = market-leadership claim. No incumbent can credibly claim this.
5. **Closed-loop attribution** — campaign view → try-on → booking → in-chair brand purchase → repeat. Only Sally owns end-to-end.
6. **Public Review Integrity Policy** — durable trust signal in a category history of fake reviews.
7. **Same-color-same-render** — technical simplicity translated to brand-neutral UX no single-brand app can match.

## 15. Differentiator Pitch Lines (Use Verbatim)

- *"The only color try-on app that's brand-neutral, outcome-tracked, and salon-routed."*
- *"Every other try-on is a single-brand toy or a TikTok filter."*
- *"Yelp-for-color-outcomes"* — consumer framing
- *"The data layer for hair color outcomes industry-wide"* — B2B/exec framing
- *"Carfax for color"* — trust infrastructure framing

## 16. Competitive Intelligence (Detailed)

### Perfect Corp / YouCam
- B2B2C AR SDK powering try-on for many brands (Wella, Schwarzkopf, **already integrates with Sally Beauty**)
- Live-camera filter UX, brand-licensed color libraries
- 2.5B+ try-on sessions across partners
- **Likely V1 SDK starting point** given existing relationship
- Gaps: single-brand experience per integration, no cross-brand color comparison, no outcome data, no salon booking, "filter toy" framing

### ModiFace (L'Oréal-owned)
- AR try-on tech embedded in L'Oréal Paris, Garnier, Redken, Matrix sites; powers Amazon/Sephora try-ons
- L'Oréal-owned = STRUCTURAL conflict-of-interest with brand-neutral positioning
- Only renders L'Oréal-portfolio shades faithfully
- No outcome reviews, no salon routing, no fade-over-time
- **Strengthens Sally's brand-neutrality moat**: cannot be cleanly replicated by L'Oréal

### Madison Reed
- DTC at-home color brand: quiz + virtual try-on funneling to own SKUs and Madison Reed Color Bars
- Single-brand catalog by definition; routes to own salons only
- No comparative reviews, no fade simulator

### eSalon
- DTC custom-mixed at-home color; stylist-assigned formula, photo-based personalization (no AR try-on emphasis)
- Mail-order box, not salon-routed; closed catalog
- Competes for at-home segment, not considered-salon segment

### Snap AR / TikTok / Banuba
- Free social-camera filters, viral-driven, live-camera, entertainment framing
- Explicitly the "TikTok toy" positioned against
- No purchase path, no brand mapping, no outcome data; accuracy incidental

## 17. Market Data Points

- US hair color market ~$2.1B (2024), ~6-7% CAGR through 2030
- Global hair color market ~$26-30B (2024) per Grand View Research / Fortune Business Insights
- US salon services rebounded to ~$69B post-COVID (PBA, 2024)
- Color = highest-margin, highest-repeat salon service; 4-8 wk repeat cycle for single-process
- At-home box dye ~$1.6B US, flat-to-declining as Gen Z/millennials shift to salon and dimensional color (balayage, gloss)
- AR try-on conversion lift 2.5-3x (Perfect Corp/Shopify case data, 2023-2024) — **caveat: from single-brand checkouts, not multi-brand routed funnels**
- Sally Beauty FY2024 revenue ~$3.7B (Sally Beauty Supply + BSG combined)
- Sally Rewards membership ~17M (public reporting; team to verify exact figure and DFW addressable engaged subset)
- Booksy, Fresha, StyleSeat all raised growth rounds 2023-2024 — proves salon-side willingness-to-pay for digital lead-gen

## 18. User Sentiment from Existing Solutions (App Store / Reddit / r/HairDye / r/curlyhair / r/Blackhair)

- "Looks nothing like the result in the salon" — **#1 trust complaint** across YouCam, ModiFace, Style My Hair
- Lighting is the dominant accuracy complaint ("looks great in app, orange in daylight") — directly validates multi-lighting toggle
- Type 4 hair users report consistent failures: AR masks miss curls, color doesn't render on darker base tones, shade libraries Eurocentric
- Distrust of single-brand try-ons as "ads" is explicit ("of course Garnier says Garnier looks good on me") — directly validates brand-neutral framing
- No app surfaces fade speed or damage — users hunt this manually across YouTube reviews and Reddit threads — directly validates outcome-anchored reviews

## 19. Regulatory Context

- **BIPA (Illinois)**: selfie-based facial geometry treated as biometric data. Class actions against Clearview, Shutterfly, Estée Lauder, Louis Vuitton (settlements 2023-2024). Settlements have hit $30M+.
- **TX CUBI, WA, NYC**: similar biometric laws; less litigated than BIPA
- **GDPR**: photo handling, retention, consent
- **Mitigation**: on-device processing OR server-side w/ explicit consent + 30-day deletion; signed DPA with SDK vendor before any user photo touches production
- **Apple ATT and tightening photo-library permissions**: friction on selfie upload; need clear permission narrative + on-device-processing claim to maintain conversion and avoid app-store rejection

## 20. Cold-Start Review Strategy (3-Phase, Critical Detail)

**Phase 1 — External seed at launch:**
- Google Places API (officially licensed, ToS-compliant) — color-tagged subset only, LLM-classified for color relevance
- Brand-feed reviews — segregated into a **clearly labeled "brand-published" tab**, NEVER blended into headline rankings (brand-published reviews are inherently positive and would corrupt outcome rankings)

**Phase 2 — Native collection:**
- Post-booking review request: SMS at +24h + email at +7d + in-app banner on next visit
- Pre-instrument deep-link handoff with confirmation pixel/webhook from each salon's booking system pre-launch — if any salon can't confirm, downgrade attribution model to self-report (or disqualify from V1)

**Phase 3 — Transition:**
- Once a salon-color or brand-color cell hits critical mass of native reviews, switch primary display to "SB Users said..." with external sources demoted to secondary tab

**Source attribution**: every review labeled — "Google Review," "[Brand] verified buyer," "SB User who booked through this app." Transparent attribution is itself a marketing point: "Sally doesn't fake reviews — we show you exactly who's saying what."

**Where review-cells are empty**: show "no color-specific reviews yet — be the first" CTA. Do not fabricate depth illusion by aggregating unrelated reviews.

## 21. Cross-Side Incentive Risks (Reviewer Findings, Critical for PRD)

- **Brand suppression pressure**: brand whose color underperforms threatens to pull → public Review Integrity Policy is the moat. No takedowns, no ranking adjustments, brands can reply but not delete. Reviews persist post-contract.
- **Salons-as-acquisition kickback dynamic**: salons promoting heavily expect more inbound. Decouple promotion from ranking. Offer transparent referral-credit (free month of platform fees per N referrals) so promotion is rewarded without distorting marketplace ranking.
- **Paid placement vs. neutrality tension**: pre-commit to paid format that doesn't break neutrality (single labeled "Sponsored" card OUTSIDE ranked list, OR category-sponsored educational content). Lock into brand contracts — foreclose the future ask.
- **Stylist execution vs. brand chemistry mis-attribution**: review form must separate stylist execution (1-5) from color/brand outcome (1-5) from salon environment (1-5). Public-facing rankings use color outcome dimension only. Show salons their stylist scores privately.
- **Consumer content-labor asymmetry**: free side does the work the paid sides benefit from. Sally Rewards points for verified post-booking reviews with photos. Costs little, lifts 25% submission target.

## 22. Supply Density / Cold-Start Risks (Reviewer Findings)

- **5 brands × 30 colors = sparse matrix**: niche/textured shades may have only 1 brand → "compare brands" promise breaks. **Fix**: intersection-of-coverage rule ≥3 brands per color, even if cuts colors from 30 to 20. Reserve a "specialty" tier visibly labeled as "1 brand only — unique look" so the comparison promise is never silently broken.
- **10 salons in DFW**: scatter risks 0-coverage zones. Concentrate in 2-3 sub-zones (Plano/Frisco + Dallas-core + Fort Worth-core). Cap launch marketing geo-targeting to those zones.
- **Brand certification per salon**: define as binary brand-stocked + stylist-trained from BSG account data day 1. Defer "result-certified" (outcome-based) to V2.
- **5 paid brand partners reads as "bundle," not marketplace**: supplement with 3-5 listed-but-unpaid BSG-distributed brands. Disclose paid vs. listed transparently. Total reads as 8-10.
- **Native review depth thin at launch (~100/wk projected)**: show review count + source-attribution prominently; don't mask the cold start.

## 23. Liquidity / Metrics Risks (Reviewer Findings)

- **Per-salon distribution unevenness**: track per-salon from week 1, not just aggregate. Build routing-fairness mechanism (round-robin within radius, capacity-weighted). Sub-5 bookings/month at week 6 → intervene.
- **Conversion target sourcing**: 8% from generic AR lift (single-brand checkouts), not deep-link funnel. Likely actually 3-5%. W-of-Oz validation weeks 12-14. If 4-5%, reset WAU target to ~10K to hit per-salon bar.
- **Sally Rewards DFW addressable list size**: PM + BD owe this number before commit. <50K engaged in metro = pad with paid acquisition or extend ramp window beyond week 4.

## 24. Expansion / Durability Risks (Reviewer Findings)

- **Each new metro is fresh cold-start**: salons local, brands portable. Stage geo expansion in waves of 3-5 metros so brand-side compounds; pre-seed each metro with 90 days BSG-driven outreach + 8+ salon LOIs before consumer launch.
- **No enforcement on salon promotional behavior**: tier into partnership contract — free months tied to QR scans/referrals, monthly partner scorecard, quarterly "top promoter" badge boost.
- **Sally private-label brands on platform**: decide now, document in contract; identical ranking rules; press will find this in 6 months.
- **Data flywheel slower than implied**: competitor can replicate review schema fast and seed via paid panel reviews. Patent/trade-secret outcome taxonomy where defensible. Manufacturer batch-level fade testing data via brand contract = data startups truly can't replicate.
- **Salvage mode if booking attribution fails**: if WAU + review-submission hold but attribution doesn't, pivot to Sally-Rewards-funded standalone acquisition tool (no brand revenue) for 2 quarters. Pre-write criteria so the call is clinical, not political.

## 25. Strategic Partnerships (Opportunity-Reviewer Recommendations)

- **BNPL** (Affirm/Afterpay/Klarna): embed at booking handoff; $150-400 service price = sweet spot
- **Beauty schools** (Aveda Institute, Paul Mitchell, Empire, Tricoci): salon-side cold-start + texture diversity + BSG B2B pipeline + 5-10 yr customer LTV
- **Stylist liability/professional insurance** (Insure Beauty, Babb, Marine Agency): "app-routed clients with documented expectations" qualifies for premium discounts → hard ROI for salons to join. Pitch shifts from "leads" to "leads + lower insurance."
- **Influencer agencies** (Whalar, Influential, niche hair-creator collectives): white-label try-on inside creator workflows; "come do my hair with me" TikTok = attributed funnel into Sally salon partner. Attribution Instagram can't provide.

## 26. Brand-Neutral Positioning — Watch-Outs

- "Brand-neutral" perception risk: consumers/journalists may not distinguish neutral from "multi-brand retailer." Single press story re: paid placement could break it overnight.
- Mitigation: Public Review Integrity Policy (published before launch) + paid-placement format that doesn't break neutrality + transparent paid-vs-listed disclosure on every brand
- Sally private-label brands (Ion, BSG-exclusives) on the platform = highest watch-out. Identical rules or don't list. Document in contract. Press will find it in 6 months either way.

## 27. Phase 2/3/4 Brainstorming Outputs (For Reference)

**Phase 2 — Mind Map themes:** A. Core User Flow · B. UX Moments / Roadmap · C. Differentiator Stack · D. Marketplace / Monetization · E. Trust & Cold Start · F. Tech Choices · G. Future / Parking Lot

**Phase 3 — Six Hats pressure-test on top 3 concepts:** Product survives. No existential Black Hat findings. Biggest risks are organizational (taxonomy, BD, review integrity, supply), not technical. Two new V1 work items surfaced: (a) public review-integrity policy, (b) parallel BD motion to sign 50 salons + 5 brands pre-launch.

**Phase 4 — Resource Constraints (output is V1 scope above).** Bias-to-ship discipline drove every cut. User repeatedly course-corrected away from over-engineering ("we're making this more complicated than it needs to be").

## 28. Tone / Voice Guidance for Downstream Documents

- **Audience for upcoming PRD**: Sally Beauty's internal Product & Engineering team
- **Voice**: clear-eyed product framing, not commercial pitch. Engineers reading between lines beats marketing-speak.
- **Density**: high — this team is technical and product-fluent. Don't waste their time with explanation of the obvious.
- **Decisive on what's locked, honest about what's open.** Brainstorming user style is bias-to-ship, decisive, allergic to over-engineering. Match it.
