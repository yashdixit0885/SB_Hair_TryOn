"use client";

import * as React from "react";
import { Form as FormPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

// Minimal form wrappers built on @radix-ui/react-form. Provides semantic
// composition (Form / FormField / FormLabel / FormControl / FormMessage)
// without pulling in react-hook-form. Stories using more elaborate validation
// can layer RHF on top later.

function Form({
  className,
  noValidate = true,
  ...props
}: React.ComponentProps<typeof FormPrimitive.Root>) {
  return (
    <FormPrimitive.Root
      data-slot="form"
      className={cn("flex flex-col gap-4", className)}
      noValidate={noValidate}
      {...props}
    />
  );
}

function FormField({
  className,
  ...props
}: React.ComponentProps<typeof FormPrimitive.Field>) {
  return (
    <FormPrimitive.Field
      data-slot="form-field"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof FormPrimitive.Label>) {
  return (
    <FormPrimitive.Label
      data-slot="form-label"
      className={cn(
        "text-base font-medium text-(--color-text-primary)",
        className,
      )}
      {...props}
    />
  );
}

function FormControl({
  ...props
}: React.ComponentProps<typeof FormPrimitive.Control>) {
  return <FormPrimitive.Control data-slot="form-control" {...props} />;
}

/**
 * Helper text rendered below an input. For a11y, pass the same `id` here and
 * add `aria-describedby={id}` on the control manually — Radix Form only
 * auto-links `FormMessage` ids to the control, not arbitrary descriptions.
 */
function FormDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="form-description"
      className={cn("text-xs text-(--color-text-secondary)", className)}
      {...props}
    />
  );
}

function FormMessage({
  className,
  ...props
}: React.ComponentProps<typeof FormPrimitive.Message>) {
  return (
    <FormPrimitive.Message
      data-slot="form-message"
      role="alert"
      className={cn("text-xs text-(--color-error)", className)}
      {...props}
    />
  );
}

function FormSubmit({
  ...props
}: React.ComponentProps<typeof FormPrimitive.Submit>) {
  return <FormPrimitive.Submit data-slot="form-submit" {...props} />;
}

function FormValidityState({
  ...props
}: React.ComponentProps<typeof FormPrimitive.ValidityState>) {
  return (
    <FormPrimitive.ValidityState data-slot="form-validity-state" {...props} />
  );
}

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormSubmit,
  FormValidityState,
};
