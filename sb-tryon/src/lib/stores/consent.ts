// Zustand consent store. The runtime carrier of the consent state machine
// from `src/lib/security/consent-state.ts`. AGENTS.md §5 — imperative-verb
// actions, direct field selectors. Stays small (4 fields + 4 actions).
//
// The photo Blob itself NEVER lives here (AGENTS.md §1 #2). The store holds
// `consentStatus`, `lastPromptedAt`, `consentVersion`, and an opaque
// `sessionId` only — every other piece of biometric data is held in
// component refs that get revoked on dispose.

import { create } from "zustand";

import {
  buildConsentRecord,
  CONSENT_COPY_VERSION,
  transition,
  type ConsentStatus,
} from "@/lib/security/consent-state";
import { track } from "@/lib/observability/track";

export interface ConsentStore {
  consentStatus: ConsentStatus;
  lastPromptedAt: string | null;
  consentVersion: string;
  sessionId: string;

  promptShown: () => void;
  grant: (scope: "local" | "saved") => Promise<void>;
  decline: () => Promise<void>;
  reset: () => void;
}

function nowIso(): string {
  return new Date().toISOString();
}

function newSessionId(): string {
  return crypto.randomUUID();
}

export const useConsentStore = create<ConsentStore>((set, get) => ({
  consentStatus: "not-consented",
  lastPromptedAt: null,
  consentVersion: CONSENT_COPY_VERSION,
  sessionId: "",

  promptShown() {
    const current = get();
    set({
      lastPromptedAt: nowIso(),
      sessionId: current.sessionId === "" ? newSessionId() : current.sessionId,
    });
  },

  async grant(scope) {
    const current = get();
    const target: ConsentStatus =
      scope === "local" ? "consented-local" : "consented-saved";
    // Throws ConsentInvariantError on illegal transition (FR46 — caller must
    // reset() first if a prior consent was already granted).
    transition(current.consentStatus, target);
    const sessionId =
      current.sessionId === "" ? newSessionId() : current.sessionId;
    const record = buildConsentRecord({
      status: target,
      now: nowIso(),
      sessionId,
    });
    // Update state synchronously before the network round-trip so concurrent
    // grant() calls see the new status and fail transition() rather than both
    // sneaking through while the fetch is in-flight (TOCTOU fix).
    set({ consentStatus: target, consentVersion: CONSENT_COPY_VERSION, sessionId });
    // Best-effort audit log POST (Demo V1). Failure is logged via console.error
    // but does NOT block the UI. Story 8.2 hardens to a queued write.
    await fetch("/api/consent/grant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    }).then((res) => {
      if (!res.ok) console.error("[consent] audit POST failed", res.status);
    }).catch((err: unknown) => {
      console.error("[consent] fetch failed", err);
    });
    track({ name: "consent.granted", scope, sessionId });
  },

  async decline() {
    const current = get();
    transition(current.consentStatus, "declined");
    const sessionId =
      current.sessionId === "" ? newSessionId() : current.sessionId;
    track({ name: "consent.declined", sessionId });
    set({ consentStatus: "declined", sessionId });
  },

  reset() {
    const current = get();
    if (current.consentStatus === "not-consented") return; // idempotent
    transition(current.consentStatus, "not-consented");
    // sessionId + lastPromptedAt are preserved — they identify the
    // *browser session*, not the upload cycle. Clearing them would break
    // the multi-upload audit trail (FR46 audit log correlates re-prompts
    // back to the same session).
    set({ consentStatus: "not-consented" });
  },
}));
