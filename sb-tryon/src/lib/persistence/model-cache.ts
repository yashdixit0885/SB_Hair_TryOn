// IndexedDB cache for MediaPipe model bytes.
//
// First session fetches from the CDN, persists to IndexedDB; subsequent
// sessions read from storage and skip the network. Cache key is the model
// file basename — if a future story needs to swap models or invalidate on
// version bump, change the key and the schema gives us free invalidation.
//
// Story 1.5 added the hair segmentation model; Story 1.6 adds the face
// landmarker. Both delegate to `getCachedModel(opts)`. The shared `openDb`
// helper guarantees both models share one DB connection per call.

const DB_NAME = "sb-tryon-cache";
const DB_VERSION = 1;
const STORE_NAME = "model-cache";

const HAIR_MODEL_KEY = "selfie_multiclass_256x256";
const HAIR_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite";

const FACE_LANDMARKER_KEY = "face_landmarker";
const FACE_LANDMARKER_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task";

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

interface CachedModelOptions {
  cacheKey: string;
  modelUrl: string;
  /** Human-readable model label for the fetch-failed error message. */
  label: string;
}

/**
 * Returns a Blob URL for a cached MediaPipe model. First call fetches from
 * CDN and stores bytes in IndexedDB; subsequent calls read from IndexedDB
 * and skip the network. Caller is responsible for `URL.revokeObjectURL`
 * on dispose.
 *
 * If IndexedDB persistence fails (Safari private quota, Brave fingerprint
 * block, etc.) the function still returns a Blob URL backed by the in-memory
 * fetch result — the session works, no caching for next time. Only a hard
 * fetch failure rejects.
 */
async function getCachedModel(opts: CachedModelOptions): Promise<string> {
  const db = await openDb();
  try {
    const cached = await idbGet<ArrayBuffer>(db, opts.cacheKey);
    if (cached) {
      return URL.createObjectURL(new Blob([cached]));
    }
    const response = await fetch(opts.modelUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${opts.label}: ${response.status} ${response.statusText}`,
      );
    }
    const bytes = await response.arrayBuffer();
    try {
      await idbPut(db, opts.cacheKey, bytes);
    } catch (err) {
      console.warn(
        `[model-cache] IndexedDB persist failed for ${opts.cacheKey}; returning in-memory blob URL only.`,
        err,
      );
    }
    return URL.createObjectURL(new Blob([bytes]));
  } finally {
    db.close();
  }
}

export function getCachedHairSegmentationModel(): Promise<string> {
  return getCachedModel({
    cacheKey: HAIR_MODEL_KEY,
    modelUrl: HAIR_MODEL_URL,
    label: "hair model",
  });
}

export function getCachedFaceLandmarkerModel(): Promise<string> {
  return getCachedModel({
    cacheKey: FACE_LANDMARKER_KEY,
    modelUrl: FACE_LANDMARKER_URL,
    label: "face landmarker model",
  });
}

async function clearCachedModel(cacheKey: string): Promise<void> {
  const db = await openDb();
  try {
    await idbDelete(db, cacheKey);
  } finally {
    db.close();
  }
}

/** Test/dev helper: clears the cached hair segmentation model. */
export function clearCachedHairSegmentationModel(): Promise<void> {
  return clearCachedModel(HAIR_MODEL_KEY);
}

/** Test/dev helper: clears the cached face landmarker model. */
export function clearCachedFaceLandmarkerModel(): Promise<void> {
  return clearCachedModel(FACE_LANDMARKER_KEY);
}
