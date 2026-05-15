import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/observability/track", () => ({
  track: vi.fn(),
}));

import { track } from "@/lib/observability/track";
import { CONSENT_COPY_VERSION, ConsentInvariantError } from "@/lib/security/consent-state";
import { useConsentStore } from "./consent";

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function resetStore() {
  useConsentStore.setState({
    consentStatus: "not-consented",
    lastPromptedAt: null,
    sessionId: "",
    consentVersion: CONSENT_COPY_VERSION,
  });
}

const fetchSpy = vi
  .spyOn(globalThis, "fetch")
  .mockResolvedValue(new Response(null, { status: 201 }));

beforeEach(() => {
  resetStore();
  (track as unknown as ReturnType<typeof vi.fn>).mockClear();
  fetchSpy.mockClear();
  fetchSpy.mockResolvedValue(new Response(null, { status: 201 }));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useConsentStore — initial state", () => {
  it("matches the documented defaults", () => {
    const s = useConsentStore.getState();
    expect(s.consentStatus).toBe("not-consented");
    expect(s.lastPromptedAt).toBeNull();
    expect(s.consentVersion).toBe("2026-05-14.v1");
    expect(s.sessionId).toBe("");
  });
});

describe("useConsentStore.promptShown", () => {
  it("lazily creates a UUID v4 sessionId and stamps lastPromptedAt", () => {
    useConsentStore.getState().promptShown();
    const s = useConsentStore.getState();
    expect(s.sessionId).toMatch(UUID_V4_REGEX);
    expect(typeof s.lastPromptedAt).toBe("string");
    expect(s.lastPromptedAt).toMatch(/Z$/); // ISO-8601 UTC
  });

  it("preserves an existing sessionId on subsequent prompts", () => {
    useConsentStore.getState().promptShown();
    const firstId = useConsentStore.getState().sessionId;
    useConsentStore.getState().promptShown();
    expect(useConsentStore.getState().sessionId).toBe(firstId);
  });
});

describe("useConsentStore.grant", () => {
  it("transitions not-consented → consented-local + POSTs a ConsentRecord + tracks consent.granted", async () => {
    useConsentStore.getState().promptShown();
    const sid = useConsentStore.getState().sessionId;
    await useConsentStore.getState().grant("local");
    expect(useConsentStore.getState().consentStatus).toBe("consented-local");

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/consent/grant");
    expect(init.method).toBe("POST");
    const body = JSON.parse(init.body as string) as Record<string, unknown>;
    expect(body).toMatchObject({
      status: "consented-local",
      sessionId: sid,
      consentVersion: "2026-05-14.v1",
    });
    expect(typeof body.grantedAt).toBe("string");

    expect(track).toHaveBeenCalledTimes(1);
    const call = (track as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(call).toEqual({
      name: "consent.granted",
      scope: "local",
      sessionId: sid,
    });
  });

  it("transitions not-consented → consented-saved with scope='saved'", async () => {
    useConsentStore.getState().promptShown();
    await useConsentStore.getState().grant("saved");
    expect(useConsentStore.getState().consentStatus).toBe("consented-saved");
    const body = JSON.parse(
      (fetchSpy.mock.calls[0][1] as RequestInit).body as string,
    ) as Record<string, unknown>;
    expect(body.status).toBe("consented-saved");
  });

  it("FR46 invariant: throws ConsentInvariantError when re-granting without reset", async () => {
    useConsentStore.getState().promptShown();
    await useConsentStore.getState().grant("local");
    await expect(useConsentStore.getState().grant("saved")).rejects.toBeInstanceOf(
      ConsentInvariantError,
    );
  });

  it("continues to update local state even when /api/consent/grant rejects (best-effort)", async () => {
    fetchSpy.mockRejectedValueOnce(new Error("offline"));
    const consoleErrSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    useConsentStore.getState().promptShown();
    await useConsentStore.getState().grant("local");
    expect(useConsentStore.getState().consentStatus).toBe("consented-local");
    expect(consoleErrSpy).toHaveBeenCalled();
    consoleErrSpy.mockRestore();
  });

  it("logs console.error when audit POST returns a non-ok HTTP status", async () => {
    fetchSpy.mockResolvedValueOnce(new Response(null, { status: 422 }));
    const consoleErrSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    useConsentStore.getState().promptShown();
    await useConsentStore.getState().grant("local");
    expect(useConsentStore.getState().consentStatus).toBe("consented-local");
    expect(consoleErrSpy).toHaveBeenCalledWith("[consent] audit POST failed", 422);
    consoleErrSpy.mockRestore();
  });

  it("lazily allocates a sessionId on grant when promptShown was skipped", async () => {
    await useConsentStore.getState().grant("local");
    expect(useConsentStore.getState().sessionId).toMatch(UUID_V4_REGEX);
  });

  it("telemetry payload contains NO biometric or photo-derived keys (AC13)", async () => {
    useConsentStore.getState().promptShown();
    await useConsentStore.getState().grant("local");
    const call = (track as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0];
    for (const key of [
      "photo",
      "blob",
      "file",
      "fileName",
      "imageBitmap",
      "bytes",
      "hash",
    ]) {
      expect(call).not.toHaveProperty(key);
    }
    expect(call).toEqual(
      expect.objectContaining({
        name: "consent.granted",
        scope: "local",
        sessionId: expect.stringMatching(UUID_V4_REGEX),
      }),
    );
  });
});

describe("useConsentStore.decline", () => {
  it("transitions not-consented → declined, does NOT POST, tracks consent.declined", async () => {
    useConsentStore.getState().promptShown();
    const sid = useConsentStore.getState().sessionId;
    await useConsentStore.getState().decline();
    expect(useConsentStore.getState().consentStatus).toBe("declined");
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(track).toHaveBeenCalledWith({
      name: "consent.declined",
      sessionId: sid,
    });
  });
});

describe("useConsentStore.reset", () => {
  it("resets consentStatus to not-consented from any terminal status", async () => {
    useConsentStore.getState().promptShown();
    await useConsentStore.getState().grant("local");
    useConsentStore.getState().reset();
    expect(useConsentStore.getState().consentStatus).toBe("not-consented");
  });

  it("preserves sessionId across reset (audit-trail invariant)", async () => {
    useConsentStore.getState().promptShown();
    const sid = useConsentStore.getState().sessionId;
    await useConsentStore.getState().grant("saved");
    useConsentStore.getState().reset();
    expect(useConsentStore.getState().sessionId).toBe(sid);
  });

  it("preserves lastPromptedAt across reset", () => {
    useConsentStore.getState().promptShown();
    const ts = useConsentStore.getState().lastPromptedAt;
    useConsentStore.getState().reset();
    expect(useConsentStore.getState().lastPromptedAt).toBe(ts);
  });

  it("allows a fresh grant after reset (the FR46 re-prompt path)", async () => {
    useConsentStore.getState().promptShown();
    await useConsentStore.getState().grant("local");
    useConsentStore.getState().reset();
    await useConsentStore.getState().grant("saved");
    expect(useConsentStore.getState().consentStatus).toBe("consented-saved");
  });
});
