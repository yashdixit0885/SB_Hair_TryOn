---
title: "Product Brief: Sally Beauty Hair Color Try-On"
status: "complete"
created: "2026-05-02"
updated: "2026-05-02"
audience: "Product & Engineering team"
inputs:
  - "_bmad-output/brainstorming/brainstorming-session-2026-05-02-0829.md"
  - "Web research (competitive landscape, market sizing, regulatory context)"
---

# Product Brief: Sally Beauty Hair Color Try-On

## Executive Summary

Hair color is a $2.1B US market and the highest-margin, highest-repeat service in the $69B salon industry. Yet the digital tools shoppers use to plan a color change — TikTok filters, single-brand AR try-ons, generic Google reviews — are uniformly bad: they're either toys (no purchase path), ads (single-brand by design), or noise (reviews of the salon's coffee, not the color result). The result is a $1.6B at-home box-dye category losing share as Gen Z and millennials shift toward "considered color," a category-wide social-anxiety drop-off on color experiments, and a trust gap nobody has filled.

Sally Beauty is the only company structurally positioned to fill it. We already serve both sides of this market — Sally Beauty Supply (consumer) and Beauty Systems Group / BSG (pro/salon) — at $3.7B FY2024 combined revenue. Where competitors have to *build* either a brand or a salon network, we already have both. We're proposing to use that asymmetry to launch a brand-neutral hair color try-on app: upload a selfie, browse colors (not brands), see yourself in any of ~30 curated shades with realistic 90-day fade simulation and multi-lighting preview, see which brands offer the color you picked alongside outcome-anchored reviews from real customers (fade speed, accuracy, hair damage), then book the partner salon certified for the result you want.

The bet: in a category where every other digital try-on is a single-brand toy or a TikTok filter, Sally builds the only color try-on app that's **brand-neutral, outcome-tracked, and salon-routed** — and turns the precursor digital moment into the highest-converting funnel into our salon partner network. The longer-term play is to become **the data layer for hair color outcomes industry-wide** — the canonical place brands compete on real customer results and consumers research before they commit. V1 succeeds even if that bet doesn't compound; if it does, this is category-defining.

## The Problem

Three pains, one root cause.

**For consumers:** "It looked different in the salon" is the #1 complaint across YouCam, ModiFace, and Style My Hair. Lighting kills accuracy. Existing apps preview a salon-day result and ignore the 90 days of fade that follow — turning the #1 *post*-purchase regret into an unavoidable surprise. Textured-hair (Type 3-4) customers — disproportionately Sally's customer base — fail consistently in mainstream try-ons: AR masks miss curls, shade libraries skew Eurocentric, recommendations feel built for somebody else. And every single-brand try-on reads as an ad: *"Of course Garnier says Garnier looks good on me."*

**For salons:** They have no way to qualify a walk-in's color expectations before the chair. The "show me the picture" conversation is the worst conversation in the appointment — bad photos, unrealistic refs, and the stylist eats the cost of the mismatch. They also pay for digital lead-gen on platforms (Booksy, Fresha, StyleSeat) that review the salon generically, never the *color result specifically*.

**For brands:** Marketing dollars vanish into Instagram with zero attribution. Brands have no idea which campaign drove which in-chair purchase. They compete on rendering claims and influencer loyalty rather than on the actual customer outcomes (durability, fade, damage) that determine repeat purchase.

The root cause: there is no neutral, outcome-tracked layer between the moment a consumer wants a new color and the moment a stylist applies it. Every existing tool is owned by a brand (conflicted), a salon platform (uninterested in color specifics), or a social network (entertainment, not commerce).

## The Solution

A web + responsive-mobile app. Photo upload — *deliberately no live camera in V1*. Browse by **color**, not brand — same color name renders the same across brands. Tap a color, see yourself, see every brand that offers it ranked by structured outcome reviews (fade weeks, accuracy 1-5, damage 1-5, would-recommend %). Two unique preview features:

- **90-Day Fade Simulator.** Slide from "freshly done" through 90 days, with washes-per-week as a variable. Turns the #1 post-purchase regret into a pre-purchase informed choice. Drives reorder.
- **Multi-Lighting Toggle.** Render the same color under salon lights / daylight / warm interior. Directly kills the "looked different in the salon" complaint that drives the most refunds in the category.

