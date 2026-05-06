"use client";

import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ErrorBannerProps {
  /**
   * Plain-language narration of what failed and what to do next — never the
   * technical exception message. e.g. "We couldn't load your render."
   */
  message: string;
  /**
   * Verb-driven retry label, default "Retry" (industry-standard recovery verb,
   * acceptable per UX-DR16's verb-driven copy rule).
   */
  retryLabel?: string;
  onRetry?: () => void;
  /**
   * Optional dismiss handler. If omitted the banner is non-dismissible
   * (e.g. system-down state).
   */
  onDismiss?: () => void;
  className?: string;
}

/**
 * Non-modal surface error. `role="alert"` (announced) without focus trap.
 * UX spec §"Feedback Patterns" Error surface-level row: full-width banner,
 * dismissible (when `onDismiss` is supplied), with explicit retry. Pair the
 * `message` with what-to-do-next narration, never a raw exception string.
 */
export function ErrorBanner({
  message,
  retryLabel = "Retry",
  onRetry,
  onDismiss,
  className,
}: ErrorBannerProps) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "border-l-4 border-(--color-error) bg-(--color-error)/10 px-4 py-3 mb-6 flex items-center justify-between gap-4 rounded-r-md",
        className,
      )}
    >
      <p className="text-base text-(--color-text-primary) flex-1">{message}</p>
      <div className="flex items-center gap-2 shrink-0">
        {onRetry && (
          <Button
            variant="tertiary"
            size="sm"
            onClick={onRetry}
            // Override tertiary's accent-primary text on the error-tinted
            // backdrop: brand accent on bg-error/10 falls below AA contrast
            // (4.23 vs 4.5 required). text-primary keeps the lowest-visual-
            // weight variant but lifts contrast above AA.
            className="text-(--color-text-primary) underline"
          >
            {retryLabel}
          </Button>
        )}
        {onDismiss && (
          <Button
            variant="tertiary"
            size="sm"
            aria-label="Dismiss"
            onClick={onDismiss}
            className="text-(--color-text-primary)"
          >
            <XIcon className="size-4" aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  );
}
