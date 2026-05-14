import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { ProviderError, createMockProviders, createProviders } from "@/lib/providers";
import type { Providers } from "@/lib/providers";

const REQUIRED_KEYS = [
  "ar",
  "reviews",
  "auth",
  "attribution",
  "notification",
  "bookingHandoff",
  "salon",
  "bsg",
  "calendar",
  "editorial",
] as const satisfies ReadonlyArray<keyof Providers>;

// Method names each provider stub must expose. The contract test asserts
// they're functions even on the stub — so a future story that swaps the
// stub for a real impl can't accidentally drop a method without lighting
// up this test.
const METHOD_SHAPE: { [K in keyof Providers]: ReadonlyArray<string> } = {
  ar: ["prewarm", "segment", "dispose"],
  reviews: ["list", "get", "submit", "reply", "getRanking"],
  auth: ["getCurrentUser", "login", "logout", "requireRole"],
  attribution: [
    "issueToken",
    "verifyToken",
    "getAttributionForPartner",
    "getAttributedBookingsForStylist",
    "getColorChoiceAnalytics",
  ],
  notification: ["schedule", "send"],
  bookingHandoff: ["handoff"],
  salon: ["search", "getSalonBySlug", "getStylists", "getCertifications"],
  bsg: ["suggestReorder", "getProductInfo"],
  calendar: ["createInvite"],
  editorial: [
    "getColorTaxonomy",
    "getColorBySlug",
    "getBrands",
    "getBrandColorMappings",
    "getSpecialtyTierFlag",
    "getAuditLog",
    "getClassificationQueue",
    "getClassificationQuality",
    "createColor",
    "updateColor",
    "deactivateColor",
    "setSpecialtyTier",
    "createBrandColorMapping",
    "updateBrandColorMapping",
    "classifyReview",
  ],
};

// One callable per stub method — passes plausible no-op args so the stub
// reaches its NOT_IMPLEMENTED throw. Centralized here so the same map drives
// shape-checks AND contract-call assertions, and any future contract
// expansion forces a corresponding entry here.
type Invokers = { [K in keyof Providers]: { [M: string]: (p: Providers[K]) => Promise<unknown> } };
const INVOKE: Invokers = {
  ar: {
    prewarm: (p) => p.prewarm(),
    segment: (p) => p.segment({} as ImageBitmap),
    dispose: (p) => p.dispose(),
  },
  reviews: {
    list: (p) => p.list({}),
    get: (p) => p.get("r1"),
    submit: (p) =>
      p.submit({ colorSlug: "auburn", brandId: "wella", body: "x", outcomeDimensions: {} }),
    reply: (p) => p.reply("r1", "x"),
    getRanking: (p) => p.getRanking("auburn"),
  },
  auth: {
    getCurrentUser: (p) => p.getCurrentUser(),
    login: (p) => p.login(),
    logout: (p) => p.logout(),
    requireRole: (p) => p.requireRole("Consumer"),
  },
  attribution: {
    issueToken: (p) =>
      p.issueToken({
        lookId: "l1",
        colorSlug: "auburn",
        lighting: "indoor",
        brandId: "wella",
        salonId: "s1",
      }),
    verifyToken: (p) => p.verifyToken("t"),
    getAttributionForPartner: (p) =>
      p.getAttributionForPartner("p1", { from: "2026-01-01", to: "2026-12-31" }),
    getAttributedBookingsForStylist: (p) =>
      p.getAttributedBookingsForStylist("st1", { from: "2026-01-01", to: "2026-12-31" }),
    getColorChoiceAnalytics: (p) =>
      p.getColorChoiceAnalytics("p1", { from: "2026-01-01", to: "2026-12-31" }),
  },
  notification: {
    schedule: (p) => p.schedule({ type: "post-booking", bookingId: "b1", channels: ["sms-24h"] }),
    send: (p) =>
      p.send("in-app-banner", { recipientId: "u1", templateId: "t1", data: {} }),
  },
  bookingHandoff: {
    handoff: (p) => p.handoff({ salonId: "s1", lookId: "l1", token: "t" }),
  },
  salon: {
    search: (p) => p.search({}),
    getSalonBySlug: (p) => p.getSalonBySlug("crown-and-coil"),
    getStylists: (p) => p.getStylists("crown-and-coil"),
    getCertifications: (p) => p.getCertifications("crown-and-coil"),
  },
  bsg: {
    suggestReorder: (p) => p.suggestReorder("s1"),
    getProductInfo: (p) => p.getProductInfo("p1"),
  },
  calendar: {
    createInvite: (p) =>
      p.createInvite({ title: "Hair appointment", startAt: "2026-06-01T10:00:00Z", durationMinutes: 90 }),
  },
  editorial: {
    getColorTaxonomy: (p) => p.getColorTaxonomy(),
    getColorBySlug: (p) => p.getColorBySlug("auburn"),
    getBrands: (p) => p.getBrands(),
    getBrandColorMappings: (p) => p.getBrandColorMappings(),
    getSpecialtyTierFlag: (p) => p.getSpecialtyTierFlag("auburn"),
    getAuditLog: (p) => p.getAuditLog("color", "auburn"),
    getClassificationQueue: (p) => p.getClassificationQueue({}),
    getClassificationQuality: (p) => p.getClassificationQuality(),
    createColor: (p) =>
      p.createColor({
        slug: "auburn",
        displayName: "Auburn",
        family: "red",
        undertone: "warm",
        isSpecialtyTier: false,
      }),
    updateColor: (p) => p.updateColor("auburn", {}),
    deactivateColor: (p) => p.deactivateColor("auburn", "test"),
    setSpecialtyTier: (p) => p.setSpecialtyTier("auburn", true),
    createBrandColorMapping: (p) =>
      p.createBrandColorMapping({ brandId: "wella", colorSlug: "auburn", skuCode: "W-1" }),
    updateBrandColorMapping: (p) => p.updateBrandColorMapping("m1", {}),
    classifyReview: (p) => p.classifyReview("r1", "accept"),
  },
};

