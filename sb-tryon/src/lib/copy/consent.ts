// BIPA / TX CUBI / GDPR-approved consent copy. Single source of truth for
// every user-visible string in `<PhotoUploader>` and `<ConsentPrompt>`.
// Inline string literals in those components are blocked by code review
// (AC8) — all copy reads from this module.
//
// UX-DR16 tone & voice: plain language, no marketing voice, no exclamation
// marks, verb-first action labels, no euphemism.

export const consentCopy = Object.freeze({
  uploader: Object.freeze({
    emptyStateHeading: "Upload a clear front-facing photo, even lighting",
    deleteAffordance: "Delete photo",
    validatingPill: "Checking the photo…",
    errorNoFace:
      "We couldn't find a face — try a brighter, front-facing photo",
    errorBadType:
      "That file isn't a photo we can use. Try a JPG, PNG, or WebP.",
    errorTooLarge:
      "That photo is larger than 10 MB. Try a smaller version.",
  }),
  prompt: Object.freeze({
    title: "Process your photo?",
    body:
      "We'll analyze your photo on your device to render the color you picked. " +
      "We never send your photo to a server unless you choose to save it to your account. " +
      "You can change your mind at any time.",
    optionLocalLabel:
      "Process locally only — your photo stays on your device",
    optionSavedLabel:
      "Process and save to my account — you can come back later to compare looks",
    optionDeclinedLabel:
      "Decline — show me a curated reference photo instead",
    continueButton: "Continue",
    radioGroupLabel: "Photo processing choice",
  }),
} as const);
