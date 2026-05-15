"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTryOnStore } from "@/lib/stores/try-on";
import { useTryOnParams } from "@/lib/url-state/try-on-params";
import { renderCopy } from "@/lib/copy/render";
import { cn } from "@/lib/utils";

// Day positions for week-2 / week-4 / week-8 milestones (UX-DR4).
const MILESTONE_CONFIG = [
  { day: 14, week: 2 },
  { day: 28, week: 4 },
  { day: 56, week: 8 },
] as const;

// Days within this distance snap to the nearest milestone on commit (AC3).
const SNAP_THRESHOLD = 3;

const WASH_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "one",
  2: "two",
  3: "three",
  4: "four or more",
};

const WASH_OPTIONS = [
  { value: "1", label: "1 wash / week" },
  { value: "2", label: "2 washes / week" },
  { value: "3", label: "3 washes / week" },
  { value: "4", label: "4+ washes / week" },
] as const;

export interface FadeSimulatorProps {
  className?: string;
}

export function FadeSimulator({ className }: FadeSimulatorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialise slider day from URL ?week= (AC2, AR6).
  const { fadeWeek } = useTryOnParams();
  const { washesPerWeek, scrubFade, setWashesPerWeek } = useTryOnStore();

  // Local controlled state provides 60fps slider feel without URL round-trip
  // lag; URL is updated only on commit (see handleSliderCommit).
  // Clamped to [0, 90] days: fadeWeek=13 → Math.round(91) → clamped to 90.
  const [sliderDay, setSliderDay] = useState(() => Math.min(90, Math.round(fadeWeek * 7)));
  // Captures URL-derived fadeWeek at mount so the effect below can read it
  // without listing fadeWeek as a dep (which would re-fire on every URL update).
  const initialFadeWeekRef = useRef(fadeWeek);

  const liveRegionRef = useRef<HTMLDivElement>(null);

  const currentWeek = Math.round(sliderDay / 7);

  // Sync the Zustand store with the URL-initialized slider position on mount.
  // Without this, ColorRender reads fadeWeek=0 (store default) until the user
  // first interacts, causing a desync when the page loads with ?week=N.
  // scrubFade is a stable Zustand action so [scrubFade] deps runs once on mount.
  useEffect(() => {
    const day = Math.min(90, Math.round(initialFadeWeekRef.current * 7));
    if (day > 0) scrubFade(day / 7);
  }, [scrubFade]);

  // Stable ref-only mutation — deps are the ref (stable) + module-level
  // constants, so [] is correct and keeps downstream useCallbacks cheap.
  const updateLiveRegion = useCallback(
    (day: number, washes: 1 | 2 | 3 | 4) => {
      if (liveRegionRef.current) {
        const week = Math.round(day / 7);
        liveRegionRef.current.textContent = renderCopy.fadeSimulator.liveRegion(
          week,
          WASH_LABELS[washes],
        );
      }
    },
    [],
  );

  // Called on every drag frame — writes to Zustand store so ColorRender's
  // Effect 2 fires at 60fps without waiting for a URL round-trip (AC2).
  const handleSliderChange = useCallback(
    (values: number[]) => {
      const day = values[0] ?? 0;
      setSliderDay(day);
      scrubFade(day / 7);
      updateLiveRegion(day, washesPerWeek);
    },
    [scrubFade, washesPerWeek, updateLiveRegion],
  );

  // Called on drag-end / keyboard release — applies snap logic then persists
  // the committed week to URL state for shareability (AC2, AC3, AR6).
  const handleSliderCommit = useCallback(
    (values: number[]) => {
      let day = values[0] ?? 0;

      // Snap to nearest milestone if within threshold (AC3).
      for (const config of MILESTONE_CONFIG) {
        if (Math.abs(day - config.day) <= SNAP_THRESHOLD) {
          day = config.day;
          break;
        }
      }

      setSliderDay(day);
      scrubFade(day / 7);

      // Persist to URL (shareability, back-navigation — AR6).
      // Math.round ensures an integer week is written; useTryOnParams rejects
      // non-integers and falls back to 0, breaking URL shareability otherwise.
      const params = new URLSearchParams(searchParams.toString());
      params.set("week", String(Math.round(day / 7)));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });

      updateLiveRegion(day, washesPerWeek);
    },
    [scrubFade, washesPerWeek, router, pathname, searchParams, updateLiveRegion],
  );

  // Washes/week is store-only — not in URL state per Story 1.7 open
  // question #1 resolution (AC2).
  const handleWashesChange = useCallback(
    (value: string) => {
      const n = Number(value);
      if (!Number.isInteger(n) || n < 1 || n > 4) return;
      setWashesPerWeek(n as 1 | 2 | 3 | 4);
      updateLiveRegion(sliderDay, n as 1 | 2 | 3 | 4);
    },
    [setWashesPerWeek, sliderDay, updateLiveRegion],
  );

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Slider + milestone marker overlay */}
      <div
        role="group"
        aria-label="Fade timeline scrubber"
        className="relative pb-6"
      >
        <Slider
          value={[sliderDay]}
          min={0}
          max={90}
          step={1}
          thumbLabels="Fade week slider"
          onValueChange={handleSliderChange}
          onValueCommit={handleSliderCommit}
        />

        {/*
         * Milestone tick marks are positioned in the 24px (pb-6) padding
         * space directly below the slider track. Each mark is placed at its
         * proportional position along the 0-90 day range (AC3).
         */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-6"
          aria-hidden="true"
        >
          {MILESTONE_CONFIG.map(({ day, week }) => {
            const pct = (day / 90) * 100;
            const isNear = Math.abs(sliderDay - day) <= SNAP_THRESHOLD;
            return (
              <div
                key={day}
                style={{ left: `${pct}%` }}
                className="absolute top-0 -translate-x-1/2 flex flex-col items-center gap-px"
              >
                <span
                  className={cn(
                    "block h-2 w-px rounded-full transition-colors duration-(--motion-duration-fast) motion-reduce:transition-none",
                    isNear
                      ? "bg-(--color-accent-primary)"
                      : "bg-(--color-text-tertiary)",
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] leading-none transition-all duration-(--motion-duration-fast) motion-reduce:transition-none",
                    isNear
                      ? "font-semibold text-(--color-accent-primary)"
                      : "text-(--color-text-secondary)",
                  )}
                >
                  Wk {week}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline anchor labels + current week readout */}
      <div className="flex justify-between text-xs text-(--color-text-secondary)">
        <span>{renderCopy.fadeSimulator.freshLabel}</span>
        <span className="tabular-nums">
          {currentWeek === 0
            ? renderCopy.fadeSimulator.weekFreshLabel
            : currentWeek === 8
              ? renderCopy.fadeSimulator.weekModerateLabel
              : currentWeek === 13
                ? renderCopy.fadeSimulator.weekMaxLabel
                : renderCopy.fadeSimulator.weekLabel(currentWeek)}
        </span>
        <span>{renderCopy.fadeSimulator.maxLabel}</span>
      </div>

      {/* Washes / week selector (AC1) */}
      <div className="flex items-center gap-2">
        <span
          id="washes-per-week-label"
          className="shrink-0 text-sm text-(--color-text-secondary)"
        >
          Washes / week
        </span>
        <Select value={String(washesPerWeek)} onValueChange={handleWashesChange}>
          <SelectTrigger
            aria-labelledby="washes-per-week-label"
            className="h-9 w-40"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {WASH_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Visually-hidden live region — always in DOM for AT association (AC4) */}
      <div
        ref={liveRegionRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
    </div>
  );
}
