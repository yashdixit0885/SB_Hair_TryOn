"use client";

import { useCallback, type MouseEvent } from "react";

import { cn } from "@/lib/utils";

interface SkipToContentProps {
  /**
   * Optional override of the target element id. Defaults to `"main-content"`,
   * matching the `<main>` rendered by `<PageShell>`. UX-DR12 + WCAG 2.4.1.
   */
  targetId?: string;
  className?: string;
}

/**
 * Bypass-blocks affordance. Visually hidden until keyboard focus reveals it
 * (`sr-only focus:not-sr-only`); on activation it programmatically focuses the
 * `<main>` so the next Tab keystroke jumps past header/nav. Browsers vary on
 * whether hash-link activation moves focus (Safari yes, Chrome no by default,
 * jsdom no), so the explicit `.focus()` keeps cross-environment behavior
 * consistent. AGENTS.md §1: this component must always be the first focusable
 * element in `<PageShell>`.
 */
export function SkipToContent({
  targetId = "main-content",
  className,
}: SkipToContentProps) {
  const handleClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      const main = document.getElementById(targetId);
      if (main) {
        e.preventDefault();
        main.focus({ preventScroll: false });
      }
    },
    [targetId],
  );

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className={cn(
        "sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-(--color-bg-base) focus:px-4 focus:py-2 focus:text-base focus:font-medium focus:text-(--color-text-primary) focus:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-accent-primary)",
        className,
      )}
    >
      Skip to main content
    </a>
  );
}
