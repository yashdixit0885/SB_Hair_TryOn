"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full rounded-md border border-(--color-border-strong) bg-(--color-bg-base) px-3 py-2 text-base text-(--color-text-primary) transition-colors duration-(--motion-duration-fast) ease-(--motion-ease) placeholder:text-(--color-text-secondary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-accent-primary) disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-(--color-error)",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
