"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-(--motion-duration-fast) ease-(--motion-ease) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-accent-primary) disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-(--color-accent-primary) data-[state=unchecked]:bg-(--color-bg-sunken)",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-5 rounded-full bg-(--color-bg-base) shadow-sm ring-0 transition-transform duration-(--motion-duration-fast) ease-(--motion-ease) data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
