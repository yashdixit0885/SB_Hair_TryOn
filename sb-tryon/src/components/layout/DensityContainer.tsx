import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface DensityContainerProps {
  density: "comfortable" | "compact";
  children: ReactNode;
  className?: string;
}

/**
 * Density boundary. Sets `data-density="…"` on its wrapper so descendants
 * inherit the `--density-scale` CSS variable cascade defined in
 * `src/app/globals.css`. AGENTS.md §1 cross-cutting concern #10: this is the
 * ONLY blessed surface for declaring density. Components MUST NOT accept a
 * `density` prop directly — they read density from this container's cascade
 * via `calc(var(--spacing-N) * var(--density-scale, 1))`.
 *
 * Most direct usage is inside `<PageShell>`, which wraps the entire route in
 * a density boundary. Standalone use is acceptable for a denser inner area on
 * an otherwise comfortable surface (e.g. an inline data table on a consumer
 * page).
 */
export function DensityContainer({
  density,
  children,
  className,
}: DensityContainerProps) {
  return (
    <div data-density={density} className={cn(className)}>
      {children}
    </div>
  );
}
