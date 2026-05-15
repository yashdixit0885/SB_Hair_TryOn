// Consent state machine (FR46 + cross-cutting concern #2 — biometric privacy).
// Pure module — no React, no Zustand, no DOM. The Zustand store at
// `src/lib/stores/consent.ts` calls `transition()` before mutating its state
// and `buildConsentRecord()` to construct the audit record POSTed to
// `/api/consent/grant`. Defining the rules separately from the store keeps
// them unit-testable as a table without spinning up React or fake timers.

export type ConsentStatus =
  | "not-consented"
  | "consented-local"
  | "consented-saved"
  | "declined";

// Bump when the consent copy in `src/lib/copy/consent.ts` is materially
// updated. Stored on every granted ConsentRecord so an audit can replay
// which version of the copy the user actually saw.
export const CONSENT_COPY_VERSION = "2026-05-14.v1";

// The Zod schema in `src/lib/schemas/consent.ts` is the source of truth for
// the `ConsentRecord` shape; this module re-exports the inferred type so
// security/state-machine callers don't need to know about Zod.
import type { ConsentRecord } from "@/lib/schemas/consent";
export type { ConsentRecord };

// The only legal transitions. Any other `from → to` pair throws
// `ConsentInvariantError` from `transition()`. Notice: from any of the
// terminal statuses (consented-local / consented-saved / declined) the only
// legal next step is `not-consented` — the "no implicit re-consent"
// invariant from FR46 expressed as a transition table.
export const LEGAL_TRANSITIONS: Record<ConsentStatus, ConsentStatus[]> = {
  "not-consented": ["consented-local", "consented-saved", "declined"],
  "consented-local": ["not-consented"],
  "consented-saved": ["not-consented"],
  "declined": ["not-consented"],
};

export class ConsentInvariantError extends Error {
  constructor(
    public readonly from: ConsentStatus,
    public readonly to: ConsentStatus,
  ) {
    super(`Illegal consent transition: ${from} → ${to}`);
    this.name = "ConsentInvariantError";
  }
}

export function transition(from: ConsentStatus, to: ConsentStatus): ConsentStatus {
  const allowed = LEGAL_TRANSITIONS[from];
  if (!allowed || !allowed.includes(to)) {
    throw new ConsentInvariantError(from, to);
  }
  return to;
}

// Pure: callers supply `now` and `sessionId` so the function stays testable
// (no `Date.now()` or `crypto.randomUUID()` inside).
export function buildConsentRecord(args: {
  status: Exclude<ConsentStatus, "not-consented">;
  now: string;
  sessionId: string;
}): ConsentRecord {
  return {
    status: args.status,
    grantedAt: args.now,
    consentVersion: CONSENT_COPY_VERSION,
    sessionId: args.sessionId,
  };
}
