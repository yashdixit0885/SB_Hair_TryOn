import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type EmptyStateAction =
  | { label: string; onClick: () => void }
  | { label: string; href: string };

export interface HonestEmptyStateProps {
  /**
   * REQUIRED. Plain-language description of what would normally be here and
   * (where appropriate) what to do next. No fallback default — the absence of
   * copy is a developer error, not a runtime "Coming soon" placeholder.
   * AGENTS.md §1 cross-cutting concern #6.
   */
  copy: string;
  /**
   * Optional secondary action affordance (e.g. "Save a look") — verb-driven
   * copy required (UX-DR16).
   */
  action?: EmptyStateAction;
  /** Optional icon component rendered above copy at low visual weight. */
  icon?: ReactNode;
  className?: string;
}

/**
 * Empty-state surface that requires intentional, plain-language copy. There
 * is NO fallback "Coming soon" / "Nothing here yet" string — `copy` is a
 * required prop at the type level, and a runtime invariant in dev mode
 * surfaces violations when TypeScript is bypassed (e.g. `as any` spreads).
 *
 * Visual treatment subdues the surface: copy in `text-secondary`, optional
 * icon in `text-tertiary`, optional action as a tertiary button. The surface
 * is a `role="status"` region so AT users hear the empty announcement.
 *
 * AGENTS.md §1 cross-cutting concern #6 + UX-DR16.
 */
export function HonestEmptyState({
  copy,
  action,
  icon,
  className,
}: HonestEmptyStateProps) {
  if (
    process.env.NODE_ENV !== "production" &&
    (typeof copy !== "string" || copy.trim().length === 0)
  ) {
    console.error(
      "[HonestEmptyState] `copy` is required and must be a non-empty string. AGENTS.md §1 cross-cutting concern #6: Empty states are intentional — no fallback 'Coming soon' / 'Nothing here yet' copy.",
    );
  }

  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center justify-center py-12 px-6 text-center",
        className,
      )}
    >
      {icon && (
        <div className="mb-4 text-(--color-text-tertiary)" aria-hidden="true">
          {icon}
        </div>
      )}
      <p className="text-base text-(--color-text-secondary) max-w-prose">
        {copy}
      </p>
      {action && (
        <div className="mt-4">
          {"onClick" in action ? (
            <Button variant="tertiary" onClick={action.onClick}>
              {action.label}
            </Button>
          ) : (
            <Button variant="tertiary" asChild>
              <Link href={action.href}>{action.label}</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
