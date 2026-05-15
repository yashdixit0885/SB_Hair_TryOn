import type { Decorator, Meta, StoryObj } from "@storybook/nextjs-vite";

import { useTryOnStore } from "@/lib/stores/try-on";

import { FadeSimulator } from "./FadeSimulator";

// AC7 — required variants: Default, AtWeek4, AtWeek8, HighWashRate, MaxFade.
// All must pass axe-core (enforced by Storybook Vitest a11y addon).

const meta: Meta<typeof FadeSimulator> = {
  title: "render/FadeSimulator",
  component: FadeSimulator,
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/try-on",
        searchParams: new URLSearchParams("week=0"),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FadeSimulator>;

// Factory: resets all store fields to defaults then applies per-story overrides.
// Using a factory ensures every story resets the full store state — AC7 store
// isolation requirement. Per-story setState calls are idempotent so double
// invocation in React 18 Strict Mode has no observable effect.
function withStore(overrides: {
  fadeWeek?: number;
  washesPerWeek?: 1 | 2 | 3 | 4;
}): Decorator {
  return function StoreDecorator(Story) {
    useTryOnStore.setState({
      selectedColorId: null,
      lightingPreset: "daylight",
      fadeWeek: 0,
      washesPerWeek: 2,
      ...overrides,
    });
    return <Story />;
  };
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

// AC7 — Default: week 0, 2 washes/week, "Fresh from salon" / "Week 0 — fresh".
export const Default: Story = {
  decorators: [withStore({})],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/try-on",
        searchParams: new URLSearchParams("week=0"),
      },
    },
  },
};

// AC7 — AtWeek4: slider at week 4 (day 28) milestone — milestone marker
// emphasized. The exec demo shows color at the "noticeable fade" checkpoint.
export const AtWeek4: Story = {
  decorators: [withStore({ fadeWeek: 4 })],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/try-on",
        searchParams: new URLSearchParams("week=4"),
      },
    },
  },
};

// AC7 — AtWeek8: the demo's "money shot" — week 8 milestone emphasized,
// label reads "Week 8 — moderate fade". This is the slide that converts
// skeptics (FR3 rationale).
export const AtWeek8: Story = {
  decorators: [withStore({ fadeWeek: 8 })],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/try-on",
        searchParams: new URLSearchParams("week=8"),
      },
    },
  },
};

// AC7 — HighWashRate: 4+ washes/week at week 4 — live region reads
// "four or more"; accelerated fade curve visible in ColorRender (Story 1.10).
export const HighWashRate: Story = {
  decorators: [withStore({ fadeWeek: 4, washesPerWeek: 4 })],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/try-on",
        searchParams: new URLSearchParams("week=4"),
      },
    },
  },
};

// AC7 — MaxFade: slider at day 90 (fully faded), "90 days later" label
// prominent. fadeWeek=13 → Math.min(90, Math.round(13*7)=91) = sliderDay 90.
export const MaxFade: Story = {
  decorators: [withStore({ fadeWeek: 13 })],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/try-on",
        searchParams: new URLSearchParams("week=13"),
      },
    },
  },
};
