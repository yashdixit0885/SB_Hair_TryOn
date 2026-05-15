// Zod schema for the consent audit record. Source of truth for the
// `ConsentRecord` TypeScript type — `src/lib/security/consent-state.ts`
// re-exports the inferred type. The Route Handler at
// `src/app/api/consent/grant/route.ts` validates incoming bodies against
// this schema (AGENTS.md §4 — 422 on validation failure).
//
// Story 8.2 will write to a real audit-log table; the schema must remain
// stable across that swap so the wire format does not break.

import { z } from "zod";

// ISO-8601 UTC with millisecond precision, e.g. "2026-05-14T12:00:00.000Z".
// Matches `new Date().toISOString()` exactly so the round-trip test passes.
const ISO_8601_REGEX =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

export const consentRecordSchema = z.object({
  status: z.union([z.literal("consented-local"), z.literal("consented-saved"), z.literal("declined")]),
  grantedAt: z.string().regex(ISO_8601_REGEX, "grantedAt must be ISO-8601 UTC"),
  consentVersion: z.string().min(1),
  sessionId: z.string().regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    "sessionId must be a UUID",
  ),
});

export type ConsentRecord = z.infer<typeof consentRecordSchema>;
