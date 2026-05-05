/// <reference types="@vitest/browser-playwright" />

import "vitest";

declare module "vitest" {
  // The generic parameter mirrors vitest's own Assertion<T>; it's only there
  // for shape-compatibility, hence the eslint suppression on this line.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Assertion<T = unknown> {
    toHaveNoViolations(): Promise<void>;
  }
  // toHaveNoViolations is async and cannot be used as an asymmetric matcher
  // (expect.toHaveNoViolations()). AsymmetricMatchersContaining is intentionally
  // omitted — the async return type is incompatible with asymmetric matcher semantics.
}
