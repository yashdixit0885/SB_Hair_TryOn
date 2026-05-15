import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

import { FadeSimulator } from "./FadeSimulator";

// ---------------------------------------------------------------------------
// Mock stable store function refs (captured in factory closures below).
// ---------------------------------------------------------------------------
const mockScrubFade = vi.fn();
const mockSetWashesPerWeek = vi.fn();
const mockReplace = vi.fn();

// Mutable per-test state — factories read these via closure at render time.
let mockFadeWeek = 0;
let mockWashesPerWeek: 1 | 2 | 3 | 4 = 2;

// ---------------------------------------------------------------------------
// Slider callback capture — the mock Slider stores the latest callbacks here
// so tests can invoke them directly without simulating pointer events.
// ---------------------------------------------------------------------------
const sliderCbs: {
  onChange?: (values: number[]) => void;
  onCommit?: (values: number[]) => void;
} = {};

// Select callback capture — used by mock SelectItem to fire onValueChange.
let selectChangeHandler: ((value: string) => void) | undefined;

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/try-on",
  useSearchParams: () => new URLSearchParams(`week=${mockFadeWeek}`),
}));

vi.mock("@/lib/url-state/try-on-params", () => ({
  useTryOnParams: () => ({
    colorId: "auburn",
    lightingPreset: "daylight" as const,
    fadeWeek: mockFadeWeek,
  }),
}));

vi.mock("@/lib/stores/try-on", () => ({
  useTryOnStore: () => ({
    washesPerWeek: mockWashesPerWeek,
    scrubFade: mockScrubFade,
    setWashesPerWeek: mockSetWashesPerWeek,
  }),
}));

// Mocked Slider: captures onValueChange / onValueCommit for direct invocation.
vi.mock("@/components/ui/slider", () => ({
  Slider: ({
    onValueChange,
    onValueCommit,
    value,
    min = 0,
    max = 90,
    thumbLabels,
  }: {
    onValueChange?: (values: number[]) => void;
    onValueCommit?: (values: number[]) => void;
    value?: number[];
    min?: number;
    max?: number;
    thumbLabels?: string | string[];
    step?: number;
    className?: string;
  }) => {
    sliderCbs.onChange = onValueChange;
    sliderCbs.onCommit = onValueCommit;
    return (
      <input
        type="range"
        role="slider"
        aria-label={typeof thumbLabels === "string" ? thumbLabels : "Fade slider"}
        min={min}
        max={max}
        // Render current controlled value so toHaveValue assertions work.
        value={value?.[0] ?? min}
        onChange={() => {
          /* controlled — changes driven via sliderCbs.onChange in tests */
        }}
        data-testid="fade-slider"
      />
    );
  },
}));

