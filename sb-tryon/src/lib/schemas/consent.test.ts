import { describe, expect, it } from "vitest";
import { consentRecordSchema } from "./consent";

const validRecord = {
  status: "consented-local" as const,
  grantedAt: "2026-05-14T12:00:00.000Z",
  consentVersion: "2026-05-14.v1",
  sessionId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
};

describe("consentRecordSchema", () => {
  it("parses a valid record", () => {
    const parsed = consentRecordSchema.parse(validRecord);
    expect(parsed).toEqual(validRecord);
  });

  it("rejects status='not-consented' (not a record-worthy status)", () => {
    const result = consentRecordSchema.safeParse({
      ...validRecord,
      status: "not-consented",
    });
    expect(result.success).toBe(false);
  });

  it("rejects status with unknown value", () => {
    const result = consentRecordSchema.safeParse({
      ...validRecord,
      status: "granted",
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-ISO-8601 grantedAt", () => {
    const result = consentRecordSchema.safeParse({
      ...validRecord,
      grantedAt: "2026-05-14 12:00:00",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing consentVersion", () => {
    const { consentVersion: _consentVersion, ...rest } = validRecord;
    const result = consentRecordSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects empty consentVersion", () => {
    const result = consentRecordSchema.safeParse({
      ...validRecord,
      consentVersion: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing sessionId", () => {
    const { sessionId: _sessionId, ...rest } = validRecord;
    const result = consentRecordSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("accepts consented-saved + declined statuses", () => {
    expect(
      consentRecordSchema.safeParse({ ...validRecord, status: "consented-saved" })
        .success,
    ).toBe(true);
    expect(
      consentRecordSchema.safeParse({ ...validRecord, status: "declined" })
        .success,
    ).toBe(true);
  });
});
