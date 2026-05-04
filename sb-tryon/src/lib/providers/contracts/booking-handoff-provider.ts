// BookingHandoffProvider — deep-link to partner booking systems.
// Mock implementation: src/lib/providers/mock/MockBookingHandoffProvider.ts (Story 4.7 — placeholder confirmation).
// Production implementation: Booksy / Vagaro / Square / GlossGenius webhook integration.

export interface BookingHandoffPayload {
  salonId: string;
  lookId: string;
  // Signed attribution token from AttributionProvider.issueToken().
  token: string;
}

export interface BookingHandoffProvider {
  handoff(payload: BookingHandoffPayload): Promise<{ deepLinkUrl: string }>;
}
