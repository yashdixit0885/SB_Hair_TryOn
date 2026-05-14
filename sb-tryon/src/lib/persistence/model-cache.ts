// IndexedDB cache for the MediaPipe hair-segmentation model bytes (AR5).
// First session fetches from CDN (~3MB), persists to IndexedDB; subsequent
// sessions read from storage and skip the network.
//
// Cache key is the model file basename. If a future story needs to swap
// models or invalidate on version bump, change the key — the schema gives us
// free invalidation.

const DB_NAME = "sb-tryon-cache";
const DB_VERSION = 1;
const STORE_NAME = "model-cache";
const HAIR_MODEL_KEY = "selfie_multiclass_256x256";
const HAIR_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idbGet<T>(db: IDBDatabase, key: string): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result as T | undefined);
    req.onerror = () => reject(req.error);
  });
}

function idbPut(db: IDBDatabase, key: string, value: ArrayBuffer): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(value, key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

function idbDelete(db: IDBDatabase, key: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/**
 * Returns a Blob URL for the cached hair-segmentation model. First call
 * fetches from CDN and stores bytes in IndexedDB; subsequent calls (any tab,
 * any session) read from IndexedDB and skip the network.
 *
 * Caller is responsible for `URL.revokeObjectURL(url)` on dispose.
 *
 * If IndexedDB persistence fails (quota exceeded on iOS Safari, Brave
 * fingerprinting block, etc.) the function still returns a Blob URL backed
 * by the in-memory fetch result — the session works, no caching for next
 * time. Only a hard fetch failure rejects.
 */
export async function getCachedHairSegmentationModel(): Promise<string> {
  const db = await openDb();
  try {
    const cached = await idbGet<ArrayBuffer>(db, HAIR_MODEL_KEY);
    if (cached) {
      return URL.createObjectURL(new Blob([cached]));
    }
    const response = await fetch(HAIR_MODEL_URL);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch hair model: ${response.status} ${response.statusText}`,
      );
    }
    const bytes = await response.arrayBuffer();
    // Persist for future sessions, but don't fail the current load if the
    // browser refuses to store (Safari private quota, etc.). We have the
    // bytes in memory; the user can still try on a color this session.
    try {
      await idbPut(db, HAIR_MODEL_KEY, bytes);
    } catch (err) {
      console.warn(
        "[model-cache] IndexedDB persist failed; returning in-memory blob URL only.",
        err,
      );
    }
    return URL.createObjectURL(new Blob([bytes]));
  } finally {
    db.close();
  }
}

/** Test/dev helper: clears the cached model so the next call re-fetches. */
export async function clearCachedHairSegmentationModel(): Promise<void> {
  const db = await openDb();
  try {
    await idbDelete(db, HAIR_MODEL_KEY);
  } finally {
    db.close();
  }
}
