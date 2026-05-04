// Shared error class for every provider implementation.
// Architecture §5 — error handling boundary at the provider call.
// TanStack Query catches these and exposes via its `error` state; UI surfaces
// `userMessage` (never `error.message` directly, never `error.code`).
export class ProviderError extends Error {
  constructor(
    public readonly code: string,
    public readonly userMessage: string,
    public readonly cause?: unknown,
  ) {
    super(userMessage);
    this.name = "ProviderError";
  }
}
