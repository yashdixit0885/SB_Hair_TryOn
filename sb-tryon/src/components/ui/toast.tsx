"use client";

import * as React from "react";
import { Toast as ToastPrimitive } from "radix-ui";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function ToastProvider({
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Provider>) {
  return <ToastPrimitive.Provider {...props} />;
}

function ToastViewport({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Viewport>) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        "fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col gap-2 p-4 sm:bottom-4 sm:right-4 sm:max-w-sm",
        className,
      )}
      {...props}
    />
  );
}

function Toast({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Root>) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      className={cn(
        "group relative grid w-full grid-cols-[1fr_auto] items-center gap-3 rounded-md border border-(--color-border-subtle) bg-(--color-bg-elevated) p-4 text-base text-(--color-text-primary) shadow-md transition-transform duration-(--motion-duration-base) ease-(--motion-ease)",
        className,
      )}
      {...props}
    />
  );
}

function ToastTitle({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Title>) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn(
        "text-base font-semibold text-(--color-text-primary)",
        className,
      )}
      {...props}
    />
  );
}

function ToastDescription({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Description>) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn("text-base text-(--color-text-secondary)", className)}
      {...props}
    />
  );
}

function ToastAction({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Action>) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      className={cn(
        "inline-flex h-9 shrink-0 items-center justify-center rounded-md border border-(--color-border-subtle) bg-transparent px-3 text-sm font-medium text-(--color-text-primary) transition-colors duration-(--motion-duration-fast) ease-(--motion-ease) hover:bg-(--color-bg-sunken) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-accent-primary)",
        className,
      )}
      {...props}
    />
  );
}

function ToastClose({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Close>) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      className={cn(
        "absolute right-2 top-2 inline-flex size-7 items-center justify-center rounded-md text-(--color-text-secondary) transition-colors duration-(--motion-duration-fast) ease-(--motion-ease) hover:bg-(--color-bg-sunken) hover:text-(--color-text-primary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-accent-primary)",
        className,
      )}
      aria-label="Close notification"
      {...props}
    >
      <XIcon className="size-4" aria-hidden="true" />
    </ToastPrimitive.Close>
  );
}

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
};
