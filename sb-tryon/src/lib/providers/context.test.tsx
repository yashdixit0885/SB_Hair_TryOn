import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProvidersContext, createMockProviders, useProvider } from "@/lib/providers";

describe("useProvider", () => {
  it("returns the requested provider when wrapped in ProvidersContext", () => {
    const providers = createMockProviders();
    const captured: { ar?: unknown; reviews?: unknown; editorial?: unknown } = {};

    function Probe() {
      captured.ar = useProvider("ar");
      captured.reviews = useProvider("reviews");
      captured.editorial = useProvider("editorial");
      return null;
    }

    render(
      <ProvidersContext.Provider value={providers}>
        <Probe />
      </ProvidersContext.Provider>,
    );

    expect(captured.ar).toBe(providers.ar);
    expect(captured.reviews).toBe(providers.reviews);
    expect(captured.editorial).toBe(providers.editorial);
  });

  it("throws a clear error when used outside <ProvidersContext.Provider>", () => {
    function Naked() {
      useProvider("ar");
      return null;
    }
    // Suppress React's expected-error console output so the test log stays clean.
    const consoleError = console.error;
    console.error = () => {};
    try {
      expect(() => render(<Naked />)).toThrow(
        /useProvider must be used within <ProvidersContext.Provider>/,
      );
    } finally {
      console.error = consoleError;
    }
  });
});
