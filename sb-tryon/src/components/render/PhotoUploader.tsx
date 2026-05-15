"use client";

// <PhotoUploader> — single entry point for photo upload across the app
// (AGENTS.md §6 Required wrappers + AC10). Mounts <ConsentPrompt> on a
// successful face-detection validation; the consent dialog IS the next
// step, not a separate user action (UX-DR4).
//
// FR46 invariant: every fresh upload starts a fresh consent cycle. Delete
// or replace the photo → store.reset() → prompt re-opens on the next valid
// upload. There is no implicit re-consent.

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { useProvider } from "@/lib/providers";
import { useConsentStore } from "@/lib/stores/consent";
import { consentCopy } from "@/lib/copy/consent";
import { ConsentPrompt } from "./ConsentPrompt";

type UploaderState =
  | "empty"
  | "uploading"
  | "validating"
  | "validated"
  | "error";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

export interface PhotoUploaderProps {
  onPhotoConfirmed: (photo: Blob, scope: "local" | "saved") => void;
  onDeclined: () => void;
}

export function PhotoUploader({
  onPhotoConfirmed,
  onDeclined,
}: PhotoUploaderProps) {
  const ar = useProvider("ar");
  const reset = useConsentStore((s) => s.reset);
  const promptShown = useConsentStore((s) => s.promptShown);
  const grant = useConsentStore((s) => s.grant);
  const decline = useConsentStore((s) => s.decline);

  const [state, setState] = useState<UploaderState>("empty");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [promptOpen, setPromptOpen] = useState(false);

  const photoRef = useRef<Blob | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const inFlightRef = useRef(false);

  // Revoke any leftover object URL on unmount so the browser can GC the blob.
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  function clearActivePhoto() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    photoRef.current = null;
    setPreviewUrl(null);
  }

  function handleDelete() {
    clearActivePhoto();
    setState("empty");
    setErrorMessage("");
    setPromptOpen(false);
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleFile(file: File) {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    try {
      await handleFileInner(file);
    } finally {
      inFlightRef.current = false;
    }
  }

  async function handleFileInner(file: File) {
    // Validate size first — bail before doing the expensive createImageBitmap.
    if (file.size > MAX_PHOTO_BYTES) {
      clearActivePhoto();
      setState("error");
      setErrorMessage(consentCopy.uploader.errorTooLarge);
      return;
    }
    // MIME type check on the File object (the input's `accept` attr is
    // advisory only — browsers don't enforce it).
    if (!ACCEPTED_TYPES.includes(file.type as (typeof ACCEPTED_TYPES)[number])) {
      clearActivePhoto();
      setState("error");
      setErrorMessage(consentCopy.uploader.errorBadType);
      return;
    }

    setState("uploading");
    photoRef.current = file;
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = URL.createObjectURL(file);
    setPreviewUrl(objectUrlRef.current);

    let bitmap: ImageBitmap;
    try {
      bitmap = await createImageBitmap(file);
    } catch {
      clearActivePhoto();
      setState("error");
      setErrorMessage(consentCopy.uploader.errorBadType);
      return;
    }

    setState("validating");
    let faceDetected = false;
    try {
      const result = await ar.detectFace(bitmap);
      faceDetected = result.faceDetected;
    } catch {
      setState("error");
      setErrorMessage(consentCopy.uploader.errorNoFace);
      return;
    } finally {
      // ImageBitmap.close() is not available in all environments (e.g. jsdom).
      try { bitmap.close(); } catch { /* no-op */ }
    }
    if (!faceDetected) {
      // Keep the preview so the user sees which photo failed — drop-zone
      // re-arms via the file input.
      setState("error");
      setErrorMessage(consentCopy.uploader.errorNoFace);
      return;
    }

    setState("validated");
    promptShown();
    setPromptOpen(true);
  }

  async function handleConsent(scope: "local" | "saved") {
    setPromptOpen(false);
    try {
      await grant(scope);
    } catch {
      // ConsentInvariantError — the store was in an unexpected state.
      // Reset to let the user start a fresh upload cycle.
      handleDelete();
      return;
    }
    const blob = photoRef.current;
    if (!blob) {
      // Photo was cleared between validation and consent confirmation.
      // Reset so the user can upload again.
      handleDelete();
      return;
    }
    onPhotoConfirmed(blob, scope);
  }

  async function handleDecline() {
    setPromptOpen(false);
    try {
      await decline();
    } catch {
      // Already in a terminal state — fall through to caller.
    }
    onDeclined();
  }

  const hasActivePhoto =
    state === "validating" || state === "validated" || state === "error";

  return (
    <div
      data-uploader-state={state}
      className="flex flex-col gap-4"
    >
      <label
        htmlFor="photo-uploader-input"
        className="flex min-h-48 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-(--color-border-strong) bg-(--color-bg-elevated) p-6 text-center text-base text-(--color-text-secondary) transition-colors duration-(--motion-duration-fast) ease-(--motion-ease) hover:bg-(--color-bg-sunken) focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-(--color-accent-primary)"
      >
        {state === "empty" && <span>{consentCopy.uploader.emptyStateHeading}</span>}
        <input
          ref={fileInputRef}
          id="photo-uploader-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
      </label>

      {state === "uploading" && (
        <div
          className="h-48 w-full animate-pulse rounded-md bg-(--color-bg-sunken)"
          aria-hidden="true"
        />
      )}

      {previewUrl && state !== "uploading" && (
        // `unoptimized` because the source is a blob: URL (the user's photo,
        // not a static asset) — Next/Image's optimizer can't and shouldn't
        // process it. Width/height are nominal hints; CSS `max-h` constrains
        // visual size while preserving the photo's aspect ratio.
        <Image
          src={previewUrl}
          alt=""
          width={400}
          height={400}
          unoptimized
          className="max-h-72 w-auto rounded-md object-contain"
        />
      )}

      {state === "validating" && (
        <p
          aria-live="polite"
          className="inline-flex w-fit items-center rounded-full bg-(--color-bg-sunken) px-3 py-1 text-sm text-(--color-text-secondary)"
        >
          {consentCopy.uploader.validatingPill}
        </p>
      )}

      {state === "error" && (
        <p
          aria-live="polite"
          className="text-base text-(--color-error)"
          data-error-message
        >
          {errorMessage}
        </p>
      )}

      {hasActivePhoto && (
        <Button
          variant="tertiary"
          onClick={handleDelete}
          className="self-start"
        >
          {consentCopy.uploader.deleteAffordance}
        </Button>
      )}

      <ConsentPrompt
        open={promptOpen}
        onOpenChange={setPromptOpen}
        onConsent={(scope) => void handleConsent(scope)}
        onDecline={() => void handleDecline()}
      />
    </div>
  );
}
