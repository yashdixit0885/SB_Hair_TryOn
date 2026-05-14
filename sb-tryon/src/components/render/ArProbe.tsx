"use client";

// Story 1.5 verification probe (AC15 clause 4). Mounts the AR slot from
// `useProvider("ar")` and calls `prewarm()` so the Storybook decorator's
// no-op AR override is exercised end-to-end. Without this story, Story 1.7
// would be the first surface that touches the AR provider in browser-mode
// Vitest — and a regression in the decorator swap would only show up there.
//
// This is **NOT a feature component**. It ships under `src/components/render/`
// to satisfy the colocation gates (test + story sibling enforced by
// `check:stories`). It renders a single sentence; Story 1.7's `<ColorRender>`
// is the real render surface.

import { useEffect, useState } from "react";
import { useProvider } from "@/lib/providers";

export function ArProbe() {
  const ar = useProvider("ar");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    ar.prewarm()
      .then(() => {
        if (!cancelled) setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [ar]);

  return <p data-status={status}>AR provider status: {status}</p>;
}
