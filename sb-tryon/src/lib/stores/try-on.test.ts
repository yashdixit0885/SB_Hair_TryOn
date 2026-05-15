import { describe, expect, it, beforeEach } from "vitest";
import { useTryOnStore } from "./try-on";

beforeEach(() => {
  useTryOnStore.getState().reset();
});

describe("useTryOnStore — initial state", () => {
  it("starts with null selectedColorId", () => {
    expect(useTryOnStore.getState().selectedColorId).toBeNull();
  });

  it("starts with daylight lighting preset", () => {
    expect(useTryOnStore.getState().lightingPreset).toBe("daylight");
  });

  it("starts at fadeWeek 0", () => {
    expect(useTryOnStore.getState().fadeWeek).toBe(0);
  });

  it("starts with washesPerWeek 2 (median Maya scenario)", () => {
    expect(useTryOnStore.getState().washesPerWeek).toBe(2);
  });
});

describe("useTryOnStore — actions", () => {
  it("selectColor sets selectedColorId", () => {
    useTryOnStore.getState().selectColor("auburn");
    expect(useTryOnStore.getState().selectedColorId).toBe("auburn");
  });

  it("selectColor accepts null to deselect", () => {
    useTryOnStore.getState().selectColor("auburn");
    useTryOnStore.getState().selectColor(null);
    expect(useTryOnStore.getState().selectedColorId).toBeNull();
  });

  it("setLightingPreset updates lightingPreset", () => {
    useTryOnStore.getState().setLightingPreset("indoor");
    expect(useTryOnStore.getState().lightingPreset).toBe("indoor");

    useTryOnStore.getState().setLightingPreset("salon");
    expect(useTryOnStore.getState().lightingPreset).toBe("salon");
  });

  it("scrubFade updates fadeWeek", () => {
    useTryOnStore.getState().scrubFade(6);
    expect(useTryOnStore.getState().fadeWeek).toBe(6);
  });

  it("setWashesPerWeek updates washesPerWeek", () => {
    useTryOnStore.getState().setWashesPerWeek(4);
    expect(useTryOnStore.getState().washesPerWeek).toBe(4);

    useTryOnStore.getState().setWashesPerWeek(1);
    expect(useTryOnStore.getState().washesPerWeek).toBe(1);
  });

  it("reset restores initial state", () => {
    useTryOnStore.getState().selectColor("espresso");
    useTryOnStore.getState().setLightingPreset("salon");
    useTryOnStore.getState().scrubFade(8);
    useTryOnStore.getState().setWashesPerWeek(3);

    useTryOnStore.getState().reset();

    const state = useTryOnStore.getState();
    expect(state.selectedColorId).toBeNull();
    expect(state.lightingPreset).toBe("daylight");
    expect(state.fadeWeek).toBe(0);
    expect(state.washesPerWeek).toBe(2);
  });
});
