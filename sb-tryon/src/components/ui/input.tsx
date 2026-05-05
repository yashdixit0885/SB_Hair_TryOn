"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 rounded-md border border-(--color-border-strong) bg-(--color-bg-base) px-3 py-2 text-base text-(--color-text-primary) transition-colors duration-(--motion-duration-fast) ease-(--motion-ease) placeholder:text-(--color-text-secondary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-accent-primary) disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-(--color-error)",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
