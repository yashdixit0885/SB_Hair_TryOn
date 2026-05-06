"use client";

import {
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { AppHeader } from "./AppHeader";
import { DensityContainer } from "./DensityContainer";
import { ErrorBanner, type ErrorBannerProps } from "./ErrorBanner";
import { SkipToContent } from "./SkipToContent";

interface OperatorSection {
  label: string;
  href: string;
  current?: boolean;
}

export interface PageShellProps {
  variant: "consumer" | "operator" | "stylist";
  /** Operator variant requires `sections` to be passed through to AppHeader. */
  sections?: OperatorSection[];
  /** Optional surface-level error rendered as <ErrorBanner> inside <main>. */
  error?: Pick<ErrorBannerProps, "message" | "retryLabel" | "onRetry" | "onDismiss">;
  /** Optional footer content. Most surfaces won't pass one. */
  footer?: ReactNode;
  children: ReactNode;
}

/**
 * Outer page scaffold. Owns:
 *  - The skip-to-content affordance (UX-DR12, WCAG 2.4.1) — first focusable element.
 *  - The variant-specific `<AppHeader>` (consumer | operator | stylist).
 *  - The `<main id="main-content" tabIndex={-1}>` focus target.
 *  - Route-change focus management: on `pathname` change, focus moves to the
 *    first `<h1>` inside `<main>` (or `<main>` itself if no `<h1>` exists).
 *    The first mount is skipped — auto-focusing on initial page load is
 *    jarring and can disrupt screen-reader announcements (UX-DR12, NFR22).
 *  - Density boundary (consumer/stylist comfortable, operator compact).
 *  - Optional surface-level `<ErrorBanner>` and `<footer>` slots.
 *
 * Pages compose content inside `<PageShell>`; the shell handles density,
 * a11y, and focus. Architecture §"Project Structure".
 */
export function PageShell({
  variant,
  sections,
  error,
  footer,
  children,
}: PageShellProps) {
  const pathname = usePathname();
  const mainRef = useRef<HTMLElement>(null);
  const isFirstMountRef = useRef(true);

  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }
    const main = mainRef.current;
    if (!main) return;
    const h1 = main.querySelector<HTMLHeadingElement>("h1");
    const target = h1 ?? main;
    if (h1) h1.tabIndex = -1;
    target.focus({ preventScroll: false });
  }, [pathname]);

  const isOperator = variant === "operator";
  const density: "comfortable" | "compact" = isOperator
    ? "compact"
    : "comfortable";

  return (
    <DensityContainer density={density} className="min-h-screen flex flex-col">
      <SkipToContent />
      {variant === "operator" ? (
        <AppHeader variant="operator" sections={sections ?? []} />
      ) : variant === "stylist" ? (
        <AppHeader variant="stylist" />
      ) : (
        <AppHeader variant="consumer" />
      )}
      <main
        ref={mainRef}
        id="main-content"
        tabIndex={-1}
        className={cn(
          "flex-1 focus:outline-none",
          isOperator
            ? "pl-64 pr-8 py-6"
            : "px-6 py-6 max-w-(--breakpoint-xl) mx-auto w-full",
        )}
      >
        {error && <ErrorBanner {...error} />}
        {children}
      </main>
      {footer && (
        <footer
          className={cn(
            "border-t border-(--color-border-subtle) bg-(--color-bg-elevated) px-6 py-4",
            isOperator && "pl-64",
          )}
        >
          {footer}
        </footer>
      )}
    </DensityContainer>
  );
}
