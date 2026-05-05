import * as React from "react";
import { render, type RenderOptions, type RenderResult } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProvidersContext, createMockProviders } from "@/lib/providers";

interface ProvidersOptions extends Omit<RenderOptions, "wrapper"> {
  density?: "comfortable" | "compact";
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: ProvidersOptions = {},
): RenderResult {
  const { density = "comfortable", ...renderOptions } = options;
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const providers = createMockProviders();
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