Then route to a partner salon — full salon profile, color-specific reviews ("how good is this salon at copper?"), brand certifications, deep-link booking handoff to the salon's existing system (no in-app booking in V1). **Attribution is verified, not self-reported:** deep-link with referral code → salon booking system webhook on confirmed booking → monthly reconciliation against salon POS. Salons that can't return a webhook don't qualify as V1 partners.

**Engineering is deliberately boring — with two specific exceptions worth flagging.** We license a third-party AR SDK (Perfect Corp / ModiFace / Banuba) chosen against published Type 4 hair performance as a hard requirement. We do not build a renderer. We do not chase per-brand pixel fidelity. *However:* neither the 90-day fade simulator (parameterized by washes-per-week) nor the multi-lighting toggle (3 calibrated presets) ships off-the-shelf in any AR SDK we've evaluated — both are custom rendering work on top of the licensed SDK and need a 2-week feasibility spike in weeks 0-2 before V1 scope is final. If the spike fails, we cut to one hero feature. The defensibility is in the data layer above — the marketplace, the reviews, the salon-routing — not the camera.

## What Makes This Different (and Why Sally Specifically)

Three things, in order of importance:

1. **Sally Beauty is the only company that owns both sides of the marketplace at launch.** BSG distributes pro brands to thousands of salons we already have relationships with — and the BSG sales force is in those salons every week with order pads. That's a zero-CAC salon-onboarding channel a startup would spend two years and tens of millions to build. Sally Beauty Supply already serves the consumer. Sally Rewards is ~17M beauty-engaged consumers (team to confirm; public reporting puts the loyalty program at this scale). 5,000 retail stores are physical distribution we can't lose. **This is the moat.**

2. **The data flywheel compounds.** Outcome-anchored reviews are a *queryable dataset* — fade weeks, damage ratings, would-recommend %, after-photos. As volume grows, brand rankings become trustworthy, salon recommendations become surgical, and the moat deepens. Every other beauty review platform optimizes for star count; we optimize for outcomes. The longer we run, the harder we are to replicate.

3. **Structural neutrality is real, not rhetorical.** ModiFace is owned by L'Oréal. Every L'Oréal-built try-on has a structural conflict-of-interest. Madison Reed, eSalon, and every DTC brand-as-app is single-catalog by definition. Sally is the only brand-neutral player with the scale to be credible — *and* the only one with both supply and demand already on the platform.

The engineering bet (off-the-shelf SDK) is not the moat. The two-sided marketplace, the outcome-data flywheel, and Sally's cross-side asset position are.

## Who This Serves

**Primary user — "The Considered Color-Changer."** Age 25-45, planning a deliberate color shift (an event, a season change, a post-something life moment, or "I'm done with my current color"). High intent. Researches before she decides. Has been burned by "looked different in salon" or by a box-dye experiment. Wants to pre-visualize, get social validation, and book the right salon — but doesn't want a TikTok filter. **She is the funnel target.**

**Hard requirement, not separate persona — texture inclusivity.** Sally's customer base skews more textured (Type 3-4) than the mainstream beauty AR market. A renderer that fails on Type 4 hair will tank trust on day one. We pick the SDK that performs best on textured hair. This is a hard requirement on vendor selection, not a "V2 inclusivity story."

**Secondary user — the stylist.** The most influential repeat user we have. If the stylist pulls up the app at the chair to align expectations with the client, the stylist becomes a demand-acquisition channel — pre-loading client looks, sending links, prompting in-chair review submissions. V1 doesn't ship a stylist-side product (no portfolio mode, no stylist app), but the consumer flow is designed so stylist usage is *anticipated*, not designed against. The full stylist-side product is V2.

**Secondary, V2 expansion — "The Box-Dye Defector."** Someone who's done at-home color, regrets it, and is ready to spend on salon. We win her by anchoring the salon-routing path with proof of outcome.

## Success Criteria (V1, post-launch in 1 geography)

