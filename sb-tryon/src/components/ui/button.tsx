"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

// 3-tier visual hierarchy + destructive (UX-DR9). No `default`/`outline`/
// `link`/`ghost` from the shadcn baseline — UX spec is opinionated.
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors duration-(--motion-duration-fast) ease-(--motion-ease) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-accent-primary) aria-disabled:pointer-events-none aria-disabled:opacity-50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "bg-(--color-accent-primary) text-(--color-bg-base) hover:bg-(--color-accent-primary-hover)",
        secondary:
          "bg-(--color-bg-elevated) text-(--color-text-primary) border border-(--color-border-subtle) hover:bg-(--color-bg-sunken)",
        tertiary:
          "bg-transparent text-(--color-accent-primary) underline-offset-4 hover:underline",
        destructive:
          "bg-(--color-error) text-(--color-bg-base) hover:opacity-90",
      },
      size: {
        default: "h-11 px-4 text-base",
        sm: "h-9 px-3 text-base",
        lg: "h-12 px-6 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  /**
   * Verb-driven copy required (UX-DR16). Use action-specific verbs that name
   * what the button DOES, e.g. "Save look", "Upload photo", "Find a salon",
   * "Try another color". Forbidden: "Submit", "Continue", "OK", "Click here",
   * "Next" — replace with action-specific verbs.
   */
  children: React.ReactNode;
  asChild?: boolean;
  /**
   * When true, replaces label with a spinner; preserves button width to
   * prevent layout shift (UX-DR9).
   */
  loading?: boolean;
}

function Button({
  className,
  variant = "primary",
  size = "default",
  asChild = false,
  loading = false,
  children,
  "aria-disabled": ariaPropDisabled,
  onClick,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  const isDisabled =
    loading || ariaPropDisabled === true || ariaPropDisabled === "true";

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  }

  // Guard !asChild: Slot.Root requires exactly one child element; wrapping in a
  // loading span would replace the slotted element's content.
  const content =
    !asChild && loading ? (
      <span className="relative inline-flex w-full items-center justify-center">
        <span className="invisible">{children}</span>
        <span className="absolute inset-0 grid place-items-center">
          <span className="sr-only" role="status" aria-live="polite">
            Loading
          </span>
          <svg
            className="size-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              strokeOpacity="0.25"
            />
            <path
              d="M22 12a10 10 0 0 1-10 10"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </span>
    ) : (
      children
    );
  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
      aria-busy={loading || undefined}
      aria-disabled={isDisabled || undefined}
      onClick={handleClick}
    >
      {content}
    </Comp>
  );
}

export { Button, buttonVariants };
