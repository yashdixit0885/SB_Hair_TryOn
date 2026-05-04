import { describe, it, expect } from "vitest";

import { ProviderError } from "./errors";

describe("ProviderError", () => {
  it("is constructable with code + userMessage", () => {
    const err = new ProviderError("NOT_IMPLEMENTED", "stub method");
    expect(err.code).toBe("NOT_IMPLEMENTED");
    expect(err.userMessage).toBe("stub method");
    expect(err.message).toBe("stub method");
    expect(err.cause).toBeUndefined();
  });

  it("is an Error subclass", () => {
    const err = new ProviderError("CODE", "msg");
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(ProviderError);
    expect(err.name).toBe("ProviderError");
  });

  it("preserves the cause when supplied", () => {
    const cause = new Error("upstream");
    const err = new ProviderError("WRAPPED", "wrap msg", cause);
    expect(err.cause).toBe(cause);
  });
});
