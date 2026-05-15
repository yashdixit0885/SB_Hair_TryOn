# Story 1.6: Build PhotoUploader + ConsentPrompt with consent state machine

**Status:** done

> Validation is optional. Run `validate-story` before `dev-story` if a quality second-pass is wanted.

## Story

As Maya the consumer,
I want to upload a photo via drag-drop or click and provide explicit consent before my photo is processed (re-prompted every upload),
so that I trust this is a salon-grade tool that respects my biometric data, not a surveillance app (FR1, FR46, NFR13, UX-DR4, cross-cutting concern #2).

## Acceptance Criteria

**AC1 — `<PhotoUploader>` supports drag-drop + click upload with full state surface (UX-DR4)**

Given UX-DR4's PhotoUploader spec and FR1,
When the developer creates [src/components/render/PhotoUploader.tsx](../../sb-tryon/src/components/render/PhotoUploader.tsx) (Client Component) with colocated `PhotoUploader.test.tsx` and `PhotoUploader.stories.tsx`,
Then the component renders a labeled drop-zone region wrapping a single visible `<input type="file" accept="image/jpeg,image/png,image/webp">` that supports both drag-drop and click-to-upload.

And the component exposes the following discrete states (state shape `"empty" | "uploading" | "validating" | "validated" | "error"`), with these surface behaviors:

- `empty` (default): copy reads `"Upload a clear front-facing photo, even lighting"` (sourced from [src/lib/copy/consent.ts](../../sb-tryon/src/lib/copy/consent.ts) — see AC8), drop-zone visible, file-input focusable, "Delete photo" affordance **not** visible (no photo to delete).
- `uploading`: shows a skeleton placeholder matching the photo's eventual aspect ratio (AGENTS.md §6 "Loading state" — skeleton placeholders, never a centered spinner that blocks the surface).
- `validating`: shows the photo preview with an inline pill "Checking the photo…", calls `useProvider("ar").detectFace(imageBitmap)` (see AC9), and reads back a `{ faceDetected: boolean; confidence: number }` result.
- `validated`: shows the photo preview + the consent prompt opens (AC2 — `<ConsentPrompt>` mounts the moment validation succeeds; the user does **not** click "Use this photo" first — the prompt IS the next step per UX-DR4).
- `error`: shows the specific message `"We couldn't find a face — try a brighter, front-facing photo"` (from copy module) below the drop-zone; the drop-zone re-arms for a fresh attempt.

And **"Delete photo" affordance is always visible while a photo is active** (states `validating`, `validated`, `error`): an explicit `<Button variant="tertiary">` labeled "Delete photo" that clears the in-memory `Blob`, revokes the object URL, resets state to `empty`, and resets the consent store via `useConsentStore.reset()` (AC4 — every fresh upload is a fresh consent cycle).

And the file input is **the only `<input type="file">` allowed in `src/**`** — the global ESLint `no-restricted-syntax` rule blocks the JSX everywhere else. To allow it inside `PhotoUploader.tsx` itself, **update [eslint.config.mjs](../../sb-tryon/eslint.config.mjs)** to add `"src/components/render/PhotoUploader.tsx"` (and the colocated test file if the test renders the JSX) to the `ignores` array of the `no-restricted-syntax` rule block (current location ~line 96-109). Do **not** use inline `eslint-disable` comments — surfacing the exemption in config keeps the audit surface visible.

And client-side image validation runs on the picked `File`:

- Type: one of `image/jpeg | image/png | image/webp` (the `accept` attr is advisory only; verify the MIME on the File object). Reject other types into the `error` state with copy `"That file isn't a photo we can use. Try a JPG, PNG, or WebP."`.
- Size: max 10 MB (`MAX_PHOTO_BYTES = 10 * 1024 * 1024` declared at module top). Larger files reject into the `error` state with copy `"That photo is larger than 10 MB. Try a smaller version."`.
- After type+size pass, `createImageBitmap(file)` produces an `ImageBitmap` which is what `detectFace()` consumes. Stored in a `useRef<Blob | null>` for the active photo (AGENTS.md §1 cross-cutting concern #2 — never in Zustand, never in IndexedDB until the user opts in via consent).

**AC2 — `<ConsentPrompt>` is a Dialog with ESC disabled, three options, and returns only on explicit choice (FR46, UX-DR4)**

Given UX-DR4's ConsentPrompt spec, FR46 ("re-prompted every photo upload, no implicit re-consent"), and the architecture invariant that this is a legally-required commitment surface (UX spec §"Modal Dialogs" — non-dismissable overlays are reserved for legally-required moments),
When the developer creates [src/components/render/ConsentPrompt.tsx](../../sb-tryon/src/components/render/ConsentPrompt.tsx) (Client Component) with colocated test + story,
Then the component is a controlled Radix Dialog (`<Dialog open={open} onOpenChange={onOpenChange}>`) composed of [src/components/ui/dialog.tsx](../../sb-tryon/src/components/ui/dialog.tsx) (existing primitive from Story 1.3) with the following overrides:

- `onEscapeKeyDown={(e) => e.preventDefault()}` on `<DialogContent>` — ESC is disabled (the user must make an explicit choice).
- `onPointerDownOutside={(e) => e.preventDefault()}` and `onInteractOutside={(e) => e.preventDefault()}` — clicking the overlay does not dismiss (forces explicit decision).
- `showCloseButton={false}` on `<DialogContent>` — the existing primitive supports this prop; pass it explicitly so the close affordance is omitted (architecture: "always returns explicit decision; no dismissal").

And the dialog renders:

- `<DialogTitle>` — copy from `consentCopy.title` ("Process your photo?")
- `<DialogDescription>` — plain-language BIPA/CUBI/GDPR copy from `consentCopy.body` (sourced from [src/lib/copy/consent.ts](../../sb-tryon/src/lib/copy/consent.ts) — see AC8).
- A `<RadioGroup>` (existing primitive, [radio-group.tsx](../../sb-tryon/src/components/ui/radio-group.tsx)) with three `<RadioGroupItem>` options. **Default selection: "local"** (architecture: "Process locally only — default selected"). Labels:
  - `"local"` — "Process locally only — your photo stays on your device" (default selected, focus lands here on open)
  - `"saved"` — "Process and save to my account — you can come back later to compare looks"
  - `"declined"` — "Decline — show me a curated reference photo instead"
- `<DialogFooter>` with a single primary "Continue" `<Button>` that is **disabled until a radio option is focused/selected** (Radix RadioGroup gives one option default-checked, so Continue is enabled on mount). The button label stays "Continue" — verb-driven copy per UX-DR9 (do **not** vary the label by selection; the radio is the commitment, not the button).

And the component accepts these props:

```typescript
interface ConsentPromptProps {
  /** Controls the dialog open state. */
  open: boolean;
  /** Open-state change handler. Called only on Continue (with the chosen scope)
   *  or via the parent unmounting the dialog. Never called by ESC, outside-click,
   *  or the close button (which is hidden). */
  onOpenChange: (open: boolean) => void;
  /** Called when the user confirms with "local" or "saved". The parent routes
   *  these to `useConsentStore.grant(scope)` which POSTs to /api/consent/grant. */
  onConsent: (scope: "local" | "saved") => void;
  /** Called when the user confirms with "declined". Story 1.13 wires this to
   *  navigate to <DemoFallbackPath>; Story 1.6 ships the callback only. */
  onDecline: () => void;
}
```

And accessibility:

- Radix `<Dialog>` provides focus trap + ARIA labeling automatically (`<DialogTitle>` is wired as `aria-labelledby` and `<DialogDescription>` as `aria-describedby` — verified by the existing primitive).
- The radio group itself has `aria-label="Photo processing choice"`; each `<RadioGroupItem>` has a visible label (matched via `<Label htmlFor>` from [label.tsx](../../sb-tryon/src/components/ui/label.tsx)) so screen-reader users hear each option name + description before activating.
- The axe-core sibling test asserts zero violations (`expect(container).toHaveNoViolations()`).

**AC3 — Consent state machine in `src/lib/security/consent-state.ts` (pure module, no React)**

Given architecture §"Consent / biometric privacy" + cross-cutting concern #2 + FR46 ("no implicit re-consent"),
When the developer creates [src/lib/security/consent-state.ts](../../sb-tryon/src/lib/security/consent-state.ts) (pure TypeScript, no React, no Zustand, no DOM),
Then it exports:

```typescript
/** Status values the state machine can hold. The store (AC4) is what actually
 *  holds the value at runtime; this module just defines the transition rules. */
export type ConsentStatus =
  | "not-consented"   // initial state for every fresh upload cycle
  | "consented-local"   // user picked "Process locally only"
  | "consented-saved"   // user picked "Process and save to my account"
  | "declined";          // user picked "Decline"

/** Increment when the consent copy is materially updated. Stored on every
 *  granted consent record so an audit can replay which version of the copy
 *  the user actually saw. */
export const CONSENT_COPY_VERSION = "2026-05-14.v1";

/** Single consent record — what AC5 writes to /api/consent/grant. Immutable
 *  once created; no in-place mutation anywhere in feature code. */
export interface ConsentRecord {
  status: Exclude<ConsentStatus, "not-consented">; // "not-consented" is never recorded
  grantedAt: string;                                // ISO-8601, e.g. "2026-05-14T...Z"
  consentVersion: string;                            // CONSENT_COPY_VERSION at grant time
  sessionId: string;                                  // opaque session identifier (AC7)
}

/** The only legal transitions. Any other from→to pair throws InvariantError
 *  in `transition()`. Notice: no transition FROM consented-* or declined
 *  back to anything other than not-consented (reset). This is the "no implicit
 *  re-consent" invariant from FR46 expressed as a transition table. */
export const LEGAL_TRANSITIONS: Record<ConsentStatus, ConsentStatus[]> = {
  "not-consented": ["consented-local", "consented-saved", "declined"],
  "consented-local": ["not-consented"],   // reset only
  "consented-saved": ["not-consented"],   // reset only
  "declined": ["not-consented"],            // reset only
};

export class ConsentInvariantError extends Error {
  constructor(public readonly from: ConsentStatus, public readonly to: ConsentStatus) {
    super(`Illegal consent transition: ${from} → ${to}`);
    this.name = "ConsentInvariantError";
  }
}

/** Pure: validates a proposed transition and returns the new status, or
 *  throws ConsentInvariantError. The Zustand store (AC4) calls this
 *  before mutating its state. */
export function transition(from: ConsentStatus, to: ConsentStatus): ConsentStatus;

/** Pure: builds an immutable ConsentRecord for the granted status. Caller
 *  supplies `now` (ISO-8601) and `sessionId` so the function stays pure and
 *  testable (no `Date.now()` or crypto.randomUUID() inside). */
export function buildConsentRecord(args: {
  status: Exclude<ConsentStatus, "not-consented">;
  now: string;
  sessionId: string;
}): ConsentRecord;
```

And the colocated [consent-state.test.ts](../../sb-tryon/src/lib/security/consent-state.test.ts) asserts:

1. Every legal transition listed in `LEGAL_TRANSITIONS` returns the target status when passed to `transition()` (4 origins × N targets — table-driven).
2. Every **illegal** transition (e.g. `consented-local` → `consented-saved` without intermediate reset) throws `ConsentInvariantError` with `from` and `to` populated.
3. `buildConsentRecord({ status: "consented-local", now: "2026-05-14T12:00:00.000Z", sessionId: "abc" })` returns the exact shape `{ status, grantedAt, consentVersion, sessionId }` with `consentVersion === CONSENT_COPY_VERSION`.
4. `buildConsentRecord` is **pure** — calling it twice with the same args returns deep-equal results (no internal randomness, no Date.now() drift).

**AC4 — Zustand consent store `src/lib/stores/consent.ts` exposes `consentStatus`, `lastPromptedAt`, `consentVersion`, `grant`, `decline`, `reset`**

Given architecture §"State Management" (Zustand for client UI state), AGENTS.md §5 (imperative verb action naming), and the existing `zustand` dependency (already installed per Story 1.1),
When the developer creates [src/lib/stores/consent.ts](../../sb-tryon/src/lib/stores/consent.ts) with colocated test,
Then it exports a single store created with `create<ConsentStore>(...)`:

```typescript
export interface ConsentStore {
  /** Current state machine value. Reads via direct field access per AGENTS.md §5:
   *  `const status = useConsentStore((s) => s.consentStatus);` — never via a
   *  `selectConsentStatus` getter. */
  consentStatus: ConsentStatus;
  /** ISO-8601 of the most recent prompt show (set by promptShown()). Drives
   *  the "lastPromptedAt" field architecture §"Consent" calls out for the
   *  audit-log surface (Epic 8 reads this). */
  lastPromptedAt: string | null;
  /** Mirror of CONSENT_COPY_VERSION at the time of the most recent grant.
   *  Stamped on every ConsentRecord written to /api/consent/grant. */
  consentVersion: string;
  /** Most recently issued sessionId (AC7). Stamped on consent records. */
  sessionId: string;

  // Imperative-verb actions (AGENTS.md §5)

  /** Records that the prompt was shown. Updates lastPromptedAt to now.
   *  Called by <PhotoUploader> when it mounts the <ConsentPrompt>. */
  promptShown: () => void;

  /** Transitions to consented-local | consented-saved, builds a ConsentRecord,
   *  POSTs it to /api/consent/grant (AC5), and emits `consent.granted` telemetry
   *  (AC6). The POST is fire-and-forget — failure logs to console.error but
   *  does NOT block the UI (Demo V1 audit log is best-effort; Production V1
   *  Story 8.2 hardens this path). */
  grant: (scope: "local" | "saved") => Promise<void>;

  /** Transitions to declined and emits `consent.declined` telemetry (AC6).
   *  Does NOT POST a record (decline is a user-side refusal — recording it
   *  would itself be a consent violation; only granted consent is audit-logged
   *  per architecture §"Consent / biometric privacy"). */
  decline: () => Promise<void>;

  /** Resets to not-consented (legal transition from any state). Called by
   *  <PhotoUploader> on every fresh upload via "Delete photo" or when the
   *  user starts a second upload (FR46 — no implicit re-consent: the store
   *  does NOT cache "previously granted"). */
  reset: () => void;
}

export const useConsentStore = create<ConsentStore>(...);
```

And the implementation:

- Initializes `consentStatus: "not-consented"`, `lastPromptedAt: null`, `consentVersion: CONSENT_COPY_VERSION`, `sessionId: ""`.
- `promptShown()` sets `lastPromptedAt` to `new Date().toISOString()`. If `sessionId === ""`, generates a new one via `crypto.randomUUID()` and writes it back (lazy sessionId allocation — first prompt of the user's session creates it).
- `grant("local" | "saved")` calls `transition(get().consentStatus, "consented-local" | "consented-saved")` (which throws `ConsentInvariantError` if the current status forbids), then on success: builds `ConsentRecord` via `buildConsentRecord(...)`, `await fetch("/api/consent/grant", { method: "POST", body: JSON.stringify(record) }).catch(console.error)`, calls `track({ name: "consent.granted", scope, sessionId })`, then `set({ consentStatus: "consented-local" | "consented-saved", consentVersion: CONSENT_COPY_VERSION })`.
- `decline()` calls `transition(...)`, calls `track({ name: "consent.declined", sessionId })`, then `set({ consentStatus: "declined" })`. No POST.
- `reset()` calls `transition(get().consentStatus, "not-consented")` and `set({ consentStatus: "not-consented" })`. **Does NOT clear `sessionId` or `lastPromptedAt`** — the session identifier is per-browser-session, not per-upload; clearing it would break the multi-upload audit trail.

And the colocated test ([consent.test.ts](../../sb-tryon/src/lib/stores/consent.test.ts)) covers:

1. Initial state matches the documented defaults.
2. `promptShown()` lazily creates a `sessionId` (UUID-shaped) and stamps `lastPromptedAt`.
3. `grant("local")` from `not-consented` → `consented-local`; mocks `fetch` (vi.spyOn(global, "fetch")) and asserts: the fetch is called with `/api/consent/grant`, the body parses to a valid `ConsentRecord`, `track` is invoked once with the correct event shape, and the resulting `consentStatus === "consented-local"`.
4. `grant("saved")` from `not-consented` → `consented-saved`, analogous.
5. `decline()` from `not-consented` → `declined`; asserts NO fetch is dispatched and `track` is invoked with `consent.declined`.
6. **FR46 invariant test**: from `consented-local`, calling `grant("saved")` throws `ConsentInvariantError`. The user must `reset()` first.
7. `reset()` from any non-initial state → `not-consented`. `sessionId` is preserved (audit-trail invariant).
8. `grant()` continues to update local state even when `fetch` rejects (the catch swallows the rejection per "best-effort audit log" — the user is not blocked from the render surface by a network failure).

**AC5 — Stub Route Handler `src/app/api/consent/grant/route.ts` accepts a ConsentRecord and logs to console (Demo V1)**

Given architecture §"Project Structure" lists `src/app/api/consent/grant/route.ts` as the consent grant endpoint, and Story 8.2 will replace this stub with the audit-logged production implementation,
When the developer creates [src/app/api/consent/grant/route.ts](../../sb-tryon/src/app/api/consent/grant/route.ts),
Then it exports a single `POST` handler that:

1. Parses the JSON body and validates it against the `ConsentRecord` shape via a Zod schema in [src/lib/schemas/consent.ts](../../sb-tryon/src/lib/schemas/consent.ts) (AC8). On validation failure: return `Response.json({ error: { code: "VALIDATION_FAILED", message, details: { field } } }, { status: 422 })` per AGENTS.md §4 (no `{ data, error }` envelope on success; structured `error` envelope on failure).
2. On success: logs to `console.info("[consent.grant]", record)` (Demo V1 stub — sufficient per architecture §"Consent: Consent records are written to OTel ... and to the audit log table in **Production V1**") and returns `Response.json(record, { status: 201 })`.
3. The handler is **server-only** (no `"use client"`). Route file stays ≤150 lines (AGENTS.md §3 hard rule for App Router route files).

And a colocated [route.test.ts](../../sb-tryon/src/app/api/consent/grant/route.test.ts) (Vitest, NOT Playwright) directly imports the `POST` handler and asserts:

- Valid `ConsentRecord` → 201 + body echoes the record + `console.info` is called once with the prefix `[consent.grant]`.
- Missing `status` → 422 + `{ error: { code: "VALIDATION_FAILED", ... } }`.
- Invalid `grantedAt` (not ISO-8601) → 422.
- Status `"not-consented"` in the body → 422 (the schema excludes that variant per AC3 type definition).

**AC6 — Telemetry seam extended for `consent.granted` and `consent.declined` (AGENTS.md §5)**

Given architecture §"Communication Patterns" defines the OTel event taxonomy (`consent.granted`, `consent.declined`) and AGENTS.md §5 mandates event names are stable contracts with no PII / biometric data in payloads,
When the developer updates [src/lib/observability/track.ts](../../sb-tryon/src/lib/observability/track.ts),
Then the `TrackedEvent` discriminated union gains two variants matching exactly the architecture-spec'd shapes:

```typescript
export type TrackedEvent =
  | { name: "tryon.segmentation_completed"; durationMs: number; deviceClass: DeviceClass }
  | { name: "tryon.render_completed"; durationMs: number }
  | { name: "tryon.color_selected"; colorId: string }
  | { name: "consent.granted"; scope: "local" | "saved"; sessionId: string }    // NEW
  | { name: "consent.declined"; sessionId: string };                                // NEW
```

And the colocated [track.test.ts](../../sb-tryon/src/lib/observability/track.test.ts) gains two new cases asserting:

1. `track({ name: "consent.granted", scope: "local", sessionId: "abc" })` writes a single `console.info` line beginning `[telemetry] consent.granted ` with a JSON body containing `{"scope":"local","sessionId":"abc"}`.
2. `track({ name: "consent.declined", sessionId: "abc" })` analogously.

And **no biometric data** appears in either payload (no photoBlob, no imageBitmap, no fileName, no hash of any of those). AGENTS.md §5 invariant.

**AC7 — Session identifier is opaque, lazily allocated, and never includes biometric data**

Given AGENTS.md §1 cross-cutting concern #2 ("Telemetry payload contains durationMs + deviceClass only — zero biometric data") and architecture §"Consent" ("Consent records are written to OTel with session_id only, no biometric data"),
When the consent store (AC4) lazily allocates a session identifier on first `promptShown()`,
Then the identifier is generated via `crypto.randomUUID()` (available in all modern browsers + Node 19+; verified against the project's Node 20 LTS pin from [.nvmrc](../../sb-tryon/.nvmrc)), is **not derived from any photo content** (no hash of the file bytes, no EXIF data, no MD5/SHA of the Blob), and persists for the lifetime of the browser session (the `useConsentStore` is in-memory only; refreshing the page allocates a new sessionId — that's correct, the audit surface should treat post-refresh as a new session).

And a Vitest assertion in the consent store test ([consent.test.ts](../../sb-tryon/src/lib/stores/consent.test.ts)) covers: after `promptShown()`, `sessionId` matches the regex `/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i` (UUID v4 shape; v7 is not yet shipped by `crypto.randomUUID` so v4 is what we get).

And there are no `console.log` / `console.info` lines anywhere in the consent code path that include the photo `Blob`, the file name, or any derivative — grep `src/lib/{stores,security,copy}` + `src/components/render/{PhotoUploader,ConsentPrompt}` for `console.` should return only the `console.error("[consent] fetch failed", err)` from AC4's best-effort POST catch.

**AC8 — BIPA/CUBI/GDPR-approved copy lives in `src/lib/copy/consent.ts` (single source of truth)**

Given architecture lists [src/lib/copy/consent.ts](../../sb-tryon/src/lib/copy/consent.ts) as the file holding "BIPA/CUBI/GDPR approved language" and UX-DR16's "tone & voice" requires plain language at the legally-required commitment surface,
When the developer creates [src/lib/copy/consent.ts](../../sb-tryon/src/lib/copy/consent.ts) with colocated test,
Then it exports a single frozen object:

```typescript
export const consentCopy = Object.freeze({
  uploader: {
    emptyStateHeading: "Upload a clear front-facing photo, even lighting",
    deleteAffordance: "Delete photo",
    validatingPill: "Checking the photo…",
    errorNoFace: "We couldn't find a face — try a brighter, front-facing photo",
    errorBadType: "That file isn't a photo we can use. Try a JPG, PNG, or WebP.",
    errorTooLarge: "That photo is larger than 10 MB. Try a smaller version.",
  },
  prompt: {
    title: "Process your photo?",
    body:
      "We'll analyze your photo on your device to render the color you picked. " +
      "We never send your photo to a server unless you choose to save it to your account. " +
      "You can change your mind at any time.",
    optionLocalLabel: "Process locally only — your photo stays on your device",
    optionSavedLabel: "Process and save to my account — you can come back later to compare looks",
    optionDeclinedLabel: "Decline — show me a curated reference photo instead",
    continueButton: "Continue",
    radioGroupLabel: "Photo processing choice",
  },
} as const);
```

And the strings adhere to UX-DR16 tone rules (no marketing voice, no exclamation marks, no "we", verb-first action labels, plain past-tense not euphemism) — verified by code review against UX spec §"Tone & Voice".

And a sibling test ([consent.test.ts](../../sb-tryon/src/lib/copy/consent.test.ts)) asserts: the object is frozen (`Object.isFrozen(consentCopy) === true`), `consentCopy.prompt.body.includes("on your device")` (the core BIPA / on-device claim) === true, and the three radio labels contain the literal substrings `"locally only"`, `"save to my account"`, `"Decline"` (regression guard against future copy churn breaking the AC2 contract).

And **all user-visible copy in `PhotoUploader.tsx` and `ConsentPrompt.tsx` is sourced from this module** — no inline string literals. The reviewer can grep the two component files for `"` + English words and confirm only JSX prop names and Tailwind classes use string literals; all user-facing copy reads from `consentCopy.*`.

**AC9 — `ARProvider` contract extended with `detectFace(image)`; MockARProvider implements via MediaPipe FaceLandmarker; no-op provider returns deterministic face-detected**

Given UX-DR4's PhotoUploader spec requires "face detected via MediaPipe Face Landmarker" + cross-cutting concern #1 ("feature code never imports a vendor SDK directly") + AGENTS.md §1 (`@mediapipe/*` blocked outside `src/lib/providers/{mock,production}/*` + factory),
When the developer extends the AR provider contract and its implementations,
Then [src/lib/providers/contracts/ar-provider.ts](../../sb-tryon/src/lib/providers/contracts/ar-provider.ts) gains:

```typescript
/** Result from MediaPipe FaceLandmarker. We do NOT need the full 478 landmarks
 *  for Story 1.6 — only whether at least one face was detected. The landmark
 *  array is left out of the public contract to keep the surface small; a future
 *  story may add it when face-aligned color render lands. */
export interface FaceDetectionResult {
  faceDetected: boolean;
  /** Detector confidence for the most-confident face. 0..1. Undefined when
   *  no face is detected. */
  confidence?: number;
}

export interface ARProvider {
  prewarm(): Promise<void>;
  segment(image: ImageBitmap): Promise<SegmentationResult>;
  /** Runs MediaPipe FaceLandmarker (single-image mode) on the input and reports
   *  whether at least one face was detected. Used by <PhotoUploader> as the
   *  client-side validity gate before opening <ConsentPrompt>. Story 1.6. */
  detectFace(image: ImageBitmap): Promise<FaceDetectionResult>;
  dispose(): Promise<void>;
}
```

And [src/lib/providers/mock/MockARProvider.ts](../../sb-tryon/src/lib/providers/mock/MockARProvider.ts) gains a `detectFace()` implementation:

- Lazy-initializes a `FaceLandmarker` (analogous to the existing `ImageSegmenter` lazy bootstrap) using the same `FilesetResolver` instance (do **not** create a second resolver — share the WASM bundle URL pin `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm` to keep the JS↔WASM pair in lockstep). The face landmark model URL: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task` (single-task variant; sufficient for face-presence + landmark count).
- Calls `faceLandmarker.detect(image)` (synchronous on IMAGE running mode, like `segmenter.segment()`). The result is `result.faceLandmarks: NormalizedLandmark[][]`; `faceDetected = result.faceLandmarks.length > 0`.
- `confidence` is the mean of the `result.faceBlendshapes[0]?.categories` confidences — or simply `1.0` when at least one face was detected and the array is non-empty; **flag the simpler path in dev notes** if the blendshapes parsing adds complexity not worth Story 1.6's scope. The downstream consumer (<PhotoUploader>) only branches on `faceDetected` for AC1's error state; `confidence` is for future use.
- The FaceLandmarker model is **also cached in IndexedDB** by extending [src/lib/persistence/model-cache.ts](../../sb-tryon/src/lib/persistence/model-cache.ts) with `getCachedFaceLandmarkerModel(): Promise<string>` (Blob URL, same shape as the existing `getCachedHairSegmentationModel`). The IndexedDB key is `face_landmarker` to keep the existing `selfie_multiclass_256x256` key untouched.
- `dispose()` also closes the `FaceLandmarker` and revokes its model Blob URL (single dispose method handles both ML resources — the contract isn't split).
- `prewarm()` is **NOT** extended to load the face model — `detectFace()` is called only on actual upload, so the face model can lazy-load there without the "first paint" pre-warm cost. (Alternative: chain face-model load into `prewarm()` so the second model is also cached before the user uploads. **Flag this decision in dev notes**; recommended default is lazy-load on first `detectFace()` to keep `prewarm()` cost bounded.)

And the `MockARProvider` test file ([MockARProvider.test.ts](../../sb-tryon/src/lib/providers/mock/MockARProvider.test.ts)) gains 3 new tests:

1. `detectFace()` with a mocked `FaceLandmarker.detect` that returns a result with `faceLandmarks: [[...]]` (1 face) → resolves to `{ faceDetected: true, confidence: <number 0..1> }`.
2. `detectFace()` with a mocked result where `faceLandmarks: []` → resolves to `{ faceDetected: false }` (note: **does NOT throw** — face-not-detected is a normal validation result, not an error; <PhotoUploader> branches the UX based on the boolean. Compare to AC5 of Story 1.5 where `NO_HAIR_DETECTED` does throw — different semantics: hair segmentation throwing means the photo can't be rendered at all, while face-not-detected means the photo isn't useful for our segmentation but the system isn't broken).
3. `detectFace()` post-dispose throws `ProviderError("DISPOSED", ...)` (same lifecycle rule as `segment()`).

And [src/test-utils/noop-ar-provider.ts](../../sb-tryon/src/test-utils/noop-ar-provider.ts) is updated to satisfy the extended contract — `detectFace()` returns `{ faceDetected: true, confidence: 1 }` deterministically (with an `options.faceDetected` knob for tests that need to exercise the `error` state path). Sibling test gains coverage of both the default and the `faceDetected: false` override.

And [src/components/render/ArProbe.tsx](../../sb-tryon/src/components/render/ArProbe.tsx) (Story 1.5 verification probe) does NOT need any change — it calls `prewarm()` only, which has not changed in surface or behavior.

**AC10 — `<PhotoUploader>` integrates the provider, store, and prompt into one end-to-end flow**

Given AC1 (uploader surface), AC2 (prompt), AC4 (store), AC9 (provider), and AGENTS.md §6 "Required imports / wrappers per surface" — `<PhotoUploader>` is the **only** path to photo upload across the entire app,
When the developer wires the integration inside [src/components/render/PhotoUploader.tsx](../../sb-tryon/src/components/render/PhotoUploader.tsx),
Then the component:

1. Reads `useProvider("ar")` (AGENTS.md §1 #1 — no direct `@mediapipe/*` import).
2. Reads `useConsentStore()` for the store actions (`promptShown`, `grant`, `decline`, `reset`).
3. On file pick / drop: validates type+size (AC1), creates an `ImageBitmap`, sets state to `validating`, calls `ar.detectFace(bitmap)`. On `faceDetected === false`: sets state to `error` with `consentCopy.uploader.errorNoFace`. On `faceDetected === true`: sets state to `validated`, calls `useConsentStore.promptShown()`, and opens the `<ConsentPrompt>` dialog.
4. The `<ConsentPrompt>`'s `onConsent("local" | "saved")` → calls `useConsentStore.grant(scope)` → on resolve, calls a `props.onPhotoConfirmed(blob, scope)` callback (defined below). On `onDecline()` → calls `useConsentStore.decline()` → on resolve, calls a `props.onDeclined()` callback.
5. The active photo `Blob` lives in a `useRef<Blob | null>` — **not** in Zustand, **not** in IndexedDB, **not** in component state's render-snapshot. (AGENTS.md §1 #2 + §4 anti-pattern "photo blob in IndexedDB without consent path".)
6. The "Delete photo" affordance is rendered whenever the ref holds a blob; clicking it: `URL.revokeObjectURL(objectUrl)`, clears the ref, calls `useConsentStore.reset()`, sets state to `empty`.

And the public component props are:

```typescript
export interface PhotoUploaderProps {
  /** Called when the user confirms a photo via the consent prompt with
   *  "local" or "saved". The parent (Story 1.10's /try-on route) uses this to
   *  transition to the render surface. */
  onPhotoConfirmed: (
    photo: Blob,
    /** Scope of the granted consent. Drives whether Story 1.12's saved-looks
     *  IndexedDB persistence is allowed for this photo. */
    scope: "local" | "saved",
  ) => void;
  /** Called when the user clicks "Decline" in the consent prompt. Parent
   *  routes to <DemoFallbackPath> in Story 1.13 (Story 1.6 only ships the
   *  callback). */
  onDeclined: () => void;
}
```

And the surface is keyboard-accessible end-to-end:

- The file input is focusable; the drop-zone is a `<label htmlFor>` wrapping the input so click-anywhere triggers the file picker.
- Error state announcements use `aria-live="polite"` on the error message region (UX-DR13 + architecture §"Communication" — non-critical updates).
- The `<ConsentPrompt>` Radix dialog handles its own focus trap + restoration (the existing primitive from Story 1.3).

**AC11 — `<PhotoUploader>` and `<ConsentPrompt>` ship colocated tests and stories; both pass axe-core**

Given Storybook + axe-core enforcement gates (AGENTS.md §1 #9 + §6 CI gate 7 + Story 1.3 AC15),
When the developer ships the two new components,
Then each component file has a sibling `.test.tsx` and `.stories.tsx`:

- [PhotoUploader.test.tsx](../../sb-tryon/src/components/render/PhotoUploader.test.tsx) — uses `renderWithProviders` (Story 1.3 / 1.5 test utility). Covers the 5 visible states, the no-face error path, the consent-confirmed callback, the decline callback, the delete-photo affordance, and the "second upload re-prompts" invariant. axe assertion `await expect(container).toHaveNoViolations()` at least once per render-test (architecture: axe via setup file already runs automatically against `<Component />` rendered under `src/components/**` — confirm the auto-axe is still active before relying on it).
- [PhotoUploader.stories.tsx](../../sb-tryon/src/components/render/PhotoUploader.stories.tsx) — at minimum `Default`, `Error` (with a custom AR provider override via `parameters.providers` or a story-local decorator returning `{ faceDetected: false }`), and `WithPhotoLoaded` (renders the validated + prompt-open state). Each story passes `pnpm test:storybook` (browser-mode Vitest + a11y addon).
- [ConsentPrompt.test.tsx](../../sb-tryon/src/components/render/ConsentPrompt.test.tsx) — covers: dialog opens, default selection is "local", ESC does not dismiss, outside-click does not dismiss, no close button rendered, Continue with "local" calls `onConsent("local")`, Continue with "saved" calls `onConsent("saved")`, Continue with "declined" calls `onDecline()`, axe.
- [ConsentPrompt.stories.tsx](../../sb-tryon/src/components/render/ConsentPrompt.stories.tsx) — at minimum `Default` (open=true, ready for screen-reader review). Pass `pnpm test:storybook`.

And `pnpm check:stories` continues to exit 0 — every new file in `src/components/**` has a sibling story.

**AC12 — `e2e/consent-flow.spec.ts` replaces its placeholder with the FR46 acceptance test**

Given the existing placeholder at [e2e/consent-flow.spec.ts](../../sb-tryon/e2e/consent-flow.spec.ts) is a 5-line `expect(true).toBe(true)` shell, and FR46's explicit acceptance criterion is "consent re-prompted on every photo upload — no implicit re-consent",
When the developer replaces the placeholder with a real Playwright spec,
Then the spec:

1. Reuses the existing `/test/ar-smoke` harness (Story 1.5) **or** mounts a new minimal `/test/photo-upload-smoke` harness at [src/app/(test)/test/photo-upload-smoke/page.tsx](../../sb-tryon/src/app/(test)/test/photo-upload-smoke/page.tsx) that renders `<PhotoUploader onPhotoConfirmed={() => {}} onDeclined={() => {}} />` and exposes a `data-uploader-ready="true"` marker. **Recommended: new harness** — keeps the AR smoke harness focused on its own AC; both routes are gated by the existing `NEXT_PUBLIC_TEST_HARNESS=1` (set in [playwright.config.ts](../../sb-tryon/playwright.config.ts) by Story 1.5).
2. Loads two PNG fixtures from `e2e/fixtures/photos/` (re-use the directory + README inventory created in Story 1.5; add a second copyright-clear face photo, or use the existing Type-4 fixture if Sally has dropped one — see "Open Questions" below). If neither fixture is available at test time, mark the spec `test.fixme` analogous to Story 1.5's Janelle pattern.
3. Step 1 — upload photo A: drives `<input type="file">` via `page.setInputFiles(...)`, waits for the `<ConsentPrompt>` dialog to appear (assert `await expect(page.getByRole("dialog")).toBeVisible()`), clicks Continue with default "local" selected.
4. Step 2 — upload photo B (same session, same uploader instance): drives a second `setInputFiles` call. **The prompt MUST re-appear** (assert `await expect(page.getByRole("dialog")).toBeVisible()` again). This is the FR46 invariant.
5. The test also asserts the dialog's accessible name + the radio group structure (sanity check that the test harness wires the prompt correctly, not just any modal).
6. The spec runs in Chromium-only (`test.skip(({ browserName }) => browserName !== "chromium", ...)`) — mirrors Story 1.5's MediaPipe-in-CI flake mitigation; WebKit/Firefox face-landmarker WASM is more fragile.

**AC13 — Telemetry payloads contain ZERO biometric data (audit + grep verification)**

Given AGENTS.md §1 #2 cross-cutting invariant + architecture §"Consent" + §"Communication Patterns" ("Never include user-identifying or biometric data in OTel payloads"),
When the developer ships the story,
Then a code-review-verifiable grep (`grep -rn "track(" src/lib/stores/consent.ts src/components/render/{PhotoUploader,ConsentPrompt}.tsx src/lib/observability/`) returns **only** the two `consent.*` events plus the existing Story 1.5 `tryon.*` events, and **every** `track()` invocation payload contains exclusively `sessionId`, `scope`, `durationMs`, `deviceClass`, or `colorId` — **never** a `Blob`, `File`, `ImageBitmap`, `imageBytes`, `fileName`, `mimeType`, or any photo-derived hash.

And the [consent.test.ts](../../sb-tryon/src/lib/stores/consent.test.ts) gains one final assertion: after `grant("local")` runs to completion, the `track` mock's call argument is `{ name: "consent.granted", scope: "local", sessionId: <UUID> }` — checked structurally with `expect.objectContaining(...)` and explicitly asserted to NOT contain any of the keys `["photo", "blob", "file", "fileName", "imageBitmap", "bytes", "hash"]`.

**AC14 — Full CI gate chain remains green; ESLint exemption is minimal + documented**

Given AGENTS.md §6 binds the CI gate chain,
When the developer ships this story,
Then `pnpm typecheck`, `pnpm lint`, `pnpm test:unit`, `pnpm test:storybook`, `pnpm test:e2e --project=chromium`, `pnpm build`, `pnpm size-limit`, `pnpm check:stories` all pass:

- `pnpm typecheck`: zero errors. The extended `ARProvider` contract compiles; `useConsentStore` typing is sound; `ConsentRecord` is consumed by both AC4 and AC5 with no `any` casts.
- `pnpm lint`: zero violations. The `no-restricted-syntax` rule blocks `<input type="file">` everywhere **except** the single path added to its `ignores` list — `src/components/render/PhotoUploader.tsx`. Any future story that tries to add `<input type="file">` elsewhere fails lint. **The `PhotoUploader.test.tsx` file does not render the raw JSX outside of the component** (testing-library APIs accept the rendered DOM element, not the JSX literal), so the test file does NOT need exemption. Verify this assumption; if the test file accidentally triggers the rule, add it to the same `ignores` entry in the same commit.
- `pnpm test:unit`: every new `.test.{ts,tsx}` passes; existing 192 unit tests from Stories 1.1–1.5 stay green; coverage on `src/lib/**` remains ≥70% (NFR39). The new `src/lib/security/`, `src/lib/stores/`, `src/lib/copy/`, `src/lib/schemas/` files each ship colocated tests; coverage should trend up.
- `pnpm test:storybook`: addon-vitest run picks up the new `PhotoUploader.stories.tsx` + `ConsentPrompt.stories.tsx` (story count grows from 30 to ~32-33 depending on per-component story variants). Every story passes a11y with zero violations.
- `pnpm test:e2e`: the new `consent-flow.spec.ts` passes (or `test.fixme` cleanly if fixtures are still pending). All previous specs (Story 1.4 `keyboard-only`, Story 1.5 `janelle`) stay green.
- `pnpm build`: production build compiles. Bundle delta vs Story 1.5's 171.28 KB initial bundle is bounded by the new `src/components/render/{PhotoUploader,ConsentPrompt}.tsx`, the consent state machine, the Zustand store, and the copy module — none of which import MediaPipe at the React-tree level (the `ar` provider is held by the store seam). Document the actual delta in dev notes. The MediaPipe FaceLandmarker code path is loaded only by `MockARProvider`, which already lives in the test-route chunk by Story 1.5's size-limit configuration.
- `pnpm size-limit`: bundle ≤300 KB gzipped (NFR8). MediaPipe excluded per [.size-limit.cjs](../../sb-tryon/.size-limit.cjs).
- `pnpm check:stories`: exit 0 — the two new components have sibling stories.

## Tasks / Subtasks

- [x] **Task 1: Author the consent state machine + Zustand store + copy module** (AC3, AC4, AC7, AC8)
  - [x] Create [src/lib/security/consent-state.ts](../../sb-tryon/src/lib/security/consent-state.ts) + sibling test.
  - [x] Create [src/lib/stores/consent.ts](../../sb-tryon/src/lib/stores/consent.ts) + sibling test. Verify `zustand` is already a dep (it is per [package.json](../../sb-tryon/package.json)); if not, fail loudly.
  - [x] Create [src/lib/copy/consent.ts](../../sb-tryon/src/lib/copy/consent.ts) + sibling test (frozen-object + literal-string regression guards).
  - [x] All three files ship with axe-irrelevant unit coverage only (no React, no JSX in these files).

- [x] **Task 2: Add Zod (if not present) and the consent schema** (AC5, AC8)
  - [x] Run `pnpm list zod` to verify presence. Architecture step 3 lists `zod` among the foundational deps but it isn't currently in [package.json](../../sb-tryon/package.json) — install via `pnpm add zod` if absent (latest stable, e.g. `^3.25.x` at story creation; verify with `pnpm view zod version`).
  - [x] Create [src/lib/schemas/consent.ts](../../sb-tryon/src/lib/schemas/consent.ts) exporting `consentRecordSchema` (Zod) + `type ConsentRecord = z.infer<typeof consentRecordSchema>` matching the AC3 interface.
  - [x] Re-export `ConsentRecord` from [src/lib/security/consent-state.ts](../../sb-tryon/src/lib/security/consent-state.ts) (or move the type to schemas/ and import-back into security/ — pick one as the single source of truth; flag in dev notes).
  - [x] Sibling test asserts: valid record parses; invalid `status: "not-consented"` rejects; non-ISO-8601 `grantedAt` rejects; missing `consentVersion` rejects.

- [x] **Task 3: Extend `ARProvider` contract + `MockARProvider` + `noopArProvider`** (AC9)
  - [x] Update [src/lib/providers/contracts/ar-provider.ts](../../sb-tryon/src/lib/providers/contracts/ar-provider.ts) — add `FaceDetectionResult` interface + `detectFace(image)` method.
  - [x] Update [src/lib/providers/mock/MockARProvider.ts](../../sb-tryon/src/lib/providers/mock/MockARProvider.ts) — add lazy FaceLandmarker init, `detectFace()` impl, dispose() cleanup for the second model.
  - [x] Update [src/lib/persistence/model-cache.ts](../../sb-tryon/src/lib/persistence/model-cache.ts) — add `getCachedFaceLandmarkerModel()` (mirror of `getCachedHairSegmentationModel()` pattern from Story 1.5).
  - [x] Update [src/lib/providers/mock/MockARProvider.test.ts](../../sb-tryon/src/lib/providers/mock/MockARProvider.test.ts) — 3 new tests (face-detected, no-face, post-dispose).
  - [x] Update [src/lib/persistence/model-cache.test.ts](../../sb-tryon/src/lib/persistence/model-cache.test.ts) — analogous 3 tests for the face model cache path.
  - [x] Update [src/test-utils/noop-ar-provider.ts](../../sb-tryon/src/test-utils/noop-ar-provider.ts) — add `detectFace` returning `{ faceDetected: true, confidence: 1 }`, with options knob for `faceDetected: false` override.
  - [x] Update [src/test-utils/noop-ar-provider.test.ts](../../sb-tryon/src/test-utils/noop-ar-provider.test.ts) — cover the new method + the knob override.
  - [x] Update [src/lib/providers/contracts/index.test.ts](../../sb-tryon/src/lib/providers/contracts/index.test.ts) `IMPLEMENTED_SLOTS` allowlist if necessary — but since `ar` is already in the allowlist, no change should be needed. Verify.

- [x] **Task 4: Extend telemetry track.ts for consent events** (AC6, AC13)
  - [x] Update [src/lib/observability/track.ts](../../sb-tryon/src/lib/observability/track.ts) — extend `TrackedEvent` union with the two new variants.
  - [x] Update [src/lib/observability/track.test.ts](../../sb-tryon/src/lib/observability/track.test.ts) — 2 new test cases covering `consent.granted` and `consent.declined`.

- [x] **Task 5: Stub Route Handler at `/api/consent/grant`** (AC5)
  - [x] Create [src/app/api/consent/grant/route.ts](../../sb-tryon/src/app/api/consent/grant/route.ts) — POST handler, Zod validation, console.info log, 201 / 422.
  - [x] Create [src/app/api/consent/grant/route.test.ts](../../sb-tryon/src/app/api/consent/grant/route.test.ts) — Vitest, direct handler import, 4 cases (success, missing status, invalid date, status=not-consented rejection).
  - [x] Verify the route file is ≤150 lines (AGENTS.md §3 hard rule).

- [x] **Task 6: Build `<PhotoUploader>` + `<ConsentPrompt>` components** (AC1, AC2, AC10, AC11)
  - [x] Create [src/components/render/ConsentPrompt.tsx](../../sb-tryon/src/components/render/ConsentPrompt.tsx) + sibling test + sibling story.
  - [x] Create [src/components/render/PhotoUploader.tsx](../../sb-tryon/src/components/render/PhotoUploader.tsx) + sibling test + sibling story.
  - [x] Both files mark `"use client"` (they use hooks: `useState`, `useRef`, `useProvider`, `useConsentStore`).
  - [x] Confirm axe-core sibling tests pass.

- [x] **Task 7: Add ESLint exemption for the PhotoUploader file-input JSX** (AC1, AC14)
  - [x] Update [eslint.config.mjs](../../sb-tryon/eslint.config.mjs) — the `no-restricted-syntax` rule block (~line 96-109) gains an `ignores: ["src/components/render/PhotoUploader.tsx"]` array on the same config object. Document the exemption in a comment.
  - [x] Verify `pnpm lint` passes both before AND after adding the file-input JSX to `PhotoUploader.tsx`. (Before: the rule has no JSX to fire against; after: the rule fires only outside the exempt path. To validate, transiently add `<input type="file" />` to a non-exempt file like `src/app/page.tsx`, confirm `pnpm lint` fails with the expected message, then revert in the same commit. Or document the inspection-only path as Story 1.5 did for the `@mediapipe/*` rule.)

- [x] **Task 8: Wire the e2e consent-flow spec** (AC12)
  - [x] Decide harness route: recommended new `src/app/(test)/test/photo-upload-smoke/{page.tsx,client.tsx}` analogous to Story 1.5's AR smoke harness. Gated by `process.env.NEXT_PUBLIC_TEST_HARNESS === "1"` (already set in [playwright.config.ts](../../sb-tryon/playwright.config.ts)).
  - [x] Add a second copyright-clear face fixture to [e2e/fixtures/photos/](../../sb-tryon/e2e/fixtures/photos/) and update its [README.md](../../sb-tryon/e2e/fixtures/photos/README.md) license inventory. If no fixture is available, mark the spec `test.fixme` so the suite passes-skip until a fixture lands (mirrors Story 1.5's pattern).
  - [x] Replace [e2e/consent-flow.spec.ts](../../sb-tryon/e2e/consent-flow.spec.ts) with the FR46 invariant test per AC12.

- [x] **Task 9: Verify full CI gate chain green** (AC14)
  - [x] Run `pnpm typecheck && pnpm lint && pnpm test:unit && pnpm test:storybook && pnpm test:e2e --project=chromium && pnpm build && pnpm size-limit && pnpm check:stories`.
  - [x] Capture the bundle delta vs Story 1.5 baseline (171.28 KB initial) in dev notes.
  - [x] Capture the coverage on `src/lib/**` in dev notes.

## Dev Notes

### Why this story exists (FR1 + FR46 commit point)

Story 1.6 is the **first user-facing surface** in Epic 1. Stories 1-1 through 1-5 delivered the architectural scaffold (Next.js + shadcn, provider contracts, OKLCH design tokens + primitives, layout shells, MediaPipe AR pipeline). All of that is invisible to Maya. Story 1.6 is the moment Maya actually drops her photo in and sees the system respond. Two product invariants make this surface load-bearing:

1. **FR1**: the entire AR demo is gated on a successful photo upload. Without `<PhotoUploader>`, none of stories 1.7–1.10 (render, fade, lighting, route composition) can run end-to-end.
2. **FR46 + cross-cutting concern #2**: this is the **only** surface that ever touches a biometric `Blob`. The biometric privacy posture (BIPA / TX CUBI / GDPR) lives or dies here. Re-prompting consent on every upload is the explicit FR46 invariant — implementing implicit re-consent (e.g. "remembered choice for this session") would be a regulatory-compliance regression even though it looks like an ergonomic feature.

The `<ConsentPrompt>` Dialog is intentionally the heaviest UI element in Epic 1. Per UX spec §"Modal Dialogs", non-dismissable overlays are reserved for legally-required moments — ESC disabled, outside-click disabled, no close button. The user MUST make an explicit choice. That weight is the design — it's the user's commitment, not an interruption.

### Architecture decisions inherited (binding)

- **Cross-cutting concern #1 (Provider-vendor coupling)**: `@mediapipe/tasks-vision` Face Landmarker stays inside `MockARProvider`. The contract gains `detectFace()`; component code uses `useProvider("ar").detectFace()`. AGENTS.md §1 #1.
- **Cross-cutting concern #2 (Biometric privacy)**: photo `Blob` lives in `useRef<Blob | null>`, never in Zustand, never in IndexedDB. Consent records contain `sessionId` only — no photo-derived data. AGENTS.md §1 #2.
- **State tier ownership (Architecture §"State Management")**: consent state lives in the Zustand `useConsentStore`. The active photo `Blob` lives as a React ref (in-memory only). The granted consent record is server-state (Production V1 audit log) — POSTed via `fetch`, no TanStack Query caching needed for a write-only audit endpoint.
- **AGENTS.md §5 Zustand naming**: actions are imperative verbs (`grant`, `decline`, `reset`, `promptShown`). Selectors are direct field access. The store stays small (≤10 actions/fields — currently 4 fields + 4 actions; under budget).
- **AGENTS.md §5 OTel event naming**: `consent.granted` / `consent.declined` — past-tense, namespaced. No PII in payloads.
- **AGENTS.md §4 API format**: success → bare data (the echoed `ConsentRecord` as the 201 body). Failure → `{ error: { code, message, details? } }` envelope.
- **AGENTS.md §6 ESLint**: the `no-restricted-syntax` rule on `<input type="file">` is the architecture-mandated consent gate. Story 1.6 adds the minimum-viable exemption (one file path) and documents it inline in `eslint.config.mjs`.
- **AGENTS.md §1 #10 Density variant**: `<ConsentPrompt>` reads from the cascade. The consumer route group (Story 1.10's `/try-on`) is `density-comfortable`; the prompt inherits without prop drilling.

### MediaPipe Face Landmarker API quick reference

- **Package:** `@mediapipe/tasks-vision` — same package as Story 1.5; **no new vendor dep**. The face landmarker is a separate class export.
- **Class:** `FaceLandmarker` — single-image inference via `.detect(image)` (synchronous on IMAGE running mode, same surface as `ImageSegmenter.segment`).
- **Model URL:** `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task` (≈4 MB). Cached in IndexedDB analogous to Story 1.5's hair segmentation model.
- **Result shape:** `result.faceLandmarks: NormalizedLandmark[][]` — outer array indexed by face count; inner array is 478 landmark points per face. For Story 1.6 we only check `result.faceLandmarks.length > 0` (presence detection).
- **Initialization parity:** the WASM `FilesetResolver` is the same instance as `ImageSegmenter` — pin to the same `@mediapipe/tasks-vision@0.10.35` CDN URL (matches the [package.json](../../sb-tryon/package.json) installed version Story 1.5 settled on).
- **Reference docs:** [Face Landmarker guide for web](https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker/web_js), [Face Landmarker task model docs](https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker).

### Files being touched in this story

#### NEW — consent state + store + copy + schema (no JSX)

```
sb-tryon/src/lib/security/
├── consent-state.ts                      # NEW — pure state machine + ConsentRecord type + LEGAL_TRANSITIONS
└── consent-state.test.ts                 # NEW

sb-tryon/src/lib/stores/
├── consent.ts                            # NEW — Zustand store: useConsentStore
└── consent.test.ts                       # NEW

sb-tryon/src/lib/copy/
├── consent.ts                            # NEW — BIPA/CUBI/GDPR approved language (frozen object)
└── consent.test.ts                       # NEW

sb-tryon/src/lib/schemas/
├── consent.ts                            # NEW — Zod schema for ConsentRecord
└── consent.test.ts                       # NEW
```

#### NEW — components (with sibling tests + stories)

```
sb-tryon/src/components/render/
├── PhotoUploader.tsx                     # NEW — Client Component
├── PhotoUploader.test.tsx                # NEW — renderWithProviders + axe
├── PhotoUploader.stories.tsx             # NEW — at minimum Default/Error/WithPhotoLoaded
├── ConsentPrompt.tsx                     # NEW — Client Component, Radix Dialog
├── ConsentPrompt.test.tsx                # NEW
└── ConsentPrompt.stories.tsx             # NEW
```

#### NEW — Route Handler stub

```
sb-tryon/src/app/api/consent/grant/
├── route.ts                              # NEW — POST stub; logs to console; returns 201/422
└── route.test.ts                         # NEW — Vitest, direct handler import
```

#### NEW — e2e test harness (recommended)

```
sb-tryon/src/app/(test)/test/photo-upload-smoke/
├── page.tsx                              # NEW — Server Component, gated by NEXT_PUBLIC_TEST_HARNESS=1, returns notFound() otherwise
└── client.tsx                            # NEW — Client wrapper rendering <PhotoUploader>
```

#### UPDATED — provider contract + mock + test utility + telemetry + model cache

```
sb-tryon/src/lib/providers/contracts/
└── ar-provider.ts                        # UPDATED — add detectFace() + FaceDetectionResult

sb-tryon/src/lib/providers/mock/
├── MockARProvider.ts                     # UPDATED — add FaceLandmarker lazy init + detectFace() + dispose cleanup
└── MockARProvider.test.ts                # UPDATED — 3 new tests

sb-tryon/src/lib/persistence/
├── model-cache.ts                        # UPDATED — add getCachedFaceLandmarkerModel()
└── model-cache.test.ts                   # UPDATED — analogous tests

sb-tryon/src/test-utils/
├── noop-ar-provider.ts                   # UPDATED — add detectFace() + faceDetected option knob
└── noop-ar-provider.test.ts              # UPDATED

sb-tryon/src/lib/observability/
├── track.ts                              # UPDATED — extend TrackedEvent with consent.granted + consent.declined
└── track.test.ts                         # UPDATED
```

#### UPDATED — ESLint + e2e

```
sb-tryon/eslint.config.mjs                # UPDATED — add ignores["src/components/render/PhotoUploader.tsx"] to no-restricted-syntax block

sb-tryon/e2e/
├── consent-flow.spec.ts                  # UPDATED — replaces 5-line placeholder with FR46 spec
└── fixtures/photos/README.md             # UPDATED — license entry for the second fixture (if added)
```

#### UPDATED — package.json (if zod is missing)

```
sb-tryon/package.json                     # UPDATED — pnpm add zod (if not present)
sb-tryon/pnpm-lock.yaml                   # UPDATED — lockfile follows
```

### Existing UPDATE-target file content (must preserve / extend, not rewrite)

#### [src/lib/providers/contracts/ar-provider.ts](../../sb-tryon/src/lib/providers/contracts/ar-provider.ts) (current 17 lines, Story 1.2)

Currently exports `SegmentationResult` + `ARProvider` interface with `prewarm`, `segment`, `dispose`. The Story 1.6 update **adds** `FaceDetectionResult` and **adds** `detectFace(image)` to the interface — does NOT touch the existing exports or method signatures. Pure extension; no breakage of Story 1.5's `MockARProvider`, `noopArProvider`, or `ArProbe`.

#### [src/lib/providers/mock/MockARProvider.ts](../../sb-tryon/src/lib/providers/mock/MockARProvider.ts) (current 195 lines, Story 1.5)

The existing class implements `prewarm`, `segment`, `dispose` against `ImageSegmenter`. Story 1.6 **adds**:

1. A second private field `private faceLandmarker: FaceLandmarker | null = null` and `private faceModelBlobUrl: string | null = null`.
2. A second prewarm-promise field `private facePrewarmPromise: Promise<{ landmarker: FaceLandmarker; modelBlobUrl: string }> | null = null` — mirror the same in-flight-promise idempotence pattern Story 1.5 settled on (per the code review patches).
3. A `private async loadFaceLandmarker()` method paralleling the existing `private loadSegmenter()`.
4. A `detectFace(image: ImageBitmap): Promise<FaceDetectionResult>` public method paralleling the existing `segment(image)`. **Idempotence + dispose lifecycle parity**: lazy-bootstrap the face model on first call; throw `ProviderError("DISPOSED", ...)` post-dispose; clear the prewarm-promise on rejection so retries don't replay the cached failure.
5. The existing `dispose()` is **extended** to also close the FaceLandmarker and revoke its model Blob URL.

**Hard preservation requirements** (regressions here would break Story 1.5's tests):

- The `segment()` signature, behavior, and telemetry emission are unchanged.
- The existing `prewarm()` does NOT chain in the face model load — recommended default is lazy on first `detectFace()`. If the developer chooses to chain (alternative discussed in AC9), update the relevant Story 1.5 tests to expect the second `createFromOptions` call and document the choice in dev notes.
- The `track({ name: "tryon.segmentation_completed", ... })` event fires on the segment success path only — the existing Story 1.5 patch for the success-only telemetry guard must NOT regress. The face-detection path does **not** emit a `face.detection_completed` telemetry event — face detection is part of upload validation, not part of the render-perf NFR1 budget; if a future story wants the timing, add the event then.

#### [src/lib/persistence/model-cache.ts](../../sb-tryon/src/lib/persistence/model-cache.ts) (current Story 1.5 single-model wrapper)

Extends with a second `getCachedFaceLandmarkerModel()` function that mirrors the existing `getCachedHairSegmentationModel()` exactly. **Different IndexedDB key** (`face_landmarker` vs `selfie_multiclass_256x256`) and **different URL** (`face_landmarker.task` vs `selfie_multiclass_256x256.tflite`) — keep the shared `openDb` / `idbGet` / `idbPut` helpers DRY by factoring them once and parameterizing on `{ cacheKey, modelUrl }` if the file approaches the ~120-line cutoff. Recommended: refactor the existing helper into a generic `getCachedModel({ cacheKey, modelUrl })` and have both public functions delegate. The IndexedDB quota-exceeded graceful fallback added by the Story 1.5 patch must be preserved in the generic helper.

#### [src/test-utils/noop-ar-provider.ts](../../sb-tryon/src/test-utils/noop-ar-provider.ts) (current Story 1.5)

Add `detectFace` to the returned `ARProvider` object. The `NoopArProviderOptions` interface gains an optional `faceDetected?: boolean` field (default `true`) so component tests for `<PhotoUploader>`'s `error` state can spawn a "no face" variant via `renderWithProviders(<PhotoUploader ... />, { providers: { ar: noopArProvider({ faceDetected: false }) } })`. **Preserve the existing per-call fresh `Uint8ClampedArray` cloning** (the Story 1.5 patch) — if you add `detectFace`, do NOT cache its `FaceDetectionResult` across calls; return a fresh object each invocation.

#### [src/lib/observability/track.ts](../../sb-tryon/src/lib/observability/track.ts) (current 27 lines, Story 1.5)

Pure extension of the `TrackedEvent` discriminated union. The `track()` function body is unchanged — it serializes whatever payload it gets. The two new event variants are stable contracts (AGENTS.md §5) — renaming after this story requires a deprecation window.

#### [eslint.config.mjs](../../sb-tryon/eslint.config.mjs) (current Story 1.2 + 1.3 + 1.4)

The `no-restricted-syntax` config block (around line 96-109) blocks `<input type="file">` JSX in `src/**/*.{ts,tsx}` with no exemptions. Story 1.6 adds **one path** to a new `ignores` array on that config object:

```javascript
{
  files: ["src/**/*.{ts,tsx}"],
  ignores: ["src/components/render/PhotoUploader.tsx"],  // NEW — Story 1.6
  rules: {
    "no-restricted-syntax": [ ... ],
  },
},
```

The `<input type="file">` exemption is **deliberately narrow** — it's the only place the JSX is allowed across the entire codebase. Document the reason inline with a comment matching the existing comment style for the architecture-rule blocks.

#### [e2e/consent-flow.spec.ts](../../sb-tryon/e2e/consent-flow.spec.ts) (current 5-line placeholder)

Currently: `test("placeholder — consent flow implemented in Story 1.6", () => { expect(true).toBe(true); });`. Story 1.6 fully replaces this with the AC12 spec. **The placeholder filename + import shape is exactly what Story 1.1's CI config expects** ([package.json](../../sb-tryon/package.json) e2e test glob, [playwright.config.ts](../../sb-tryon/playwright.config.ts) testDir) — preserve the file location.

### Previous story intelligence (Story 1.5 learnings)

Story 1.5's review surfaced 13 patches + 4 decision-needed items. The patterns to replicate / avoid in Story 1.6:

- **In-flight promise idempotence**: Story 1.5 `prewarm()` settled on caching the in-flight promise and clearing it on rejection so retries succeed. Story 1.6's face model load applies the same pattern. (Story 1.5 patch: prewarmPromise rejection clear.)
- **Dispose-during-load race**: Story 1.5 found a race where `dispose()` could run while `loadSegmenter()` was in-flight, leaking a freshly-created segmenter. Story 1.6's face landmarker load needs the same `if (this.disposed) { freshlyLoaded.close(); throw ... }` guard.
- **Per-call cloning of returned mutable state**: Story 1.5's noopArProvider was patched to clone its `Uint8ClampedArray` per call. Story 1.6's `noopArProvider.detectFace()` returns a fresh object literal each call — no shared mutable state.
- **NaN propagation**: Story 1.5 found `clamp01(NaN) === NaN` silently rendering hair as black. Story 1.6's face detection has no math — no risk of this — but the consent state machine's `transition()` should treat unknown status values defensively. Use `keyof typeof LEGAL_TRANSITIONS` to constrain the input at the type level.
- **Best-effort POSTs swallow rejections without UI block**: Story 1.6's `useConsentStore.grant()` does the same — `.catch(console.error)` on the fetch; the user is not blocked by an audit-log network failure. Matches AGENTS.md §6 "No silent catches" — the rejection IS logged to OTel-bound `console.error`, just not surfaced as a user-blocking error.
- **Test harness routes go under `src/app/(test)/test/*`**: Story 1.5 chose `(test)` as a route group prefix. Story 1.6 follows the same convention: `src/app/(test)/test/photo-upload-smoke/page.tsx`. The `(test)` group is **not** the existing `(consumer)`/`(operator)`/`(stylist)` set.
- **`test.fixme` over CI-failing absent fixtures**: Story 1.5 marked Janelle smoke `test.fixme` when no Type-4 photo was committed. Story 1.6 follows the same pattern if `e2e/fixtures/photos/face-fixture-1.png` isn't yet committed.

### Architecture & UX Source References

- Story ACs (canonical): [epics.md — Story 1.6](../planning-artifacts/epics.md) §"Epic 1 → Story 1.6".
- FR1 + FR46: [prd.md §"Functional Requirements"](../planning-artifacts/prd.md).
- NFR13 (immutable timestamped consent records): [prd.md §"Non-Functional Requirements"](../planning-artifacts/prd.md).
- UX-DR4 (PhotoUploader + ConsentPrompt specs): [ux-design-specification.md §"`/components/render/*`"](../planning-artifacts/ux-design-specification.md).
- Architecture §"Consent / biometric privacy" (cross-cutting concern #2 mechanics): [architecture.md §"Process Patterns — Consent"](../planning-artifacts/architecture.md).
- Architecture §"Project Structure" (file paths for `src/lib/security/`, `src/lib/stores/`, `src/lib/copy/`, `src/lib/schemas/`, `src/app/api/consent/grant/`): [architecture.md §"Complete Project Directory Structure"](../planning-artifacts/architecture.md).
- AGENTS.md cross-cutting concerns + ESLint rule + Required wrappers table: [sb-tryon/AGENTS.md](../../sb-tryon/AGENTS.md).
- Story 1.2 provider contract + factory + ESLint rule: [1-2-define-9-provider-contracts-factory-providerscontext-eslint-enforcement.md](./1-2-define-9-provider-contracts-factory-providerscontext-eslint-enforcement.md).
- Story 1.3 UI primitives (Dialog, RadioGroup, Button, Label) + `renderWithProviders`: [1-3-implement-oklch-design-tokens-foundation-primitives-storybook-axe-core.md](./1-3-implement-oklch-design-tokens-foundation-primitives-storybook-axe-core.md).
- Story 1.4 layout primitives (`ErrorBanner`, `HonestEmptyState`): [1-4-build-cross-cutting-layout-shells.md](./1-4-build-cross-cutting-layout-shells.md).
- Story 1.5 MockARProvider + ARProvider contract surface + noopArProvider + ArProbe + test harness pattern: [1-5-implement-mediapipe-tasks-vision-mockarprovider-segmentation-pipeline.md](./1-5-implement-mediapipe-tasks-vision-mockarprovider-segmentation-pipeline.md).
- MediaPipe Face Landmarker web JS guide: [https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker/web_js](https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker/web_js).
- `@mediapipe/tasks-vision` on npm (same package as Story 1.5): [https://www.npmjs.com/package/@mediapipe/tasks-vision](https://www.npmjs.com/package/@mediapipe/tasks-vision).

### Project Structure Notes

- All work happens inside `sb-tryon/`. The `_bmad-output/` directory is documentation-only.
- This story creates **4 new directories** under `src/lib/`: `src/lib/security/`, `src/lib/stores/`, `src/lib/copy/`, `src/lib/schemas/`. Each follows the colocation convention (every `.ts` has a sibling `.test.ts`).
- This story creates **1 new directory** under `src/app/api/`: `src/app/api/consent/grant/`. Route handler + colocated Vitest test (NOT Playwright — direct handler import is faster + more deterministic than a network round-trip).
- This story creates **1 new route group route** if Task 8 takes the recommended path: `src/app/(test)/test/photo-upload-smoke/{page.tsx,client.tsx}`. The `(test)` group is **already used by Story 1.5** for `/test/ar-smoke` — no new group, just a new route inside it.
- This story creates **2 new components** under `src/components/render/`: `PhotoUploader.tsx` + `ConsentPrompt.tsx`. Both ship sibling `.test.tsx` and `.stories.tsx`. The directory already contains `ArProbe.{tsx,test.tsx,stories.tsx}` from Story 1.5 — Story 1.6 adds to it, doesn't replace.
- `pnpm check:stories` continues to enforce — every new component file needs a story sibling.

### Cross-cutting concerns checklist

- ☐ **#1 Provider-vendor coupling**: `@mediapipe/tasks-vision` Face Landmarker stays inside `MockARProvider`. ESLint rule from Story 1.2 enforces — verified by grep before/after the change. AGENTS.md §1 #1.
- ☐ **#2 Biometric privacy**: photo `Blob` lives in `useRef<Blob | null>` inside `PhotoUploader`; never persisted, never in Zustand. Consent records contain `sessionId` (UUID v4) only — no photo content, no derived hash. Telemetry payloads contain `sessionId` + `scope` only. AC13 enforces. AGENTS.md §1 #2.
- ☐ **#3 Single codebase no fork**: the Demo V1 stub at `/api/consent/grant` logs to console; Production V1 Story 8.2 replaces the handler body with an audit-log write. No demo-only UI elements. AGENTS.md §1 #3.
- ☐ **#4 State tier ownership**: consent status in Zustand (`useConsentStore`), photo Blob in React ref, audit record POSTed to server. No state-tier leakage. AGENTS.md §1 #4.
- ☐ **#5 Source attribution**: N/A this story (no review surfaces touched).
- ☐ **#6 Empty states**: `<PhotoUploader>`'s `empty` state uses `consentCopy.uploader.emptyStateHeading` — not a fallback "Coming soon". Not via `<HonestEmptyState>` (which is for content surfaces) but via the same plain-language pattern. AGENTS.md §1 #6.
- ☐ **#7 Equal-weight exit affordances**: N/A this story (no render surface — Story 1.7 carries this).
- ☐ **#8 Test colocation**: every new `.ts(x)` ships a sibling `.test.ts(x)` in the same directory. No `__tests__/` directories. AGENTS.md §1 #8.
- ☐ **#9 Storybook colocation**: `PhotoUploader.tsx` ↔ `PhotoUploader.stories.tsx`, `ConsentPrompt.tsx` ↔ `ConsentPrompt.stories.tsx`. `pnpm check:stories` enforces. AGENTS.md §1 #9.
- ☐ **#10 Density variant**: `<ConsentPrompt>` inherits density from the route's CSS variable cascade (`/try-on` is in the `(consumer)/` group → `density-comfortable`). No `density` prop on either component. AGENTS.md §1 #10.

### Performance budget impact

- **No new MediaPipe import in component code** — the FaceLandmarker is held by `MockARProvider`, which is already chunked into the test-route bundle by Story 1.5's `.size-limit.cjs` configuration. The component code itself adds:
  - `<PhotoUploader>` + `<ConsentPrompt>` JSX (~200-300 lines each gzipped)
  - Zustand store + consent state machine + Zod schema + copy module (~3 KB combined gzipped, rough estimate)
- **Expected delta**: +3-8 KB on the initial bundle vs Story 1.5's 171.28 KB baseline (NFR8 budget is ≤300 KB). Document the actual delta in dev notes.
- **First-photo latency**: the face landmarker model is ~4 MB and lazy-loads on the first `detectFace()` call. The first upload attempt will have a noticeable delay (~1-2 seconds on a fast connection, ~5-8 seconds on mobile). UX-DR4 calls for "uploading" + "validating" states with a skeleton — that's the loading affordance the user sees. Subsequent uploads in the same session use the cached model (instant). NFR1 (≤500ms laptop / ≤800ms mobile) applies to **render**, not **upload validation** — but the UX still needs the skeleton state to make the latency feel intentional rather than broken.

### Decisions left to the developer (with recommended defaults)

These are flagged so the dev agent doesn't churn on them; pick the recommended default unless there's a clear reason not to.

1. **Face landmarker model: full task file vs. blendshape-only**. Recommended: full `face_landmarker.task` (the simpler URL). Trade-off: ~4 MB vs ~2 MB (blendshape-only). Story 1.6 only uses face presence, so the slimmer model would be sufficient — but the larger one keeps the door open for future face-aligned color render without a second model swap. Pick the simpler URL; revisit if size-limit pressure forces it.
2. **Zod presence**. Architecture mentions zod but [package.json](../../sb-tryon/package.json) currently shows it's NOT installed. Task 2 starts with a `pnpm list zod` check. If missing: `pnpm add zod@^3.25` (latest stable at story creation; verify with `pnpm view zod version`).
3. **`ConsentRecord` source-of-truth location**. Recommended: define the Zod schema in [src/lib/schemas/consent.ts](../../sb-tryon/src/lib/schemas/consent.ts) and `export type ConsentRecord = z.infer<typeof consentRecordSchema>`. Re-export from `src/lib/security/consent-state.ts`. Alternative: define the TypeScript interface in `consent-state.ts` and write the Zod schema against it. Either works; the schema-first path keeps the validator and the type in lockstep automatically.
4. **Generic vs duplicated model-cache helper**. Recommended: factor `getCachedModel({ cacheKey, modelUrl })` once, have both `getCachedHairSegmentationModel()` and `getCachedFaceLandmarkerModel()` delegate. The Story 1.5 code review patches must be preserved in the generic helper.
5. **e2e harness: reuse `/test/ar-smoke` vs new `/test/photo-upload-smoke`**. Recommended: new harness. The AR smoke harness is for direct provider invocation; the photo-upload smoke harness mounts the full component. Cleaner separation.
6. **Lazy face model load vs chained into `prewarm()`**. Recommended: lazy on first `detectFace()`. The `prewarm()` cost is already paid for the segmenter model; chaining the face model would double it and slow the user's first interaction. The downside is the first upload's "validating" state will be longer — UX-DR4's skeleton state covers this. Revisit during demo dry-run.
7. **e2e cross-browser scope for `consent-flow.spec.ts`**. Recommended: chromium-only (matches Story 1.5's Janelle decision). MediaPipe in WebKit/Firefox CI runners is flaky; the consent invariant is browser-agnostic, but we don't need three runs to prove it.
8. **`<PhotoUploader>`'s `error` state announcement**. Recommended: `aria-live="polite"`, not `assertive` — the error is a recoverable validation result, not a blocking failure. UX spec §"Accessibility" calls out the polite/assertive split.

### Anti-patterns (block merge)

```typescript
// ❌ Importing @mediapipe/tasks-vision from <PhotoUploader> directly
import { FaceLandmarker } from "@mediapipe/tasks-vision";  // ESLint blocks (Story 1.2 rule)

// ❌ Caching consent across uploads (implicit re-consent — FR46 violation)
async grant(scope) {
  if (this.consentStatus === "consented-local") return;  // wrong — silently skips re-prompt
  // ...
}

// ❌ Photo Blob in Zustand
const useTryOnStore = create((set) => ({ activePhoto: null, setPhoto: (b) => set({ activePhoto: b }) }));  // photo must live in a ref

// ❌ Photo Blob in IndexedDB without consent path
async function uploadPhoto(file) { idb.set("activePhoto", file); }  // AGENTS.md §10 anti-pattern

// ❌ Biometric data in telemetry
track({ name: "consent.granted", scope, sessionId, photoBytes: hash(blob) });  // photoBytes violates cross-cutting concern #2

// ❌ Inline string literal for user-visible copy in components
<DialogTitle>Process your photo?</DialogTitle>  // wrong — must read from consentCopy.prompt.title

// ❌ ESC-dismissable ConsentPrompt
<Dialog>
  <DialogContent>{/* user can press ESC and never see the consent UI */}</DialogContent>
</Dialog>
// Correct: <DialogContent onEscapeKeyDown={(e) => e.preventDefault()} onPointerDownOutside={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()} showCloseButton={false}>

// ❌ "Continue" button enabled when no radio is selected
// Radix RadioGroup default-checks an item; the default selection is "local" per architecture. Continue is enabled on mount.

// ❌ Synchronous photo size check that doesn't bail on the validating state
async function onPickFile(file) {
  const bitmap = await createImageBitmap(file);  // expensive; runs even on a 1 GB file
  if (file.size > MAX_PHOTO_BYTES) setState("error");
}
// Correct: validate size FIRST, then createImageBitmap

// ❌ Calling useConsentStore.grant() before opening the dialog
async function onPickFile(file) {
  await useConsentStore.getState().grant("local");  // wrong — consent must be an explicit user choice, not implicit
  openDialog();
}
// Correct: open dialog → user picks option → onConsent callback fires → store.grant() then runs

// ❌ Adding inline eslint-disable comments instead of the config exemption
{/* eslint-disable-next-line no-restricted-syntax */}
<input type="file" />  // wrong — surfaces churn over the audit window
// Correct: add the file path to the ignores array in eslint.config.mjs

// ❌ Logging the photo Blob, file name, or any derivative
console.info("[consent] upload start", { fileName: file.name, size: file.size });  // fileName is user-identifying if the photo is named "selfie.jpg"
// Correct: don't log file names at all; the sessionId is the only audit-correlation identifier
```

### Open Questions / Flag for Review

- **Second fixture photo for `consent-flow.spec.ts`**. AC12 needs at least one face photo (two would be ideal — A then B re-prompt). Story 1.5 left a Type-4 fixture pending Sally's procurement. Story 1.6 can re-use the same fixture (the FR46 invariant is photo-content-agnostic) by passing the same file path twice to `setInputFiles`. **Recommendation**: do this; the FR46 test does NOT need texture diversity. Flag if Sally has a face fixture by the time dev starts.
- **`zod` install vs existing**. Architecture spec says it's a foundational dep; [package.json](../../sb-tryon/package.json) shows it isn't. Task 2 verifies + installs. Flag if installing zod surfaces any peer-dep conflicts.
- **Face landmarker model URL stability**. The "latest" path in the Google Storage URL means we get whatever's there at fetch time. If reproducible builds matter (they don't for Demo V1; they will for Production V1), pin the model to a specific version path. Flag if the URL returns a 404 or a model that no longer parses.
- **`/api/consent/grant` schema-write surface**. Story 8.2 will replace the stub body with a real audit-log write. The schema MUST match what Story 8.2 ships — pre-coordinate by keeping the schema simple (no v1/v2 forks) and shipping the Zod schema in a path Story 8.2 won't need to move (`src/lib/schemas/consent.ts` is correct).
- **Storybook story content for `<ConsentPrompt>`**. Storybook stories render in isolation — the `useConsentStore` is shared module state. If `<ConsentPrompt>` writes to the store on Continue, parallel stories could interfere. **Recommendation**: in `ConsentPrompt.stories.tsx`, render with `useConsentStore.setState(...)` in a story decorator to reset state per render; flag if Storybook's hot-reload makes this flaky.
- **`createImageBitmap` SSR safety**. The function is browser-only. `<PhotoUploader>` is a Client Component (`"use client"` directive), so SSR isn't a concern at render time, but the file-pick handler must not run on a server-bundled path. Verify by `pnpm build` — should compile cleanly. Flag if it errors.
- **AC1 file-input accessibility — visible vs visually-hidden**. UX-DR13 calls for "visible focus ring on the input". Two patterns: (a) keep the native `<input type="file">` visible (browsers render it inconsistently across OSes); (b) hide the input visually but keep it in the focus order (the `<label>` wraps it and provides the visible UI). **Recommendation: (b)** — better UI consistency, matches the modern "drop zone" pattern UX-DR4 expects. The `<label>` element gets `:focus-within` styling for the focus ring. Flag if axe surfaces a contrast issue.

### LLM Optimization Notes

- The dev agent reads these specs top-to-bottom. AC1, AC2, AC3 are tightly coupled — author them in tandem (state machine ↔ store ↔ prompt). AC9 (provider extension) is a precursor to AC1 (uploader needs the extended contract). Recommended task order: Task 1 → Task 2 → Task 3 → Task 4 → Task 5 → Task 6 → Task 7 → Task 8 → Task 9. Tasks 3 + 4 can be parallelized.
- The `consentCopy` module is the single source of truth for every user-visible string in this story. Author it FIRST (Task 1's copy module), reference it everywhere else by import. This collapses one whole class of review findings ("inline string literal in component").
- The `eslint-disable` anti-pattern shows up frequently in dev agents. Story 1.6 needs ONE config-level exemption (Task 7). Don't sprinkle inline disables — surface the exemption in the config.
- Tests for the state machine + Zustand store should be table-driven where the AC enumerates options ("every legal transition...", "every illegal transition..."). Vitest's `it.each(...)` is the idiom.
- The Storybook stories for `<PhotoUploader>` need provider overrides to exercise the `error` state. The `parameters.providers` or a story-local decorator pattern works — check if Story 1.5's `ArProbe.stories.tsx` shows a pattern; if not, document the chosen pattern in dev notes for future stories to copy.

## Dev Agent Record

### Agent Model Used

Claude Opus 4.7 (claude-opus-4-7, 1M context)

### Debug Log References

- Initial `useConsentStore.reset()` threw `ConsentInvariantError` when called from `not-consented` (a self-loop is not listed in `LEGAL_TRANSITIONS`). Fixed by making `reset()` idempotent — early-return if already `not-consented` — keeping the transition table free of self-loops.
- `ConsentPrompt.test.tsx` initially asserted `screen.getByText(/on your device/i)` which matched both the dialog body and the "locally only" option label (`your photo stays on your device`). Tightened the matcher to `/We'll analyze your photo on your device/i` so only the body is hit.
- `vitest.config.ts` `unit` project `include` glob did not cover `src/app/**` — added it so the route-handler test (`src/app/api/consent/grant/route.test.ts`) is picked up.
- `<PhotoUploader>`'s preview switched from raw `<img>` to `next/image` with `unoptimized` so the project's `@next/next/no-img-element` lint rule stays unbroken without an inline `eslint-disable`.

### Completion Notes List

**Decisions (recommended defaults taken):**

1. **Face landmarker model** — full `face_landmarker.task` (single URL, ~4MB) per dev-notes recommendation. Story 1.6 only branches on `faceDetected`, so blendshape parsing is deferred.
2. **`ConsentRecord` source of truth** — Zod schema in `src/lib/schemas/consent.ts`; `src/lib/security/consent-state.ts` re-exports `type ConsentRecord` via `z.infer`. Keeps the validator and the type in lockstep automatically.
3. **Generic model-cache helper** — refactored `getCachedHairSegmentationModel` + new `getCachedFaceLandmarkerModel` to delegate to a private `getCachedModel({ cacheKey, modelUrl, label })`. Story 1.5's IndexedDB-quota graceful-fallback is preserved in the generic helper.
4. **e2e harness** — new `/test/photo-upload-smoke` route gated by `NEXT_PUBLIC_TEST_HARNESS=1` (mirror of Story 1.5's `/test/ar-smoke`). Cleaner separation.
5. **Lazy face-model load** — face landmarker loads on the FIRST `detectFace()` call, NOT during `prewarm()`. The "validating" skeleton state covers the latency.
6. **e2e cross-browser scope** — Chromium-only (matches Story 1.5's Janelle decision).
7. **`error` state announcement** — `aria-live="polite"` (recoverable validation, not blocking).
8. **Photo preview rendering** — `next/image` with `unoptimized` (blob URLs aren't optimizable). Width/height nominal, CSS constrains visual size.

**Bundle delta:** 171.24 KB gzipped (Story 1.5 baseline: 171.28 KB). Essentially flat — the new consent state machine, store, copy, schema, route handler, and components add up to a few hundred bytes after gzip, and Zod ships only the small subset used by the schema.

**Coverage on `src/lib/**`:** 89.83% statements / 79.87% branches / 96.68% functions / 91.68% lines — well above the NFR39 ≥70% threshold. New files (`src/lib/security/consent-state.ts`, `src/lib/stores/consent.ts`, `src/lib/copy/consent.ts`, `src/lib/schemas/consent.ts`) all ≥90%.

**CI gate chain:** typecheck (clean), lint (clean), `test:unit` 275/275 pass + coverage, `test:storybook` 81/81 stories pass (incl. 2 new component stories), `test:e2e --project=chromium` 7 pass + 2 `test.fixme` (Janelle + consent-flow — both gated on the still-pending fixture), `build` succeeds, `size-limit` 171.24 / 300 KB, `check:stories` 32/32.

**FR46 invariant verified** — `useConsentStore.test.ts` asserts that `grant("local")` from `consented-local` throws `ConsentInvariantError` (no implicit re-consent). `<PhotoUploader>.test.tsx` asserts that a second upload after delete re-opens the prompt. The e2e spec at `consent-flow.spec.ts` exercises the same invariant end-to-end (currently `test.fixme` until a face fixture lands).

**Open items for review:**

- Second/dedicated face fixture for `consent-flow.spec.ts` — re-uses `type-4-fixture-1.jpg` (Story 1.5's pending fixture). Spec is `test.fixme` until that lands; FR46 is photo-content-agnostic so any face photo works.
- `crypto.randomUUID()` requires a secure context (HTTPS or localhost). Demo dev environment is localhost; production deploys must serve over HTTPS. No code change needed, just a deployment note.

### File List

**NEW:**
- `sb-tryon/src/lib/security/consent-state.ts` + `.test.ts`
- `sb-tryon/src/lib/stores/consent.ts` + `.test.ts`
- `sb-tryon/src/lib/copy/consent.ts` + `.test.ts`
- `sb-tryon/src/lib/schemas/consent.ts` + `.test.ts`
- `sb-tryon/src/app/api/consent/grant/route.ts` + `.test.ts`
- `sb-tryon/src/components/render/ConsentPrompt.tsx` + `.test.tsx` + `.stories.tsx`
- `sb-tryon/src/components/render/PhotoUploader.tsx` + `.test.tsx` + `.stories.tsx`
- `sb-tryon/src/app/(test)/test/photo-upload-smoke/page.tsx`
- `sb-tryon/src/app/(test)/test/photo-upload-smoke/client.tsx`

**MODIFIED:**
- `sb-tryon/src/lib/providers/contracts/ar-provider.ts` — added `FaceDetectionResult` + `detectFace(image)` to `ARProvider`.
- `sb-tryon/src/lib/providers/index.ts` — re-export `FaceDetectionResult`.
- `sb-tryon/src/lib/providers/mock/MockARProvider.ts` — lazy `FaceLandmarker` bootstrap, `detectFace()`, dispose cleanup for the second model.
- `sb-tryon/src/lib/providers/mock/MockARProvider.test.ts` — 8 new tests for `detectFace()` (face-detected, no-face, dispose lifecycle, in-flight idempotence, rejection retry, dispose cleanup, no telemetry).
- `sb-tryon/src/lib/persistence/model-cache.ts` — refactored into a generic `getCachedModel({ cacheKey, modelUrl, label })`; added `getCachedFaceLandmarkerModel` + `clearCachedFaceLandmarkerModel`.
- `sb-tryon/src/lib/persistence/model-cache.test.ts` — new tests for the face landmarker cache path + cache-key isolation.
- `sb-tryon/src/test-utils/noop-ar-provider.ts` — added `detectFace()` + `faceDetected` option knob.
- `sb-tryon/src/test-utils/noop-ar-provider.test.ts` — 3 new tests for `detectFace()` default + override + per-call freshness.
- `sb-tryon/src/lib/observability/track.ts` — extended `TrackedEvent` with `consent.granted` + `consent.declined` variants.
- `sb-tryon/src/lib/observability/track.test.ts` — 2 new tests + a biometric-payload-key negative assertion.
- `sb-tryon/eslint.config.mjs` — added `ignores: ["src/components/render/PhotoUploader.tsx"]` on the `no-restricted-syntax` config block (the single authorized owner of `<input type="file">`).
- `sb-tryon/e2e/consent-flow.spec.ts` — replaced the 5-line placeholder with the FR46 invariant spec (chromium-only, `test.fixme` until the fixture lands).
- `sb-tryon/e2e/fixtures/photos/README.md` — noted that the FR46 spec re-uses the existing Story 1.5 Type-4 fixture.
- `sb-tryon/vitest.config.ts` — included `src/app/**/*.test.{ts,tsx}` in the unit project so the route-handler test is discovered.
- `sb-tryon/package.json` + `sb-tryon/pnpm-lock.yaml` — added `zod ^4.4.3`.

### Review Findings

Generated: 2026-05-14 | Layers: Blind Hunter · Edge Case Hunter · Acceptance Auditor | Model: claude-sonnet-4-6

#### Decision Needed

- [x] [Review][Decision] FaceLandmarker `delegate: "GPU"` hard-coded — removed delegate flag; MediaPipe auto-selects [MockARProvider.ts]

#### Patches

- [x] [Review][Patch] Second `FilesetResolver` created in `loadFaceLandmarker()` — AC9 explicit "do NOT create a second resolver" violated [sb-tryon/src/lib/providers/mock/MockARProvider.ts]
- [x] [Review][Patch] `WithPhotoLoaded` story missing from `PhotoUploader.stories.tsx` — AC11 requires it at minimum [sb-tryon/src/components/render/PhotoUploader.stories.tsx]
- [x] [Review][Patch] `outside-click does not dismiss` test missing from `ConsentPrompt.test.tsx` — AC11/AC2 required test case [sb-tryon/src/components/render/ConsentPrompt.test.tsx]
- [x] [Review][Patch] Concurrent `handleFile` calls race + objectUrl revoked mid-bitmap — no in-flight guard; later call overwrites `photoRef`/state with stale blob [sb-tryon/src/components/render/PhotoUploader.tsx:101-113]
- [x] [Review][Patch] `handleConsent` shows `errorNoFace` copy on `ConsentInvariantError` — semantically wrong message shown when state machine throws [sb-tryon/src/components/render/PhotoUploader.tsx]
- [x] [Review][Patch] `onPhotoConfirmed` silently skipped when `photoRef.current` nulled between validate and consent — grant fires but parent receives no signal [sb-tryon/src/components/render/PhotoUploader.tsx:138-149]
- [x] [Review][Patch] `ConsentPrompt` carries prior `choice` state on re-open — FR46 re-prompt shows wrong pre-selected radio [sb-tryon/src/components/render/ConsentPrompt.tsx:39]
- [x] [Review][Patch] Continue button not disabled after first click — double-click fires `decline()`/`grant()` twice from terminal state [sb-tryon/src/components/render/ConsentPrompt.tsx]
- [x] [Review][Patch] `ImageBitmap` not closed after `detectFace` — decoded pixel buffer leaks per upload [sb-tryon/src/components/render/PhotoUploader.tsx]
- [x] [Review][Patch] `Object.freeze()` shallow — `consentCopy.uploader` and `.prompt` mutable at runtime; test only checks top-level freeze [sb-tryon/src/lib/copy/consent.ts]
- [x] [Review][Patch] `grant()` TOCTOU — concurrent calls both pass `transition()` before either `set()` writes; state-machine invariant bypassed [sb-tryon/src/lib/stores/consent.ts:54-84]
- [x] [Review][Patch] `fetch` non-ok (4xx/5xx) not caught — server-side audit failure silently dropped [sb-tryon/src/lib/stores/consent.ts:72-78]
- [x] [Review][Patch] `sessionId` validated as `z.string().min(1)` — accepts any single character; tightened to UUID regex [sb-tryon/src/lib/schemas/consent.ts]
- [x] [Review][Patch] `landmarker.detect()` not wrapped in try/catch — synchronous throw escapes `detectFace` without a `ProviderError` [sb-tryon/src/lib/providers/mock/MockARProvider.ts:196-238]
- [x] [Review][Patch] TOCTOU after `facePrewarmPromise` resolves — concurrent `detectFace` can write disposed landmarker if `dispose()` fired mid-await [sb-tryon/src/lib/providers/mock/MockARProvider.ts:203-220]
- [x] [Review][Patch] `NEXT_PUBLIC_TEST_HARNESS` — already set in playwright.config.ts; dismissed as false positive [sb-tryon/playwright.config.ts]
- [x] [Review][Patch] `emptyStateHeading` renders unconditionally — visible above loaded photo in `validating`/`validated`/`error` states [sb-tryon/src/components/render/PhotoUploader.tsx]
- [x] [Review][Patch] `resetStore` test helper omits `consentVersion` — stale value leaks between test suites [sb-tryon/src/lib/stores/consent.test.ts]
- [x] [Review][Patch] `details.field` is `undefined` not `null` in 422 response — JSON.stringify drops the key [sb-tryon/src/app/api/consent/grant/route.ts:30-41]
- [x] [Review][Patch] `decline()` from already-`declined` state — double-click fires `onDeclined` twice [sb-tryon/src/components/render/ConsentPrompt.tsx]

#### Deferred

- [x] [Review][Defer] `getCachedModel` leaks IDB connection on success path — pre-existing pattern; story extends without fixing [sb-tryon/src/lib/persistence/model-cache.ts] — deferred, pre-existing
- [x] [Review][Defer] `openDb()` rejection propagates uncaught when IndexedDB blocked — pre-existing in model-cache [sb-tryon/src/lib/persistence/model-cache.ts] — deferred, pre-existing
- [x] [Review][Defer] `response.arrayBuffer()` rejects mid-stream — pre-existing error path in model-cache [sb-tryon/src/lib/persistence/model-cache.ts] — deferred, pre-existing
- [x] [Review][Defer] `file.type` empty string on Android camera capture — spec says verify MIME; empty MIME → rejected per spec; known Android limitation [sb-tryon/src/components/render/PhotoUploader.tsx] — deferred, pre-existing

### Change Log

- 2026-05-14 — Story 1.6 implemented: consent state machine, Zustand store, BIPA copy module, Zod schema, `/api/consent/grant` stub, `<PhotoUploader>`, `<ConsentPrompt>`, MediaPipe FaceLandmarker integration in `MockARProvider`, FR46 e2e spec scaffold. All CI gates pass; bundle stays at 171.24 KB / 300 KB.