| Metric | Target |
|---|---|
| Weekly active users in launch geography | 5,000 by week 4 post-launch |
| Try-on → salon booking conversion | ≥8% |
| Salon-attributed bookings per partner per month | ≥10 |
| Native review submission rate (post-booking) | ≥25% |
| Hair texture diversity in user base | ≥30% non-Type 1/2 |
| Brand partner retention into V2 | 5/5 |

The single most important number is the third — *salon-attributed bookings per partner per month.* If salons aren't getting verified leads, the supply side collapses and the marketplace dies. Everything else is leading indicator for that.

**Kill criteria** (decided in advance, applied clinically):
- <6 salon LOIs signed by week 6 → pause the build, regroup with BD.
- SDK Type-4 hair evaluation fails (no vendor clears the bar) → re-scope; texture inclusivity is non-negotiable.
- <2,000 WAU by week 4 post-launch → retrench to a Sally Rewards-funded acquisition tool only; revisit brand revenue at month 6.
- Per-partner booking variance kills the bottom 4 salons (sub-5/month at week 6) → routing-fairness intervention or cut to fewer partners.

**Pre-launch validation:** The 8% try-on→booking conversion is sourced from generic AR-try-on lift data (Perfect Corp/Shopify, 2.5–3x), not from a brand-neutral, deep-link-routed funnel. Run a Wizard-of-Oz prototype with 50–100 Sally Rewards beta users in weeks 12–14 to measure actual end-to-end conversion. If it comes in at 4–5%, reset the WAU target.

## V1 Scope (16 weeks · 1 PM + 6 eng + 1 designer + 1 BD + 1 editorial)

**In:** photo upload flow · color-first browse (~30 curated colors) · off-the-shelf SDK render · per-color brand list with ratings · 90-day fade simulator · multi-lighting toggle (3 presets) · salon discovery + profile · deep-link booking handoff · share-this-look button (single tap, generates a shareable render with salon-routing link embedded) · reviews ingested from Google Places (color-tagged subset only, classified by LLM) + 5 partner brand feeds (segregated into a labeled "brand-published" tab — never blended into headline rankings) · post-booking review request via SMS at +24h, email at +7d, in-app banner · transparent source-attribution labels · web + responsive mobile (single codebase) · privacy-compliant photo handling.

**Out (V2+):** live camera mode · pre-event try-on (calendar) · bestie social vote · in-app booking · geofence triggers · seasonal palette / root growth / regrowth previews · brand-site review scraping (legal gray) · stylist seed reviews · attribution analytics dashboards · in-store kiosks · native iOS/Android apps.

The cut is aggressive on purpose. Bias-to-ship. We deploy fast, get real users, iterate on signal — not on speculation.

**V1.5+ expansion lanes** (not V1 scope, but the team should know where this goes):

- **Color correction wedge.** "I tried box-dye and it went green" — highest-stakes, highest-margin salon service. Triaging panic-bookers to certified corrective colorists is a use case competitors literally cannot serve at our scale. Natural fit for V1.5.
- **Men's color and gray-blending.** Fastest-growing sub-segment, near-zero AR competition, converts on confidence/age. 5-8 men's shades + a gray-blend % slider doubles addressable users with marginal scope cost.
- **BNPL at booking handoff** (Affirm / Afterpay / Klarna). Color services are $150-400 — exactly the BNPL conversion sweet spot. Lifts the most important success metric without adding consumer-side cost.
- **Beauty school partnerships** (Aveda Institute, Paul Mitchell, Empire Education). Solves salon-side cold-start, fills the texture-diversity metric, and builds a 5-10 year BSG B2B pipeline with stylists who pick their first distributor on the platform.

## Why Now

**Defensive trigger.** TikTok hair filters, ModiFace-powered L'Oréal apps, and Madison Reed's own funnel are eating top-of-funnel discovery in our category. Sally's existing app presence and Sally Beauty Supply ecommerce don't have a meaningful try-on layer. Without one, we keep losing the consideration moment to platforms that will never route the consumer back to our salons or our shelves.

**Offensive opening.** AR rendering crossed the "good enough" threshold in 2023-2024 — meaning the previously expensive part of this product is now licensable as commodity. AR try-on integrations show 2.5–3x conversion lift (Perfect Corp / Shopify case data, 2023-2024). Salon-side willingness-to-pay for digital lead-gen is established (Booksy, Fresha, and StyleSeat all raised growth rounds in 2023-2024). And the consumer trend toward considered, salon-routed color is moving in our direction. The structural advantages are converging at the moment our competitive position is most exposed. **Now is the window.**

