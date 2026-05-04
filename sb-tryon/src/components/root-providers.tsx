"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

import { ProvidersContext, createProviders } from "@/lib/providers";

interface RootProvidersProps {
  children: ReactNode;
}

// Client-side wrapper for the two foundational root providers. Kept as a
// separate file so `app/layout.tsx` can stay a Server Component (it owns
// metadata, font loading, and Next's caching semantics).
//
// `createProviders()` runs *here* on the client at mount time — Next's RSC
// serialization rejects class instances crossing the Server→Client boundary,
// so providers can't be constructed in `layout.tsx` and passed via props.
// `useState(() => …)` gives a stable per-mount instance.
//
// Server Components that need provider access call `createProviders()`
// directly from `@/lib/providers` — they don't read from this context.
// The context exists solely for the Client Component tree (architecture §4).
export function RootProviders({ children }: RootProvidersProps) {
  const [providers] = useState(() => createProviders());
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60_000 },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <ProvidersContext.Provider value={providers}>{children}</ProvidersContext.Provider>
    </QueryClientProvider>
  );
}
