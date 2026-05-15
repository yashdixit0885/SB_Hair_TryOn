import { describe, expect, it } from "vitest";
import { consentCopy } from "./consent";

describe("consentCopy", () => {
  it("is frozen at the top level (immutability guard for the BIPA/CUBI/GDPR surface)", () => {
    expect(Object.isFrozen(consentCopy)).toBe(true);
  });

  it("prompt.body contains the on-device claim — core BIPA invariant", () => {
    expect(consentCopy.prompt.body.includes("on your device")).toBe(true);
  });

  it("three radio labels include the regression-guard substrings", () => {
    expect(consentCopy.prompt.optionLocalLabel).toContain("locally only");
    expect(consentCopy.prompt.optionSavedLabel).toContain("save to my account");
    expect(consentCopy.prompt.optionDeclinedLabel).toContain("Decline");
  });

  it("Continue button is verb-driven (UX-DR9) and stable regardless of selection", () => {
    expect(consentCopy.prompt.continueButton).toBe("Continue");
  });

  it("uploader error copy covers no-face / bad-type / too-large", () => {
    expect(consentCopy.uploader.errorNoFace).toMatch(/face/i);
    expect(consentCopy.uploader.errorBadType).toMatch(/JPG|PNG|WebP/);
    expect(consentCopy.uploader.errorTooLarge).toMatch(/10 MB/);
  });

  it("contains no exclamation marks in user-visible copy (UX-DR16 tone)", () => {
    const allStrings = [
      ...Object.values(consentCopy.uploader),
      ...Object.values(consentCopy.prompt),
    ];
    for (const s of allStrings) {
      expect(s).not.toContain("!");
    }
  });
});
