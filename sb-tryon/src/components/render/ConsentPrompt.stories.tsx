import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ConsentPrompt } from "./ConsentPrompt";

// AC11 — at minimum a Default story for screen-reader review. The dialog
// is non-dismissable in the running app, so the story keeps it open and
// wires onConsent/onDecline to no-op handlers.

const meta: Meta<typeof ConsentPrompt> = {
  title: "render/ConsentPrompt",
  component: ConsentPrompt,
};

export default meta;

export const Default: StoryObj<typeof ConsentPrompt> = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <ConsentPrompt
        open={open}
        onOpenChange={setOpen}
        onConsent={() => setOpen(false)}
        onDecline={() => setOpen(false)}
      />
    );
  },
};