// Mocked Select: exposes SelectItem clicks to fire onValueChange without
// portal/jsdom limitations (deferred item D-D2).
vi.mock("@/components/ui/select", () => ({
  Select: ({
    onValueChange,
    value,
    children,
  }: {
    onValueChange?: (value: string) => void;
    value?: string;
    children?: ReactNode;
  }) => {
    selectChangeHandler = onValueChange;
    return (
      <div data-testid="fade-select" data-value={value}>
        {children}
      </div>
    );
  },
  SelectTrigger: ({ children }: { children?: ReactNode }) => (
    <div data-testid="select-trigger">{children}</div>
  ),
  SelectContent: ({ children }: { children?: ReactNode }) => (
    <div data-testid="select-content">{children}</div>
  ),
  SelectItem: ({
    value,
    children,
  }: {
    value?: string;
    children?: ReactNode;
  }) => (
    <button
      type="button"
      data-testid={`select-item-${value}`}
      onClick={() => selectChangeHandler?.(value ?? "")}
    >
      {children}
    </button>
  ),
  SelectValue: () => null,
}));

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks();
  mockFadeWeek = 0;
  mockWashesPerWeek = 2;
  sliderCbs.onChange = undefined;
  sliderCbs.onCommit = undefined;
  selectChangeHandler = undefined;
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("FadeSimulator", () => {
  // AC1 — renders slider at day 0 and displays anchor labels + phase label
  it("renders slider at day 0 and displays 'Fresh from salon' and weekFreshLabel", () => {
    render(<FadeSimulator />);
    // Range input.value is always a string in the DOM.
    expect((screen.getByTestId("fade-slider") as HTMLInputElement).value).toBe("0");
    expect(screen.getByText("Fresh from salon")).toBeInTheDocument();
    expect(screen.getByText("90 days later")).toBeInTheDocument();
    // Week 0 displays the phase label from renderCopy.fadeSimulator.weekFreshLabel
    expect(screen.getByText("Week 0 — fresh")).toBeInTheDocument();
  });

  // AC1 — slider initialises from URL fadeWeek (AC2, AR6) + phase label at week 8
  it("initialises slider day from URL fadeWeek and shows weekModerateLabel at week 8", () => {
    mockFadeWeek = 8;
    render(<FadeSimulator />);
    // Math.min(90, Math.round(8 * 7)) = 56
    expect((screen.getByTestId("fade-slider") as HTMLInputElement).value).toBe("56");
    // Week 8 displays the phase label from renderCopy.fadeSimulator.weekModerateLabel
    expect(screen.getByText("Week 8 — moderate fade")).toBeInTheDocument();
  });

  // Patch C — mount sync: scrubFade called on mount when URL has non-zero week
  it("calls scrubFade on mount when URL fadeWeek > 0 to sync ColorRender", () => {
    mockFadeWeek = 8;
    render(<FadeSimulator />);
    // Math.min(90, Math.round(8*7)) = 56; scrubFade(56/7 = 8)
    expect(mockScrubFade).toHaveBeenCalledWith(8);
  });

  // Patch A — sliderDay is clamped to 90 even when fadeWeek*7 > 90
  it("clamps sliderDay to 90 when URL fadeWeek=13 would produce 91 days", () => {
    mockFadeWeek = 13;
    render(<FadeSimulator />);
    // Math.min(90, Math.round(13*7)=91) = 90
    expect((screen.getByTestId("fade-slider") as HTMLInputElement).value).toBe("90");
  });

  // AC2 — onValueChange calls scrubFade with correct week value
  it("onValueChange calls scrubFade(day/7)", () => {
    render(<FadeSimulator />);
    act(() => {
      sliderCbs.onChange?.([28]);
    });
    // week = 28 / 7 = 4
    expect(mockScrubFade).toHaveBeenCalledWith(4);
    expect(mockScrubFade).toHaveBeenCalledTimes(1);
  });

  // AC2 — onValueCommit updates URL via router.replace
  it("onValueCommit persists week to URL via router.replace", () => {
    render(<FadeSimulator />);
    act(() => {
      sliderCbs.onCommit?.([28]);
    });
    // 28 / 7 = 4; existing searchParams had week=0 → replaced with week=4
    expect(mockReplace).toHaveBeenCalledWith("/try-on?week=4", {
      scroll: false,
    });
  });

  // AC3 — snaps to nearest milestone when within threshold
  it("snaps to nearest milestone on commit within threshold", () => {
    render(<FadeSimulator />);
    act(() => {
      // day 30 is within 3 days of day 28 (week 4 milestone)
      sliderCbs.onCommit?.([30]);
    });
    // scrubFade should receive snapped value: 28 / 7 = 4
    expect(mockScrubFade).toHaveBeenCalledWith(4);
    expect(mockReplace).toHaveBeenCalledWith("/try-on?week=4", {
      scroll: false,
    });
  });

  // AC3 — does NOT snap when outside threshold
  it("does NOT snap when outside milestone threshold", () => {
    render(<FadeSimulator />);
    act(() => {
      // day 35: 7 days from 28, 21 days from 56 — outside threshold (3)
      sliderCbs.onCommit?.([35]);
    });
    // 35 / 7 ≈ 5; not snapped
    expect(mockScrubFade).toHaveBeenCalledWith(35 / 7);
    expect(mockReplace).toHaveBeenCalledWith(
      `/try-on?week=${35 / 7}`,
      { scroll: false },
    );
  });

  // AC1, AC2 — washes select calls setWashesPerWeek with parsed integer
  it("washes select change calls setWashesPerWeek", () => {
    render(<FadeSimulator />);
    fireEvent.click(screen.getByTestId("select-item-3"));
    expect(mockSetWashesPerWeek).toHaveBeenCalledWith(3);
  });

  // AC4 — live region announces week + washes on slider change
  it("live region announces week and washes on slide", () => {
    render(<FadeSimulator />);
    act(() => {
      sliderCbs.onChange?.([28]);
    });
    // week = Math.round(28/7) = 4; washesPerWeek = 2 (mock default) → "two"
    expect(screen.getByRole("status")).toHaveTextContent(
      "Week 4, two washes per week",
    );
  });

  // AC4 — live region announces wash change when select changes
  it("live region announces wash count on select change", () => {
    render(<FadeSimulator />);
    fireEvent.click(screen.getByTestId("select-item-4"));
    // sliderDay = 0 (initial); new washes = 4 → "four or more"
    expect(screen.getByRole("status")).toHaveTextContent(
      "Week 0, four or more washes per week",
    );
  });

  // AC4 — live region is always in DOM (not conditionally rendered)
  it("live region is always present in DOM", () => {
    render(<FadeSimulator />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  // AC6 — synthetic 60fps scrub performance budget: ≤16ms per frame (90 frames)
  it("handles 90-frame scrub within 16ms-per-frame budget (NFR2)", () => {
    render(<FadeSimulator />);
    const t0 = performance.now();
    // 90 frames: days 1..90 (spec: "90 sequential onValueChange calls")
    for (let day = 1; day <= 90; day++) {
      act(() => {
        sliderCbs.onChange?.([day]);
      });
    }
    const elapsed = performance.now() - t0;
    // Divide by 90 per spec (AC6: "total elapsed time / 90 ≤ 16ms per step").
    expect(elapsed / 90).toBeLessThanOrEqual(16);
  });
});
