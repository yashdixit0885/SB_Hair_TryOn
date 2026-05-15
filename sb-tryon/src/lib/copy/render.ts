// Copy strings for the render surface components. Single source of truth —
// inline literals in render components are blocked by code review (AC8).
// UX-DR16 tone & voice: plain language, no marketing voice.

export const renderCopy = Object.freeze({
  confidenceBanner: Object.freeze({
    headline: "We can't confidently render this color on your hair texture",
    body: "Here's what it looks like on a Type-4 model with similar undertones",
  }),
  fadeSimulator: Object.freeze({
    freshLabel: "Fresh from salon",
    maxLabel: "90 days later",
    weekLabel: (week: number): string => `Week ${week}`,
    weekFreshLabel: "Week 0 — fresh",
    weekModerateLabel: "Week 8 — moderate fade",
    weekMaxLabel: "Week 13 — significant fade",
    liveRegion: (week: number, washLabel: string): string =>
      `Week ${week}, ${washLabel} washes per week`,
  }),
} as const);
