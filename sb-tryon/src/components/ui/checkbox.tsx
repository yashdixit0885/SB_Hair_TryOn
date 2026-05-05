"use client";

import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { CheckIcon, MinusIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer inline-flex size-5 shrink-0 items-center justify-center rounded-sm border border-(--color-border-strong) bg-(--color-bg-base) transition-colors duration-(--motion-duration-fast) ease-(--motion-ease) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-accent-primary) disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-(--color-accent-primary) data-[state=checked]:bg-(--color-accent-primary) data-[state=checked]:text-(--color-bg-base) data-[state=indeterminate]:border-(--color-accent-primary) data-[state=indeterminate]:bg-(--color-accent-primary) data-[state=indeterminate]:text-(--color-bg-base)",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current"
      >
        <CheckIcon
          className="hidden size-3.5 [[data-state=checked]>&]:block"
          aria-hidden="true"
        />
        <MinusIcon
          className="hidden size-3.5 [[data-state=indeterminate]>&]:block"
          aria-hidden="true"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