describe("provider factory", () => {
  describe("createProviders()", () => {
    const providers = createProviders();

    it("returns an object with all 10 required keys", () => {
      for (const key of REQUIRED_KEYS) {
        expect(providers).toHaveProperty(key);
        expect(providers[key]).not.toBeNull();
        expect(providers[key]).not.toBeUndefined();
      }
    });

    it("returns providers with the expected method shape", () => {
      for (const key of REQUIRED_KEYS) {
        const slot = providers[key] as unknown as Record<string, unknown>;
        for (const method of METHOD_SHAPE[key]) {
          expect(typeof slot[method]).toBe("function");
        }
      }
    });
  });

  describe("createMockProviders()", () => {
    it("returns the same shape as createProviders()", () => {
      const mocks = createMockProviders();
      for (const key of REQUIRED_KEYS) {
        expect(mocks).toHaveProperty(key);
        const slot = mocks[key] as unknown as Record<string, unknown>;
        for (const method of METHOD_SHAPE[key]) {
          expect(typeof slot[method]).toBe("function");
        }
      }
    });

    describe("env-var independence", () => {
      const original = process.env.NEXT_PUBLIC_PROVIDER_MODE;

      beforeEach(() => {
        process.env.NEXT_PUBLIC_PROVIDER_MODE = "production";
      });
      afterEach(() => {
        if (original === undefined) delete process.env.NEXT_PUBLIC_PROVIDER_MODE;
        else process.env.NEXT_PUBLIC_PROVIDER_MODE = original;
      });

      it("returns mock instances even when NEXT_PUBLIC_PROVIDER_MODE=production", () => {
        const mocks = createMockProviders();
        expect(mocks.ar).not.toBeNull();
        expect(typeof mocks.ar.prewarm).toBe("function");
      });
    });

    describe("env-var override per provider slot", () => {
      const originalSlot = process.env.NEXT_PUBLIC_AR_PROVIDER;
      const originalGlobal = process.env.NEXT_PUBLIC_PROVIDER_MODE;

      afterEach(() => {
        if (originalSlot === undefined) delete process.env.NEXT_PUBLIC_AR_PROVIDER;
        else process.env.NEXT_PUBLIC_AR_PROVIDER = originalSlot;
        if (originalGlobal === undefined) delete process.env.NEXT_PUBLIC_PROVIDER_MODE;
        else process.env.NEXT_PUBLIC_PROVIDER_MODE = originalGlobal;
      });

      it("accepts a per-slot override env var without crashing", () => {
        process.env.NEXT_PUBLIC_AR_PROVIDER = "mock";
        const providers = createProviders();
        expect(providers.ar).not.toBeNull();
        expect(typeof providers.ar.prewarm).toBe("function");
      });

      it("accepts production override and falls through to mock for Demo V1", () => {
        // Until production classes ship post-funding, production-mode falls through
        // to mock so a misconfigured env doesn't crash boot. This is asserted here
        // so the fallback behavior stays explicit.
        process.env.NEXT_PUBLIC_AR_PROVIDER = "production";
        const providers = createProviders();
        expect(providers.ar).not.toBeNull();
        expect(typeof providers.ar.prewarm).toBe("function");
      });

      it("ignores garbage override values and falls through to global mode", () => {
        process.env.NEXT_PUBLIC_AR_PROVIDER = "definitely-not-a-mode";
        const providers = createProviders();
        expect(providers.ar).not.toBeNull();
      });

      it("warns and falls through to mock when NEXT_PUBLIC_PROVIDER_MODE is unrecognized", () => {
        const warned: string[] = [];
        const original = console.warn;
        console.warn = (...args: unknown[]) => { warned.push(String(args[0])); };
        try {
          process.env.NEXT_PUBLIC_PROVIDER_MODE = "typo-in-env";
          const providers = createProviders();
          expect(providers.ar).not.toBeNull();
          expect(warned.some((w) => w.includes("typo-in-env"))).toBe(true);
        } finally {
          console.warn = original;
          delete process.env.NEXT_PUBLIC_PROVIDER_MODE;
        }
      });

      it("respects NEXT_PUBLIC_PROVIDER_MODE=production at the global scope", () => {
        process.env.NEXT_PUBLIC_PROVIDER_MODE = "production";
        const providers = createProviders();
        // Production branch falls through to mock impls in Demo V1 (no production
        // classes exist yet); we just confirm the call path works.
        expect(providers.ar).not.toBeNull();
        expect(typeof providers.ar.prewarm).toBe("function");
      });
    });
  });

  // Exercises every contract method on every stub. If a stub silently returns
  // undefined or doesn't throw, this catches it. Also gives downstream stories
  // (1.5, 2.1, 3.1, etc.) a forcing function: when they replace a stub with a
  // real mock, they must update or remove the corresponding NOT_IMPLEMENTED
  // assertions below.
  //
  // Slots whose stubs have been replaced by a real implementation are listed
  // in IMPLEMENTED_SLOTS and excluded from this loop. As more stubs are
  // replaced (2.1 reviews, 3.1 attribution, etc.), add their slot key here.
  const IMPLEMENTED_SLOTS = new Set<keyof Providers>(["ar"]);

  describe("every stub method throws ProviderError(NOT_IMPLEMENTED)", () => {
    const providers = createMockProviders();

    for (const slot of REQUIRED_KEYS) {
      if (IMPLEMENTED_SLOTS.has(slot)) continue;
      describe(slot, () => {
        for (const method of METHOD_SHAPE[slot]) {
          it(`${method}() rejects with NOT_IMPLEMENTED`, async () => {
            const invokers = INVOKE[slot] as Record<
              string,
              (p: Providers[typeof slot]) => Promise<unknown>
            >;
            const invoker = invokers[method];
            await expect(invoker(providers[slot])).rejects.toBeInstanceOf(ProviderError);
            await expect(invoker(providers[slot])).rejects.toMatchObject({
              code: "NOT_IMPLEMENTED",
            });
          });
        }
      });
    }
  });
});
