import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const validRecord = {
  status: "consented-local" as const,
  grantedAt: "2026-05-14T12:00:00.000Z",
  consentVersion: "2026-05-14.v1",
  sessionId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
};

function jsonRequest(body: unknown): Request {
  return new Request("http://localhost/api/consent/grant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

let consoleSpy: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});
});
afterEach(() => {
  consoleSpy.mockRestore();
});

describe("POST /api/consent/grant", () => {
  it("accepts a valid ConsentRecord and returns 201 echoing the record", async () => {
    const res = await POST(jsonRequest(validRecord));
    expect(res.status).toBe(201);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body).toEqual(validRecord);
    const grantLog = (consoleSpy.mock.calls as unknown[][]).find(
      (c) => typeof c[0] === "string" && (c[0] as string).startsWith("[consent.grant]"),
    );
    expect(grantLog).toBeDefined();
  });

  it("rejects missing status with 422 + VALIDATION_FAILED envelope", async () => {
    const { status: _status, ...rest } = validRecord;
    const res = await POST(jsonRequest(rest));
    expect(res.status).toBe(422);
    const body = (await res.json()) as { error: { code: string; details?: { field?: string } } };
    expect(body.error.code).toBe("VALIDATION_FAILED");
    expect(body.error.details?.field).toContain("status");
  });

  it("rejects non-ISO-8601 grantedAt with 422", async () => {
    const res = await POST(
      jsonRequest({ ...validRecord, grantedAt: "yesterday" }),
    );
    expect(res.status).toBe(422);
    const body = (await res.json()) as { error: { code: string } };
    expect(body.error.code).toBe("VALIDATION_FAILED");
  });

  it("rejects status='not-consented' (excluded by schema)", async () => {
    const res = await POST(jsonRequest({ ...validRecord, status: "not-consented" }));
    expect(res.status).toBe(422);
    const body = (await res.json()) as { error: { code: string } };
    expect(body.error.code).toBe("VALIDATION_FAILED");
  });

  it("rejects malformed JSON with 422 + INVALID_JSON envelope", async () => {
    const badRequest = new Request("http://localhost/api/consent/grant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{not-json",
    });
    const res = await POST(badRequest);
    expect(res.status).toBe(422);
    const body = (await res.json()) as { error: { code: string } };
    expect(body.error.code).toBe("INVALID_JSON");
  });
});
