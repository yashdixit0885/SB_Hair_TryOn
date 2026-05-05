"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

interface SliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {
  /**
   * Per-thumb accessible names. If a single string is provided, every thumb
   * uses that name. Defaults are derived from `aria-label` / `aria-labelledby`
   * on the root so single-thumb sliders stay ergonomic.
   */
  thumbLabels?: string | string[];
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  thumbLabels,
  ...props
}: SliderProps) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min],
    [value, defaultValue, min],
  );

  const rootAriaLabel = props["aria-label"];
  const rootAriaLabelledBy = props["aria-labelledby"];

  function getThumbProps(index: number): {
    "aria-label"?: string;
    "aria-labelledby"?: string;
  } {
    if (Array.isArray(thumbLabels)) {
      // Fallback ensures axe aria-required-name passes even if the array is shorter than thumb count.
      return { "aria-label": thumbLabels[index] ?? `Value ${index + 1}` };
    }
    if (typeof thumbLabels === "string") {
      return { "aria-label": thumbLabels };
    }
    if (rootAriaLabel) return { "aria-label": rootAriaLabel };
    if (rootAriaLabelledBy) return { "aria-labelledby": rootAriaLabelledBy };
    // Generic fallback so axe's aria-required-name never silently fails.
    // Prefer a meaningful aria-label or thumbLabels in all real usage.
    return { "aria-label": `Value ${index + 1}` };
  }

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative h-1 w-full grow overflow-hidden rounded-full bg-(--color-bg-sunken)"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute h-full bg-(--color-accent-primary)"
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          data-slot="slider-thumb"
          className="block size-4 shrink-0 rounded-full border-2 border-(--color-accent-primary) bg-(--color-bg-base) transition-colors duration-(--motion-duration-fast) ease-(--motion-ease) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-accent-primary) disabled:pointer-events-none disabled:opacity-50"
          {...getThumbProps(index)}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