## Vision (2-3 Years)

If V1 hits its numbers, the company-defining play is to become **the data layer for hair color outcomes industry-wide** — the canonical place where brands compete on real customer results, salons compete on color-specific reputation, and consumers research before they commit. *"Yelp-for-color-outcomes"* is the consumer-facing framing; the underlying asset is a queryable outcome dataset that nobody else can build because nobody else owns both supply and demand sides of the funnel.

A more conservative read of success: even if the data layer story doesn't compound the way we hope, V1 still produces a high-conversion customer acquisition channel into Sally's salon partner network and a defensive moat against single-brand try-ons. **Both framings are real. The team should know both.**

## Week-0 Gates and Open Questions

Several items are not "open questions" — they're **pre-conditions** with named owners and gate dates. The build does not advance past week 2 without these locked.

| # | Pre-condition | Owner | Gate |
|---|---|---|---|
| 1 | BIPA / CUBI / GDPR stance: on-device processing OR server-side with explicit consent + 30-day deletion. Signed DPA with SDK vendor. Estée Lauder and Louis Vuitton settled selfie-app class actions in 2023-2024 — concrete, not theoretical. | Legal + eng | Week 2 |
| 2 | SDK selection: Perfect Corp (likely starting point given existing Sally integrations) evaluated against ModiFace and Banuba on Type 4 hair performance, with the 90-day fade and 3-preset lighting feasibility spike completed. | Eng | Week 2 |
| 3 | Pre-launch supply: 5 brand LOIs + 10 salon LOIs (concentrated in 2-3 DFW sub-zones, not scattered). BSG sales reps run point on salon outreach — they're already in those rooms weekly. | BD | Week 6 |
| 4 | Color taxonomy: an editorial curator named and onboarded; 30 V1 colors curated by **intersection-of-coverage rule** (≥3 brands per color) so the "compare brands" promise is never silently broken. | Editorial | Week 0 hire, week 4 deliverable |
| 5 | Public Review Integrity Policy: 1-page, externally published. No takedowns except for ToS violations. No ranking adjustments by brand request. Brands can reply but not delete. Reviews persist post-contract-termination. **This is the moat — it must be public before launch.** | Product + legal + leadership | Week 8 publish |
| 6 | Sally-owned brand neutrality: Sally's private-label and BSG-exclusive brands appear (or don't) on the platform under identical ranking rules. Decide and document in the brand-partner contract before any contract is signed — the press will find this within 6 months either way. | Leadership | Week 4 |

**Genuinely open questions** (decisions to make, not yet defaults):

1. **Launch geography (final).** DFW recommended for the reasons above; Atlanta is the strong alternative if Sally's textured-hair customer density indexes higher there. **PM + BD to confirm by week 2.**
2. **GTM channel mix (final).** Recommendation: lean entirely on Sally-owned channels for V1 — Sally Rewards email/SMS in DFW (size the addressable list before commit), in-store retail signage and QR codes on color aisles, BSG salon-partner promotion. No paid social or influencer until retention is proven. The salons promoting it to their clients is the most defensible demand-acquisition channel we have. **Marketing + BD to confirm.**
3. **Pricing for paid sides.** Out of scope for this brief, but BD/finance owe a pricing memo by week 4 — engineering needs it locked by week 8 to avoid retrofits on rankings, billing, and attribution surfaces.

The remaining items from the brainstorming session's 8-item de-risk list (Google Places API cost ceiling, source-attribution UX, paid-placement format) all have known mitigations and live in the implementation backlog.

---

*Foundation: brainstorming session 2026-05-02 (20 ideas across 6 dimensions, V1 locked at 13 features). Web research: competitive landscape (Perfect Corp, ModiFace, Madison Reed, eSalon, Snap AR), market sizing (US hair color $2.1B, salon services $69B, AR conversion lift 2.5–3x), regulatory context (BIPA / CUBI / GDPR class action precedents 2023-2024).*
