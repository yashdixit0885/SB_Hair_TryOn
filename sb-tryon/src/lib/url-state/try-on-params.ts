"use client";

import { useSearchParams } from "next/navigation";
import { type LightingPreset } from "@/lib/ar/lighting-postprocess";

const VALID_LIGHTING_PRESETS: readonly LightingPreset[] = ["indoor", "daylight", "salon"];

export interface TryOnParams {
  colorId: string | null;
  lightingPreset: LightingPreset;
  fadeWeek: number;
}

export function useTryOnParams(): TryOnParams {
  const params = useSearchParams();

  const colorId = params.get("color");

  const rawLighting = params.get("lighting");
  const lightingPreset: LightingPreset =
    rawLighting !== null && (VALID_LIGHTING_PRESETS as string[]).includes(rawLighting)
      ? (rawLighting as LightingPreset)
      : "daylight";

  const rawWeek = params.get("week");
  const parsedWeek = rawWeek !== null ? Number(rawWeek) : NaN;
  const fadeWeek =
    Number.isInteger(parsedWeek) && parsedWeek >= 0 && parsedWeek <= 13
      ? parsedWeek
      : 0;

  return { colorId, lightingPreset, fadeWeek };
}
