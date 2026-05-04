# Production Provider Implementations

This directory holds Production V1 provider implementations. **Currently empty by design** — Demo V1 ships with mock providers from [`../mock/`](../mock/), and production implementations land post-funding when vendor procurement (Sally Rewards SSO, BSG API, licensed AR SDK, Twilio, SendGrid, Booksy/Vagaro/Square, etc.) is complete.

When implementing here, name files `{Vendor}{Interface}.ts` (e.g. `LicensedARProvider.ts`, `SallyRewardsAuthProvider.ts`, `TwilioSendgridNotificationProvider.ts`). Each must:

1. Import its contract from `@/lib/providers/contracts/{provider-name}.ts`.
2. Implement the contract's `interface` exactly — every method async, no extra public methods.
3. Throw [`ProviderError`](../errors.ts) (not bare `Error`) for failure paths so TanStack Query can surface `userMessage` to the UI.
4. Be wired into `createProviders()` in [`../factory.ts`](../factory.ts) under the `"production"` mode branch.

See [architecture.md §4](../../../../_bmad-output/planning-artifacts/architecture.md) — *Provider Interface Inventory* — for the full mock → production mapping.
