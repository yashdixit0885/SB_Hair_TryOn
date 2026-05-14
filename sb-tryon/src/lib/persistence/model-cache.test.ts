// Exercises the IndexedDB cache via fake-indexeddb (registered in
// vitest.setup.ts). `fetch` is mocked so the test never touches the network.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import {
  clearCachedHairSegmentationModel,
  getCachedHairSegmentationModel,
} from "./model-cache";

// JSDOM's URL doesn't track createObjectURL with bytes — patch it to return
// a deterministic string so we can assert call shape without touching the
// blob contents.
const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;

beforeEach(() => {
  // Fresh in-memory IndexedDB per test so we get clean cache-miss → cache-hit
  // behavior without leakage across tests.
  globalThis.indexedDB = new IDBFactory();
  URL.createObjectURL = () => "blob:mock-url";
  URL.revokeObjectURL = () => {};
});

afterEach(() => {
  URL.createObjectURL = originalCreateObjectURL;
  URL.revokeObjectURL = originalRevokeObjectURL;
  vi.restoreAllMocks();
});

function mockFetchOnce() {
  // Use mockImplementation so each call gets a fresh Response (Response
  // bodies are one-shot streams).
  return vi
    .spyOn(globalThis, "fetch")
    .mockImplementation(async () =>
      new Response(new Uint8Array([1, 2, 3, 4]).buffer, { status: 200 }),
    );
}

describe("getCachedHairSegmentationModel", () => {
  it("first call hits fetch; second call does not", async () => {
    const fetchSpy = mockFetchOnce();

    const first = await getCachedHairSegmentationModel();
    expect(typeof first).toBe("string");
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    const second = await getCachedHairSegmentationModel();
    expect(typeof second).toBe("string");
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("returns a string URL (blob:* or otherwise truthy)", async () => {
    mockFetchOnce();
    const url = await getCachedHairSegmentationModel();
    expect(url.length).toBeGreaterThan(0);
  });

  it("throws when the upstream fetch fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("nope", { status: 500, statusText: "Server Error" }),
    );
    await expect(getCachedHairSegmentationModel()).rejects.toThrow(
      /Failed to fetch hair model/,
    );
  });
});

describe("getCachedHairSegmentationModel — quota / persistence failure", () => {
  it("returns a Blob URL even when IndexedDB persist fails (quota exceeded)", async () => {
    mockFetchOnce();
    // Sabotage IDBObjectStore.put so the write rejects after the fetch.
    const originalTransaction = IDBDatabase.prototype.transaction;
    IDBDatabase.prototype.transaction = function (storeNames, mode) {
      const tx = originalTransaction.call(this, storeNames, mode);
      if (mode === "readwrite") {
        const originalObjectStore = tx.objectStore.bind(tx);
        tx.objectStore = (name: string) => {
          const store = originalObjectStore(name);
          const originalPut = store.put.bind(store);
          store.put = (...args: Parameters<IDBObjectStore["put"]>) => {
            const req = originalPut(...args);
            // Fire onerror on next microtask
            setTimeout(() => {
              Object.defineProperty(req, "error", {
                value: new DOMException("QuotaExceededError", "QuotaExceededError"),
              });
              if (req.onerror) req.onerror(new Event("error"));
            }, 0);
            return req;
          };
          return store;
        };
      }
      return tx;
    };
    try {
      const url = await getCachedHairSegmentationModel();
      expect(typeof url).toBe("string");
      expect(url.length).toBeGreaterThan(0);
    } finally {
      IDBDatabase.prototype.transaction = originalTransaction;
    }
  });
});

describe("clearCachedHairSegmentationModel", () => {
  it("clears the cache so the next call re-fetches", async () => {
    const fetchSpy = mockFetchOnce();
    await getCachedHairSegmentationModel();
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    await clearCachedHairSegmentationModel();
    await getCachedHairSegmentationModel();
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("is a no-op when the cache is empty", async () => {
    await expect(clearCachedHairSegmentationModel()).resolves.toBeUndefined();
  });
});
