"use client";

// <ConsentPrompt> — legally-required commitment surface (FR46, UX-DR4).
// Non-dismissable Radix Dialog: ESC, outside-click, and close button are all
// disabled. The user MUST make an explicit choice. All copy reads from
// `consentCopy` — no inline string literals (AC8).

import { useEffect, useId, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { consentCopy } from "@/lib/copy/consent";

type ConsentChoice = "local" | "saved" | "declined";

export interface ConsentPromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConsent: (scope: "local" | "saved") => void;
  onDecline: () => void;
}

export function ConsentPrompt({
  open,
  onOpenChange,
  onConsent,
  onDecline,
}: ConsentPromptProps) {
  // Default selection per architecture: "Process locally only" is pre-checked.
  const [choice, setChoice] = useState<ConsentChoice>("local");
  const [submitting, setSubmitting] = useState(false);
  const localId = useId();
  const savedId = useId();
  const declinedId = useId();

  // Reset choice and submitting state each time the dialog opens so FR46
  // re-prompts always start from the default "local" selection.
  useEffect(() => {
    if (open) {
      setChoice("local");
      setSubmitting(false);
    }
  }, [open]);

  function handleContinue() {
    if (submitting) return;
    setSubmitting(true);
    if (choice === "declined") {
      onDecline();
    } else {
      onConsent(choice);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{consentCopy.prompt.title}</DialogTitle>
          <DialogDescription>{consentCopy.prompt.body}</DialogDescription>
        </DialogHeader>
        <RadioGroup
          aria-label={consentCopy.prompt.radioGroupLabel}
          value={choice}
          onValueChange={(v) => setChoice(v as ConsentChoice)}
          className="gap-3"
        >
          <div className="flex items-start gap-3">
            <RadioGroupItem value="local" id={localId} />
            <Label htmlFor={localId} className="cursor-pointer leading-snug">
              {consentCopy.prompt.optionLocalLabel}
            </Label>
          </div>
          <div className="flex items-start gap-3">
            <RadioGroupItem value="saved" id={savedId} />
            <Label htmlFor={savedId} className="cursor-pointer leading-snug">
              {consentCopy.prompt.optionSavedLabel}
            </Label>
          </div>
          <div className="flex items-start gap-3">
            <RadioGroupItem value="declined" id={declinedId} />
            <Label htmlFor={declinedId} className="cursor-pointer leading-snug">
              {consentCopy.prompt.optionDeclinedLabel}
            </Label>
          </div>
        </RadioGroup>
        <DialogFooter>
          <Button variant="primary" onClick={handleContinue} disabled={submitting}>
            {consentCopy.prompt.continueButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
