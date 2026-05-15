import { create } from "zustand";
import { type LightingPreset } from "@/lib/ar/lighting-postprocess";

export interface TryOnStore {
  selectedColorId: string | null;
  lightingPreset: LightingPreset;
  fadeWeek: number;
  washesPerWeek: 1 | 2 | 3 | 4;

  selectColor: (colorId: string | null) => void;
  setLightingPreset: (preset: LightingPreset) => void;
  scrubFade: (week: number) => void;
  setWashesPerWeek: (n: 1 | 2 | 3 | 4) => void;
  reset: () => void;
}

const INITIAL_STATE = {
  selectedColorId: null,
  lightingPreset: "daylight" as LightingPreset,
  fadeWeek: 0,
  // Median Maya scenario per fade-blend.ts comment
  washesPerWeek: 2 as const,
};

export const useTryOnStore = create<TryOnStore>((set) => ({
  ...INITIAL_STATE,

  selectColor(colorId) {
    set({ selectedColorId: colorId });
  },

  setLightingPreset(preset) {
    set({ lightingPreset: preset });
  },

  scrubFade(week) {
    set({ fadeWeek: week });
  },

  setWashesPerWeek(n) {
    set({ washesPerWeek: n });
  },

  reset() {
    set({ ...INITIAL_STATE });
  },
}));
