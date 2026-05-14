import * as React from "react";
import { render, type RenderOptions, type RenderResult } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ProvidersContext,
  type Providers,
  createMockProviders,
} from "@/lib/providers";
import { noopArProvider } from "./noop-ar-provider";

interface ProvidersOptions extends Omit<RenderOptions, "wrapper"> {
  density?: "comfortable" | "compact";
  /** Per-slot provider overrides. Defaults to a no-op AR provider so tests
   *  for AR-touching components don't pull MediaPipe. Pass `{ ar: ... }` to
   *  swap in a custom AR stub (e.g. a low-confidence variant for fallback
   *  tests). */
  providers?: Partial<Providers>;
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: ProvidersOptions = {},
): RenderResult {
  const {
    density = "comfortable",
    providers: providerOverrides = {},
    ...renderOptions
  } = options;
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const providers = createMockProviders({
    overrides: { ar: noopArProvider(), ...providerOverrides },
  });
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ProvidersContext.Provider value={providers}>
          <div data-density={density}>{children}</div>
        </ProvidersContext.Provider>
      </QueryClientProvider>
    );
  }
  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

export { noopArProvider } from "./noop-ar-provider";
