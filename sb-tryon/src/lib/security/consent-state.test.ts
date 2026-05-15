import { describe, expect, it } from "vitest";
import {
  buildConsentRecord,
  CONSENT_COPY_VERSION,
  ConsentInvariantError,
  LEGAL_TRANSITIONS,
  transition,
  type ConsentStatus,
} from "./consent-state";

const ALL_STATUSES: ConsentStatus[] = [
  "not-consented",
  "consented-local",
  "consented-saved",
  "declined",
];

describe("transition() — legal transitions", () => {
  const legalPairs: Array<[ConsentStatus, ConsentStatus]> = [];
  for (const from of ALL_STATUSES) {
    for (const to of LEGAL_TRANSITIONS[from]) {
      legalPairs.push([from, to]);
    }
  }

  it.each(legalPairs)("allows %s → %s", (from, to) => {
    expect(transition(from, to)).toBe(to);
  });
});

describe("transition() — illegal transitions throw ConsentInvariantError", () => {
  const illegalPairs: Array<[ConsentStatus, ConsentStatus]> = [];
  for (const from of ALL_STATUSES) {
    for (const to of ALL_STATUSES) {
      if (from === to) continue;
      if (LEGAL_TRANSITIONS[from].includes(to)) continue;
      illegalPairs.push([from, to]);
    }
  }

  it.each(illegalPairs)("rejects %s → %s", (from, to) => {
    let caught: unknown;
    try {
      transition(from, to);
    } catch (e) {
      caught = e;
    }
    expect(caught).toBeInstanceOf(ConsentInvariantError);
    const err = caught as ConsentInvariantError;
    expect(err.from).toBe(from);
    expect(err.to).toBe(to);
    expect(err.name).toBe("ConsentInvariantError");
  });

  it("FR46 invariant: cannot re-consent from a granted state without intermediate reset", () => {
    expect(() => transition("consented-local", "consented-saved")).toThrow(
      ConsentInvariantError,
    );
    expect(() => transition("consented-saved", "consented-local")).toThrow(
      ConsentInvariantError,
    );
  });
});

describe("buildConsentRecord()", () => {
  it("returns the exact shape with consentVersion stamped from the module constant", () => {
    const record = buildConsentRecord({
      status: "consented-local",
      now: "2026-05-14T12:00:00.000Z",
      sessionId: "abc",
    });
    expect(record).toEqual({
      status: "consented-local",
      grantedAt: "2026-05-14T12:00:00.000Z",
      consentVersion: CONSENT_COPY_VERSION,
      sessionId: "abc",
    });
  });

  it("is pure — same args yield deep-equal records (no internal randomness or clock)", () => {
    const args = {
      status: "consented-saved" as const,
      now: "2026-05-14T12:00:00.000Z",
      sessionId: "session-xyz",
    };
    const a = buildConsentRecord(args);
    const b = buildConsentRecord(args);
    expect(a).toEqual(b);
    expect(a).not.toBe(b); // distinct objects, equal shape
  });
});
