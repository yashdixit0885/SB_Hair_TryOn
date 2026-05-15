// POST /api/consent/grant — Demo V1 stub.
// Validates the body against the canonical Zod schema and logs to
// console.info. Story 8.2 replaces this body with the real audit-log write
// against the consent_records table.
//
// AGENTS.md §3 hard rule: route files stay ≤150 lines. AGENTS.md §4 API
// format: success returns bare data; failure returns
// `{ error: { code, message, details? } }` envelope.

import { consentRecordSchema } from "@/lib/schemas/consent";

export async function POST(request: Request): Promise<Response> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json(
      {
        error: {
          code: "INVALID_JSON",
          message: "Request body could not be parsed as JSON.",
        },
      },
      { status: 422 },
    );
  }

  const parsed = consentRecordSchema.safeParse(raw);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return Response.json(
      {
        error: {
          code: "VALIDATION_FAILED",
          message:
            firstIssue?.message ?? "ConsentRecord failed schema validation.",
          details: { field: firstIssue?.path.join(".") ?? null },
        },
      },
      { status: 422 },
    );
  }

  // Demo V1: log to stdout. Production V1 (Story 8.2) writes to the
  // audit-log table. Never log fileName, photo bytes, or any biometric data
  // (AGENTS.md §1 #2) — the sessionId is the only audit-correlation identifier.
  console.info("[consent.grant]", parsed.data);

  return Response.json(parsed.data, { status: 201 });
}
