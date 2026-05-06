"use client";

import type { ComponentProps } from "react";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
} from "@/components/ui/toast";

export interface ToastWithProvenanceProps
  extends Omit<ComponentProps<typeof Toast>, "children"> {
  /**
   * Past-tense outcome statement (UX spec §"Feedback Patterns") — never
   * present-tense, never future-tense. e.g. "Saved to your looks",
   * "Order placed".
   */
  message: string;
  /**
   * Provenance hint — explains where the data lives or what was actually
   * done with it. UX honesty pattern #3. e.g. "stored locally only",
   * "BSG order #4471", "consent recorded — never sent to brands".
   */
  provenance: string;
  /** Show the close affordance. Defaults to true. */
  showClose?: boolean;
}

/**
 * Toast variant that requires a provenance hint alongside the past-tense
 * outcome message. UX honesty pattern #3: every state-change confirmation
 * touching identity data must declare what was actually done with it
 * ("stored locally only", "BSG order #4471", "never sent to brands").
 *
 * Compose with `<ToastProvider>` and `<ToastViewport>` from
 * `@/components/ui/toast` — this component is a thin wrapper around the
 * Radix Toast root, with the provenance line as a `ToastDescription`.
 *
 * Use `<Toast>` directly for non-identity-touching confirmations
 * ("Sorted by newest" doesn't need provenance — it's not privacy-relevant).
 */
export function ToastWithProvenance({
  message,
  provenance,
  showClose = true,
  ...rest
}: ToastWithProvenanceProps) {
  return (
    <Toast {...rest}>
      <div className="grid gap-1">
        <ToastTitle>{message}</ToastTitle>
        <ToastDescription className="italic text-(--color-text-secondary) text-xs">
          {provenance}
        </ToastDescription>
      </div>
      {showClose && <ToastClose />}
    </Toast>
  );
}
